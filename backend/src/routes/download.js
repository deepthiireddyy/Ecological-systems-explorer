const express = require('express');
const router = express.Router();
const { generateDownloadUrl } = require('../services/download.service');

// POST /api/download/generate-url
router.post('/generate-url', async (req, res) => {
  try {
    const { dataset, aoi, startDate, endDate, cloudCover = 8, indices } = req.body;

    if (!dataset || !aoi || !startDate || !endDate || !indices?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await generateDownloadUrl({ dataset, aoi, startDate, endDate, cloudCover, indices });
    res.json({ success: true, ...result });

  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
