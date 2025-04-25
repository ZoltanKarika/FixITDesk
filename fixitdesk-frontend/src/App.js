import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed React import from here

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login'; // Add your Login component if necessary

const App = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> {/* Assuming Login route */}
      </Routes>
    </div>
  );
};

export default App;
