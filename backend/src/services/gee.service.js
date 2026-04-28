const ee = require('@google/earthengine');

let initialized = false;

async function initializeGEE() {
  if (initialized) return;

  const credentials = JSON.parse(process.env.GEE_SERVICE_ACCOUNT_JSON);

  if (!credentials) {
    throw new Error("GEE credentials not found in ENV");
  }

  return new Promise((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      credentials,
      () => {
        ee.initialize(
          null,
          null,
          () => {
            initialized = true;
            console.log('GEE initialized successfully with project:', credentials.project_id);
            resolve();
          },
          (err) => reject(new Error('GEE init failed: ' + err)),
          {
            project: credentials.project_id
          }
        );
      },
      (err) => reject(new Error('GEE auth failed: ' + err))
    );
  });
}

function eeGeometryFromGeoJSON(geojson) {
  if (geojson.type === 'FeatureCollection') {
    return ee.FeatureCollection(geojson).geometry();
  }
  if (geojson.type === 'Feature') {
    return ee.Geometry(geojson.geometry);
  }
  return ee.Geometry(geojson);
}

// ── Dataset collections ─────────────────────────────
function getImageCollection(dataset, aoiGeom, startDate, endDate, cloudCover) {
  if (dataset === 'Sentinel-2') {
    return ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterBounds(aoiGeom)
      .filterDate(startDate, endDate)
      .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', cloudCover));
  }

  if (dataset === 'Sentinel-1 (SAR)') {
    return ee.ImageCollection('COPERNICUS/S1_GRD')
      .filterBounds(aoiGeom)
      .filterDate(startDate, endDate)
      .filter(ee.Filter.eq('instrumentMode', 'IW'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .select(['VV', 'VH']);
  }

  return ee.ImageCollection([]);
}

// ── Index computation ─────────────────────────────
function computeIndex(image, dataset, indexName) {
  if (dataset === 'Sentinel-1 (SAR)') {
    const vv = ee.Image(10).pow(image.select('VV').divide(10));
    const vh = ee.Image(10).pow(image.select('VH').divide(10));
    const mask = vh.gt(0).and(vv.gt(0));

    if (indexName === 'RVI') {
      return vh.updateMask(mask).multiply(4)
        .divide(vv.updateMask(mask).add(vh.updateMask(mask)))
        .rename('RVI').clamp(0, 1);
    }
    // if (indexName === 'VV-VH') {
    //   return vv.subtract(vh).rename('VV_VH');
    // }
    if (indexName === 'VV/VH') {
      return vv.divide(vh).rename('VV_div_VH').clamp(0, 10);
    }
  }

  if (dataset === 'Sentinel-2') {
    if (indexName === 'NDVI') {
      return image.normalizedDifference(['B8', 'B4']).rename('NDVI');
    }
    if (indexName === 'NDWI') {
      return image.normalizedDifference(['B3', 'B8']).rename('NDWI');
    }
    if (indexName === 'RESI') {
      return image.normalizedDifference(['B5', 'B4']).rename('RESI');
    }
  }

  return null;
}

const PALETTES = {
  Grayscale: ['000000', 'ffffff'],
  Spectral: ['9e0142', 'f46d43', 'ffffbf', '74add1', '5e4fa2'],
  Viridis: ['440154', '3b528b', '21908d', '5dc863', 'fde725'],
  Plasma: ['0d0887', '7e03a8', 'cc4778', 'f89441', 'f0f921'],
  RdYlGn: ['a50026', 'f46d43', 'ffffbf', '66bd63', '006837']
};

module.exports = {
  initializeGEE,
  eeGeometryFromGeoJSON,
  getImageCollection,
  computeIndex,
  PALETTES,
  ee: () => ee
};