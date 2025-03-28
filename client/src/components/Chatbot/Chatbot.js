import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const mediaRecorder = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setApiError(null);
      setAnalysisResult(null); // Clear previous results on new file
    }
  };

  const analyzeAudio = async (audioBlob) => {
    setIsAnalyzing(true);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 15000 // 15-second timeout
      });

      setAnalysisResult(response.data);
      return response.data;
    } catch (err) {
      console.error("Full error:", {
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      });
      setApiError(err.response?.data?.message || 'Analysis failed. Please try again.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      return;
    }

    try {
      setIsRecording(true);
      setApiError(null);
      setAnalysisResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const audioChunks = [];
      
      mediaRecorder.current.ondataavailable = (e) => audioChunks.push(e.data);
      
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await analyzeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };
      
      mediaRecorder.current.start();
      setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          mediaRecorder.current.stop();
        }
      }, 10000); // Auto-stop after 10s
    } catch (err) {
      console.error("Recording error:", err);
      setApiError(err.message);
      setIsRecording(false);
    }
  };

  const handleUploadAnalysis = async () => {
    if (!uploadedFile) return;
    try {
      const audioBlob = new Blob([uploadedFile], { type: uploadedFile.type });
      await analyzeAudio(audioBlob);
    } catch (err) {
      console.error('Upload analysis error:', err);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Hi there! How can I help?</h3>
      </div>
      
      <div className="chatbot-body">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        
        <div className="action-buttons">
          <button 
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleRecording}
            disabled={isAnalyzing}
          >
            {isRecording ? (
              <>
                <span className="pulse-dot"></span>
                Stop Recording
              </>
            ) : (
              '🎤 Record Voice'
            )}
          </button>
          
          <label className="file-upload-btn">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".wav,.mp3,.ogg,audio/*"
              disabled={isRecording || isAnalyzing}
              hidden
            />
            📎 {uploadedFile ? 
              uploadedFile.name.substring(0, 15) + 
              (uploadedFile.name.length > 15 ? '...' : '') : 
              'Upload Audio'}
          </label>
          
          <button 
            className={`analyze-btn ${isAnalyzing ? 'analyzing' : ''}`}
            onClick={handleUploadAnalysis}
            disabled={!uploadedFile || isAnalyzing || isRecording}
          >
            {isAnalyzing ? 'Analyzing...' : '🔍 Analyze'}
          </button>
        </div>
        
        {apiError && (
          <div className="error-message">
            ⚠️ {apiError}
          </div>
        )}

        {analysisResult && (
          <div className="analysis-report">
            <h4>Diagnostic Report</h4>
            <div className="report-item">
              <span className="report-label">Condition Detected:</span>
              <span className={`report-value ${
                analysisResult.hasCondition ? 'danger' : 'safe'
              }`}>
                {analysisResult.hasCondition ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="report-item">
              <span className="report-label">Confidence:</span>
              <span className="report-value">
                {analysisResult.confidence}%
              </span>
            </div>
            <div className="biomarkers">
              <h5>Biomarkers:</h5>
              <ul>
                {Object.entries(analysisResult.biomarkers).map(([key, value]) => (
                  <li key={key}>
                    <span className="biomarker-name">{key}:</span>
                    <span className="biomarker-value">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}