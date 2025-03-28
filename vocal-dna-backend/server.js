require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');
const app = express();
const mlRouter = require('./routes/ml');
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/ml', mlRouter);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/recordings', require('./routes/recordings.js'));
app.use('/api/analysis', require('./routes/analysis.js'));

app.get('/', (req, res) => {
    res.send('Vocal DNA Backend is running!');
});
//test mongo
app.get('/api/test', async (req, res) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      res.json({ 
        status: 'MongoDB connected',
        collections: collections.map(c => c.name) 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.post('/api/analyze', upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file received" });
      }
      console.log("Processing file:", req.file.path);
      
      // Your analysis logic here
      res.json({
        success: true,
        parkinsonsRisk: Math.random() * 100, // Mock data
        alzheimersRisk: Math.random() * 50,
        biomarkers: []
      });
    } catch (err) {
      console.error("Analysis error:", err);
      res.status(500).json({ error: "Analysis failed" });
    }
  });
  app.get('/api/analyze', (req, res) => {
    res.json({ 
      message: "Send a POST request with audio file to this endpoint",
      example: {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: { audio: "[WAV_FILE]" }
      }
    });
  });
app.listen(process.env.PORT, () => 
  console.log(`Backend running on http://localhost:${process.env.PORT}`)
);