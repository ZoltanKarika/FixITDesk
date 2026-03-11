
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { useUserHandler } from './UserHandler';

const Logout = () => {
  const{logoutHandler} = useUserHandler();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await api.post('/api/accounts/logout/');
        navigate('/gatekeeper')
        logoutHandler();
        return true;
      } catch (error) {
        console.error("Logout failed:", error);
        navigate('/gatekeeper')
        logoutHandler();
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
