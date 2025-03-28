const mongoose = require('mongoose');

const RecordingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  audioFile: { type: String, required: true },
  duration: { type: Number, required: true },
  analysisResult: {
    parkinsonsRisk: Number,
    alzheimersRisk: Number,
    depressionRisk: Number,
    notes: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recording', RecordingSchema);