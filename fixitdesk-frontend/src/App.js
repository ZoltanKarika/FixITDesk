import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed React import from here

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
        <Route path="/accounts/register" element={<Register />} />
        <Route path="/accounts/login" element={<Login />} /> {/* Assuming Login route */}
        <Route path="/accounts/logout" element={<Logout />} /> {/* Add logout route */}
        <Route path="/tickets" element={<Tickets />} />
      </Routes>
    </div>
  );
};

export default App;
