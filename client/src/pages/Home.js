import React from 'react';
import Navbar from '../components/Navbar/Navbar.js';
import Chatbot from '../components/Chatbot/Chatbot';
import AnimatedBackground from '../components/AnimatedBackground';
import '../styles/global.css';

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <section className="hero">
          <h1>Voice Detect Personal AI Voice Health Analyzer</h1>
        </section>
        <Chatbot />
      </main>
    </div>
  );
}