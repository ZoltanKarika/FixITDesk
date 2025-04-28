// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await api.post('/api/accounts/logout/');
        console.log(response.data.message); // "Logged out successfully!"
        navigate('/accounts/login')
        return true;
      } catch (error) {
        console.error("Logout failed:", error);
        navigate('/accounts/login')
        return false;
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
