import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode }  from 'jwt-decode';
import Cookies from 'js-cookie'; // Import js-cookie

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [userRole, setUserRole] = useState(null); // To track if the user is staff
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the access token exists in cookies
    const accessToken = Cookies.get('access_token');
    if (!accessToken) {
      navigate('/login'); // Redirect to login if no token is found
      return;
    }

    const fetchTickets = async () => {
      try {
        // Decode the token to check the user's role
        const decodedToken = jwtDecode(accessToken); // Using the jwt-decode library
        setUserRole(decodedToken.is_staff); // Assuming 'is_staff' is part of the decoded token

        const response = await fetch('http://localhost:8000/api/tickets/', {
          credentials: 'include', // Include credentials for cookies/authentication
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [navigate]); // Add navigate to dependency list

  return (
    <div>
      <h1>Dashboard</h1>
      {userRole !== null && (
        <div>
          <h2>{userRole ? 'Staff' : 'User'} Overview</h2>
          <h3>Open Tickets</h3>
          <ul>
            {tickets.length === 0 ? (
              <p>No tickets available</p>
            ) : (
              tickets.map(ticket => (
                <li key={ticket.id}>
                  {ticket.title} - {ticket.status}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
