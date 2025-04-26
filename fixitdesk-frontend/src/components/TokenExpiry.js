import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import

const TokenExpiry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token='));

      if (accessToken) {
        const token = accessToken.split('=')[1];
        try {
          const decodedToken = jwtDecode(token); // Correct usage of jwtDecode
          const currentTime = Date.now() / 1000; // Current time in seconds

          // If the token is expired, redirect to login
          if (decodedToken.exp < currentTime) {
            console.log("Token has expired. Redirecting to login...");
            navigate('/login'); // Navigate to login page
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          navigate('/login'); // Navigate to login page if there's an error
        }
      } else {
        navigate('/login'); // Redirect to login page if no token found
      }
    };

    // Run the check on component mount
    checkTokenExpiry();
  }, [navigate]);

  return null; // This component doesn't render anything, just runs the check
};

export default TokenExpiry;
