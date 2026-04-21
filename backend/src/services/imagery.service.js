const { ee: getEE, eeGeometryFromGeoJSON, getImageCollection } = require('./gee.service');

async function getCompositeMapId({ dataset, aoi, startDate, endDate, cloudCover, vizType }) {
  const ee = getEE();
  const aoiGeom = eeGeometryFromGeoJSON(aoi);
  const collection = getImageCollection(dataset, aoiGeom, startDate, endDate, cloudCover);
  const composite = collection.median().clip(aoiGeom);

  let vizParams;

  if (dataset === 'Sentinel-2') {
    vizParams = vizType === 'false'
      ? { bands: ['B8', 'B4', 'B3'], min: 500, max: 3500, gamma: 1.2 }
      : { bands: ['B4', 'B3', 'B2'], min: 500, max: 3500, gamma: 1.2 };
  } else if (dataset === 'Sentinel-1 (SAR)') {
    vizParams = { bands: ['VV'], min: -20, max: 0 };
  }

  return new Promise((resolve, reject) => {
    composite.getMapId(vizParams, (obj, err) => {
      if (err) return reject(new Error(err));
      resolve({
        mapId: obj.mapid,
        token: obj.token,
        tileUrl: obj.urlFormat
      });
    });
  });
}

async function getCollectionCount({ dataset, aoi, startDate, endDate, cloudCover }) {
  const ee = getEE();
  const aoiGeom = eeGeometryFromGeoJSON(aoi);
  const collection = getImageCollection(dataset, aoiGeom, startDate, endDate, cloudCover);

  return new Promise((resolve, reject) => {
    collection.size().evaluate((size, err) => {
      if (err) return reject(new Error(err));
      resolve(size);
    });
  });
}

module.exports = { getCompositeMapId, getCollectionCount };
