import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ Import and use navigate

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get('/api/accounts/whoami/');
        if (!response.ok) {
          navigate('/gatekeeper');
          return;
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/gatekeeper');
      }
    };

    checkUser(); // ✅ You forgot to call it!
  }, [navigate]);

  return (
    <div className='p-top enter'>
      <div className='ticket-details-page'>
        <h1>Welcome {user ? user.username : 'Guest'}!</h1>
        <div>This is your dashboard.</div>
      </div>
    </div>
  );
};

export default Dashboard;