import { useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home.js';

import About from './pages/About';
import Research from './pages/Research';
import Team from './pages/Team';
import Contact from './pages/Contact';


// import { ThemeProvider, createTheme } from '@mui/material';
// const theme = createTheme();

function App() {
  useEffect(() => {
    axios.get('http://localhost:5000/api/test')
      .then(res => console.log('Backend test:', res.data))
      .catch(err => console.error('Connection error:', err));
  }, []);

  return (
    <div className="app">
    <Home />
  </div>
  );
}

export default App;