const express = require('express');
const router = express.Router();
const { getCompositeMapId, getCollectionCount } = require('../services/imagery.service');

// POST /api/imagery/composite
router.post('/composite', async (req, res) => {
  try {
    const { dataset, aoi, startDate, endDate, cloudCover = 8, vizType = 'true' } = req.body;

    if (!dataset || !aoi || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields: dataset, aoi, startDate, endDate' });
    }

    const count = await getCollectionCount({ dataset, aoi, startDate, endDate, cloudCover });

    if (count === 0) {
      return res.status(404).json({ error: 'No images found for selected parameters' });
    }

    const result = await getCompositeMapId({ dataset, aoi, startDate, endDate, cloudCover, vizType });
    res.json({ success: true, ...result, imageCount: count });

  } catch (err) {
    console.error('Imagery error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
