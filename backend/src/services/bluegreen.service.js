const { ee: getEE, eeGeometryFromGeoJSON } = require('./gee.service');

function getSentinel2Collection(ee, aoiGeom, startDate, endDate, cloudCover) {
  return ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(aoiGeom)
    .filterDate(startDate, endDate)
    .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', cloudCover))
    .select(['B2', 'B3', 'B4', 'B8']);
}

function getGreenCoverImage(img, ee) {
  const ndvi = img.normalizedDifference(['B8', 'B4']);
  return ndvi.expression(
    "(ndvi >= 0.2 && ndvi < 0.4) ? 1 : (ndvi >= 0.4 && ndvi < 0.6) ? 2 : (ndvi >= 0.6 && ndvi <= 1) ? 3 : 0",
    { ndvi }
  ).selfMask();
}

function getBlueCoverImage(img, ee) {
  const ndwi = img.normalizedDifference(['B3', 'B8']);
  return ndwi.expression(
    "(ndwi >= 0.2 && ndwi < 0.4) ? 1 : (ndwi >= 0.4 && ndwi < 0.6) ? 2 : (ndwi >= 0.6 && ndwi <= 1) ? 3 : 0",
    { ndwi }
  ).selfMask();
}

async function computeRangeAreas(indexImage, bandName, aoiGeom, ee) {
  const ranges = [
    { label: 'Low (0.2–0.4)', min: 0.2, max: 0.4 },
    { label: 'Moderate (0.4–0.6)', min: 0.4, max: 0.6 },
    { label: 'High (0.6–1.0)', min: 0.6, max: 1.01 }
  ];

  const areaImg = ee.Image.pixelArea();
  const computations = ranges.map(r => {
    const masked = indexImage.select(bandName)
      .gte(r.min).and(indexImage.select(bandName).lt(r.max))
      .selfMask().multiply(areaImg);
    return masked.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoiGeom,
      scale: 10,
      maxPixels: 1e13
    }).get(bandName);
  });

  return new Promise((resolve, reject) => {
    ee.List(computations).evaluate((vals, err) => {
      if (err) return reject(new Error(err));
      const results = {};
      ranges.forEach((r, i) => {
        results[r.label] = ((vals[i] || 0) / 1e6);
      });
      resolve(results);
    });
  });
}

async function getGreenCoverMapId({ aoi, startDate, endDate, cloudCover }) {
  const ee = getEE();
  const aoiGeom = eeGeometryFromGeoJSON(aoi);
  const img = getSentinel2Collection(ee, aoiGeom, startDate, endDate, cloudCover).median().clip(aoiGeom);
  const green = getGreenCoverImage(img, ee);
  const ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');

  const [tileData, areas] = await Promise.all([
    new Promise((resolve, reject) => {
      green.getMapId({ min: 1, max: 3, palette: ['c7e9c0', '41ab5d', '00441b'] }, (obj, err) => {
        if (err) return reject(new Error(err));
        resolve({
          tileUrl: obj.urlFormat,
        });
      });
    }),
    computeRangeAreas(ndvi, 'NDVI', aoiGeom, ee)
  ]);

  return { ...tileData, areas, type: 'green' };
}

async function getBlueCoverMapId({ aoi, startDate, endDate, cloudCover }) {
  const ee = getEE();
  const aoiGeom = eeGeometryFromGeoJSON(aoi);
  const img = getSentinel2Collection(ee, aoiGeom, startDate, endDate, cloudCover).median().clip(aoiGeom);
  const blue = getBlueCoverImage(img, ee);
  const ndwi = img.normalizedDifference(['B3', 'B8']).rename('NDWI');

  const [tileData, areas] = await Promise.all([
    new Promise((resolve, reject) => {
      blue.getMapId({ min: 1, max: 3, palette: ['c6dbef', '6baed6', '08306b'] }, (obj, err) => {
        if (err) return reject(new Error(err));
        resolve({
          tileUrl: obj.urlFormat,
        });
      });
    }),
    computeRangeAreas(ndwi, 'NDWI', aoiGeom, ee)
  ]);

  return { ...tileData, areas, type: 'blue' };
}

async function getBlueGreenSystemMapId({ aoi, startDate, endDate, cloudCover }) {
  const ee = getEE();
  const aoiGeom = eeGeometryFromGeoJSON(aoi);
  const img = getSentinel2Collection(ee, aoiGeom, startDate, endDate, cloudCover).median().clip(aoiGeom);

  const green = getGreenCoverImage(img, ee);
  const blueRaw = getBlueCoverImage(img, ee);
  const blue = blueRaw.where(blueRaw.eq(1), 4).where(blueRaw.eq(2), 5).where(blueRaw.eq(3), 6);
  const system = green.unmask(0).add(blue.unmask(0)).selfMask();

  const ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
  const ndwi = img.normalizedDifference(['B3', 'B8']).rename('NDWI');

  const [tileData, vegAreas, waterAreas] = await Promise.all([
    new Promise((resolve, reject) => {
      system.getMapId({
        min: 1, max: 6,
        palette: ['c7e9c0', '41ab5d', '00441b', 'c6dbef', '6baed6', '08306b']
      }, (obj, err) => {
        if (err) return reject(new Error(err));
        resolve({
          tileUrl: obj.urlFormat,
        });
      });
    }),
    computeRangeAreas(ndvi, 'NDVI', aoiGeom, ee),
    computeRangeAreas(ndwi, 'NDWI', aoiGeom, ee)
  ]);

  return { ...tileData, vegAreas, waterAreas, type: 'bluegreen' };
}

module.exports = { getGreenCoverMapId, getBlueCoverMapId, getBlueGreenSystemMapId };
