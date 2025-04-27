// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch('https://localhost:8000/api/accounts/logout/', {
          method: 'POST',
          credentials: 'include', // Always needed for sending cookies!
        });

        if (response.ok) {
          console.log('Logout successful');
          navigate('/login'); // Redirect to login page
        } else {
          console.error('Logout failed:', await response.text());
          // Still navigate to login even if backend had small error
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during logout:', error);
        navigate('/login');
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
