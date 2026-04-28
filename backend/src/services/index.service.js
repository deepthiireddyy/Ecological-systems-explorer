const { ee: getEE, eeGeometryFromGeoJSON, getImageCollection, computeIndex, PALETTES } = require('./gee.service');

async function getIndexMapId({ dataset, aoi, startDate, endDate, cloudCover, indexName, renderType, palette }) {
  const ee = getEE();
  const aoiGeom = eeGeometryFromGeoJSON(aoi);
  const collection = getImageCollection(dataset, aoiGeom, startDate, endDate, cloudCover);
  const composite = collection.median().clip(aoiGeom);
  const indexImg = computeIndex(composite, dataset, indexName);

  if (!indexImg) throw new Error(`Index ${indexName} not supported for ${dataset}`);

  const stats = await new Promise((resolve, reject) => {
    indexImg.reduceRegion({
      reducer: ee.Reducer.minMax(),
      geometry: aoiGeom,
      scale: 30,
      maxPixels: 1e13,
      bestEffort: true
    }).evaluate((res, err) => {
      if (err) return reject(new Error(err));
      resolve(res);
    });
  });

  let min = 0, max = 1;
  for (const key in stats) {
    if (key.endsWith('_min') && stats[key] !== null) min = stats[key];
    if (key.endsWith('_max') && stats[key] !== null) max = stats[key];
  }

  const vizParams = { min, max };

  if (renderType === 'Color Gradient' && palette && PALETTES[palette]) {
    vizParams.palette = PALETTES[palette];
  } else if (renderType === 'Grayscale') {
    vizParams.palette = PALETTES.Grayscale;
  }

  return new Promise((resolve, reject) => {
    indexImg.getMapId(vizParams, (obj, err) => {
      if (err) return reject(new Error(err));
      resolve({
        mapId: obj.mapid,
        token: obj.token,
        tileUrl: obj.urlFormat,
        min,
        max
      });
    });
  });
}

module.exports = { getIndexMapId };
