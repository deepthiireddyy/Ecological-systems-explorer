
const {
  ee: getEE,
  eeGeometryFromGeoJSON,
  getImageCollection,
  computeIndex
} = require('./gee.service');

const SAFE_BAND_NAMES = {
  RVI: 'RVI',
  'VV/VH': 'VV_div_VH',
  NDVI: 'NDVI',
  NDWI: 'NDWI',
  RESI: 'RESI'
};

const SUPPORTED_INDICES = {
  'Sentinel-2': ['NDVI', 'NDWI', 'RESI'],
  'Sentinel-1 (SAR)': ['RVI', 'VV/VH']
};

function getRequiredBands(dataset, indices) {
  const bands = new Set();

  if (dataset === 'Sentinel-2') {
    for (const index of indices) {
      if (index === 'NDVI') {
        bands.add('B8');
        bands.add('B4');
      } else if (index === 'NDWI') {
        bands.add('B3');
        bands.add('B8');
      } else if (index === 'RESI') {
        bands.add('B5');
        bands.add('B4');
      }
    }
  } else if (dataset === 'Sentinel-1 (SAR)') {
    for (const index of indices) {
      if (index === 'RVI' || index === 'VV/VH') {
        bands.add('VV');
        bands.add('VH');
      }
    }
  }

  return [...bands];
}

async function generateDownloadUrl({
  dataset,
  aoi,
  startDate,
  endDate,
  cloudCover = 80,
  indices
}) {
  const ee = getEE();

  if (!aoi || !dataset || !startDate || !endDate) {
    throw new Error('Dataset, AOI, start date and end date are required.');
  }

  if (!Array.isArray(indices) || indices.length === 0) {
    throw new Error('Select at least one index.');
  }

  const supported = SUPPORTED_INDICES[dataset];

  if (!supported) {
    throw new Error(`Unsupported dataset: ${dataset}`);
  }

  const invalid = indices.filter(index => !supported.includes(index));

  if (invalid.length) {
    throw new Error(
      `Unsupported indices for ${dataset}: ${invalid.join(', ')}`
    );
  }

  console.log('[DOWNLOAD] Starting', {
    dataset,
    startDate,
    endDate,
    indices
  });

  try {
    const aoiGeom = eeGeometryFromGeoJSON(aoi);
    console.log('[DOWNLOAD] AOI geometry created');

    const requiredBands = getRequiredBands(dataset, indices);

    if (!requiredBands.length) {
      throw new Error('No source bands found for the selected indices.');
    }

    const collection = getImageCollection(
      dataset,
      aoiGeom,
      startDate,
      endDate,
      cloudCover
    ).select(requiredBands);

    console.log('[DOWNLOAD] Image collection prepared');

    // Calculate indices for each image first, so the composite contains
    // only the requested index bands.
    const indexCollection = collection.map(image => {
      let result = null;

      for (const index of indices) {
        const computed = computeIndex(image, dataset, index);

        if (!computed) continue;

        const bandName = SAFE_BAND_NAMES[index] || index;
        const renamed = computed.rename(bandName);

        result = result
          ? result.addBands(renamed)
          : renamed;
      }

      return ee.Image(result)
        .copyProperties(image, ['system:time_start']);
    });

    console.log('[DOWNLOAD] Per-image index calculation configured');

    const composite = indexCollection
      .median()
      .clip(aoiGeom);

    console.log('[DOWNLOAD] Index composite configured');

    // Keep the existing scale convention for compatibility.
    const exportImage = composite
      .multiply(10000)
      .toInt16();

    console.log('[DOWNLOAD] Requesting direct download URL');

    return await new Promise((resolve, reject) => {
      exportImage.getDownloadURL({
        name: `${dataset.replace(/[^a-zA-Z0-9]/g, '_')}_Indices`,
        region: aoiGeom.bounds(),
        scale: 30,
        fileFormat: 'GeoTIFF',
        filePerBand: true
      }, (url, err) => {
        if (err) {
          console.error('[DOWNLOAD] Earth Engine error:', err);

          return reject(
            new Error(
              typeof err === 'string'
                ? err
                : err.message || JSON.stringify(err)
            )
          );
        }

        if (!url) {
          return reject(
            new Error('Earth Engine returned no download URL.')
          );
        }

        console.log('[DOWNLOAD] URL generated successfully');

        resolve({ url, indices, dataset });
      });
    });
  } catch (error) {
    console.error('[DOWNLOAD] Failed:', error.message);
    throw error;
  }
}

module.exports = { generateDownloadUrl };