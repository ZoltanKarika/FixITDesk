// src/components/Tickets.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

import { useUserHandler } from './UserHandler';
//talán ide is kell egy checkuser
const Tickets = () => {

  const { user, loginHandler, logoutHandler } = useUserHandler();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To track error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets/');

        // Handle Unauthorized (401) response
        if (response.status === 401) {
          console.log('Unauthorized. Redirecting to login...');
          navigate('/gatekeeper'); // Redirect to login if unauthorized
          logoutHandler();
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Error fetching tickets. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchTickets();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching tickets
  }

  return (
    <div className='p-top enter'>
      <div className='ticket-details-page'>
        <h1 >Tickets</h1>
        {error && <div style={{ color: 'red' }}>{error}</div>} {/* Show error message if any */}
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>{ticket.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tickets;

