// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call the logout API endpoint to clear the cookies
    const logoutUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/accounts/logout/', {
          method: 'POST',
          credentials: 'include', // Ensure the credentials are sent (cookies)
        });

        if (response.ok) {
          // Redirect the user after logout
          navigate('/login');
        } else {
          console.log('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
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