// routes/analysis.js
const express = require('express');
const router = express.Router();
const Recording = require('../models/Recording.js');
const  authenticate  = require('../middleware/auth.js');

// Analysis endpoint
router.post('/:id', authenticate, async (req, res) => {  // Now has proper middleware
    try {
      const recording = await Recording.findById(req.params.id);
      if (!recording) return res.status(404).json({ error: 'Recording not found' });
      
      // Mock analysis (replace with real AI later)
      const mockAnalysis = {
        parkinsonsRisk: Math.floor(Math.random() * 100),
        alzheimersRisk: Math.floor(Math.random() * 50),
        depressionRisk: Math.floor(Math.random() * 70),
        notes: "Simulated analysis for demo purposes"
      };
      
      recording.analysisResult = mockAnalysis;
      await recording.save();
      
      res.json(recording);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports = router;