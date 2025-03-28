import React from 'react';
import '../styles/DnaVisualization.css';

// Enhanced DNA visualization with real data
export default function DnaVisualization({ data }) {
    return (
      <div className="dna-strand">
        {data.biomarkers.map((value, i) => (
          <div 
            key={i}
            className="dna-node"
            style={{
              height: `${value * 10}px`,
              background: i % 2 ? '#6e00ff' : '#00f0ff',
              opacity: 0.3 + (value * 0.7)
            }}
          />
        ))}
      </div>
    );
  }