const { ee: getEE, eeGeometryFromGeoJSON, getImageCollection, computeIndex } = require('./gee.service');

const SAFE_BAND_NAMES = {
  'RVI': 'RVI',
  // 'VV-VH': 'VV_minus_VH',
  'VV/VH': 'VV_div_VH',
  'NDVI': 'NDVI',
  'NDWI': 'NDWI',
  'RESI': 'RESI'
};

async function generateDownloadUrl({ dataset, aoi, startDate, endDate, cloudCover, indices }) {
  const ee = getEE();
  const aoiGeom = eeGeometryFromGeoJSON(aoi);
  const collection = getImageCollection(dataset, aoiGeom, startDate, endDate, cloudCover);
  const baseImage = collection.median().clip(aoiGeom);

  let stacked = null;

  for (const idx of indices) {
    const img = computeIndex(baseImage, dataset, idx);
    if (!img) continue;
    const safeName = SAFE_BAND_NAMES[idx] || idx.replace(/[^a-zA-Z0-9_]/g, '_');
    const renamed = img.rename(safeName);
    stacked = stacked ? stacked.addBands(renamed) : renamed;
  }

  if (!stacked) throw new Error('No valid indices computed');

  const exportImage = stacked.multiply(10000).toInt16();

  return new Promise((resolve, reject) => {
    exportImage.clip(aoiGeom).getDownloadURL({
      name: `${dataset.replace(/[^a-zA-Z0-9]/g, '_')}_Indices`,
      region: aoiGeom.bounds(),
      scale: 30,
      fileFormat: 'GeoTIFF',
      filePerBand: true,
      maxPixels: 1e13
    }, (url, err) => {
      if (err) return reject(new Error(err));
      resolve({ url, indices, dataset });
    });
  });
}

module.exports = { generateDownloadUrl };
