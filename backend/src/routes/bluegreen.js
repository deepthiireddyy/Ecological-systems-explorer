const express = require('express');
const router = express.Router();
const { getGreenCoverMapId, getBlueCoverMapId, getBlueGreenSystemMapId } = require('../services/bluegreen.service');

// POST /api/bluegreen/green
router.post('/green', async (req, res) => {
  try {
    const { aoi, startDate, endDate, cloudCover = 8 } = req.body;
    if (!aoi || !startDate || !endDate) return res.status(400).json({ error: 'Missing fields' });
    const result = await getGreenCoverMapId({ aoi, startDate, endDate, cloudCover });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Green cover error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bluegreen/blue
router.post('/blue', async (req, res) => {
  try {
    const { aoi, startDate, endDate, cloudCover = 8 } = req.body;
    if (!aoi || !startDate || !endDate) return res.status(400).json({ error: 'Missing fields' });
    const result = await getBlueCoverMapId({ aoi, startDate, endDate, cloudCover });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Blue cover error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bluegreen/system
router.post('/system', async (req, res) => {
  try {
    const { aoi, startDate, endDate, cloudCover = 8 } = req.body;
    if (!aoi || !startDate || !endDate) return res.status(400).json({ error: 'Missing fields' });
    const result = await getBlueGreenSystemMapId({ aoi, startDate, endDate, cloudCover });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('BG system error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
