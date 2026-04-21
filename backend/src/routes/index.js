const express = require('express');
const router = express.Router();
const { getIndexMapId } = require('../services/index.service');

// POST /api/index/compute
router.post('/compute', async (req, res) => {
  try {
    const {
      dataset, aoi, startDate, endDate,
      cloudCover = 8, indexName, renderType = 'Color Gradient', palette = 'Viridis'
    } = req.body;

    if (!dataset || !aoi || !startDate || !endDate || !indexName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await getIndexMapId({
      dataset, aoi, startDate, endDate,
      cloudCover, indexName, renderType, palette
    });

    res.json({ success: true, ...result });

  } catch (err) {
    console.error('Index error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
