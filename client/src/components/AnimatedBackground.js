import React from 'react';
import './AnimatedBackground.css';
import backgroundImage from '../assets/images/bgimg.png'; 
export default function AnimatedBackground() {
  return (
    <div 
    className="animated-bg"
    style={{ backgroundImage: `url(${backgroundImage})` }} // Dynamic URL
  >
    <div className="gradient-overlay"></div>
  </div>
);
}