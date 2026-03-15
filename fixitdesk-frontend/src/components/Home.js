import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

import { useUserHandler } from './UserHandler';

const Home = () => {
  const { user, loginHandler, logoutHandler } = useUserHandler();
  const navigate = useNavigate(); // ✅ Import and use navigate
  console.log(user);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get('/api/accounts/whoami/');
        if (!response.ok) {
          logoutHandler();
          navigate('/gatekeeper');
          return;
        }
        const data = await response.json();
        loginHandler(data);
      } catch (error) {
        console.error('Error checking user:', error);
        logoutHandler();
        navigate('/gatekeeper');
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className='p-top enter'>
      <div className='ticket-details-page'>
        <h1>Welcome {user ? user.username : 'Guest'}!</h1>
        <div>This is the homepage of the FixIT ticket management. Check the instructions below!</div>
      </div>
      <div>1-placeholder-Tickets</div>
      <div>2-placeholder-Fixer</div>
      <div>3-placeholder-Create Ticket</div>
      <div>4-placeholder-Statistics</div>
      <div>5-placeholder-Manage Users</div>
    </div>
  );
};

export default Home;