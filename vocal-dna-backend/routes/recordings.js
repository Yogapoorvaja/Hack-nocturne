const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Recording = require('../models/Recording');
const  authenticate  = require('../middleware/auth');

// Configure Multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});


// Upload recording
router.post('/', authenticate, upload.single('audio'), async (req, res) => {
  try {
    const recording = new Recording({
      userId: req.user.id,
      audioFile: req.file.path,
      duration: req.body.duration || 10 // Default 10 seconds
    });
    await recording.save();
    res.status(201).json(recording);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's recordings
router.get('/', authenticate, async (req, res) => {
  try {
    const recordings = await Recording.find({ userId: req.user.id });
    res.json(recordings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/analyze', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    console.log("Received file:", req.file); // Verify file exists
    // Process your file here (e.g., send to ML model)

    res.json({
      success: true,
      message: "File received",
      filename: req.file.filename
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})
module.exports = router;