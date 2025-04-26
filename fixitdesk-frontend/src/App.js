import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed React import from here

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login'; // Add your Login component if necessary
import Logout from './components/Logout';
import TokenExpiry from './components/TokenExpiry';
import Tickets from './components/Tickets';

const App = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <TokenExpiry />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> {/* Assuming Login route */}
        <Route path="/logout" element={<Logout />} /> {/* Add logout route */}
        <Route path="/tickets" element={<Tickets />} />
      </Routes>
    </div>
  );
};

export default App;
