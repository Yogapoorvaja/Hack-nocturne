const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/analyze', async (req, res) => {
  try {
    // 1. Get audio data from request (base64 or file path)
    const audioData = req.body.audio; 

    // 2. Call your friend's ML API
    const mlResponse = await axios.post('FRIEND_ML_API_URL', {
      audio: audioData,
      api_key: process.env.ML_API_KEY // From .env
    });

    // 3. Send results to frontend
    res.json({
      success: true,
      analysis: mlResponse.data
    });

  } catch (err) {
    res.status(500).json({ 
      error: "ML processing failed",
      details: err.message 
    });
  }
});

module.exports = router;