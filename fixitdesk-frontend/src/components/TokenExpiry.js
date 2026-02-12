import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

const TokenExpiry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Check expiry started");

      const currentUrl = window.location.pathname;
      console.log("Current URL:", currentUrl);

      // Skip token expiry check for exact /accounts/login or /accounts/register routes
      if (currentUrl === '/gatekeeper') {
        console.log("Skipping token expiry check for:", currentUrl);
        return;
      }

      try {
        // Send request to check if session is still valid
        const response = await fetch(`${API_URL}/api/accounts/whoami/`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          console.log("Session expired, redirecting to login...");
          navigate('/gatekeeper');
        }
      } catch (error) {
        console.error('Auth check failed', error);
        navigate('/gatekeeper');
      }
    };

    checkAuth();

    // Check every 5 minutes if the user is still authenticated
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [navigate]);

  return null;
};

export default TokenExpiry;
