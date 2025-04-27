import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed React import from here

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login'; // Add your Login component if necessary
import Logout from './components/Logout';
import TokenExpiry from './components/TokenExpiry';
import Tickets from './components/Tickets';
import Dashboard from './components/Dashboard';
import SubmitTicket from './components/SubmitTicket';
import NavBar from "./components/navbar";
import TicketPage from './components/TicketView';


const App = () => {
  return (
    <div>
      <NavBar /> 
      <TokenExpiry />
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/accounts/register" element={<Register />} />
        <Route path="/accounts/login" element={<Login />} /> {/* Assuming Login route */}
        <Route path="/accounts/logout" element={<Logout />} /> {/* Add logout route */}
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/submitticket" element={<SubmitTicket />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets/:ticketId/" element={<TicketPage/>} />
      </Routes>
    </div>
  );
};

export default App;
