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
          navigate('/accounts/login');
          return;
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/accounts/login');
      }
    };

    checkUser(); // ✅ You forgot to call it!
  }, [navigate]);

  return (
    <div>
      <h2>Welcome {user ? user.username : 'Guest'}!</h2>
      <p>This is your dashboard.</p>
    </div>
  );
};

export default Dashboard;