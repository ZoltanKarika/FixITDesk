import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // Store user info like username, is_staff
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('https://localhost:8000/api/accounts/whoami/', {
          credentials: 'include', // important to send cookies
        });

        if (!response.ok) {
          console.log('Not authenticated. Redirecting to login.');
          navigate('/accounts/login');
          return;
        }

        const data = await response.json();
        console.log('User info:', data);
        setUserInfo(data);
        
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/accounts/login'); // On error, force redirect
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await fetch('https://localhost:8000/api/tickets/', {
          credentials: 'include',
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

    checkUser().then(fetchTickets); // First check user, then fetch tickets

  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>

      {userInfo ? (
        <div>
          <h2>Welcome, {userInfo.username}!</h2>
          {userInfo.is_support_staff && <button>Admin Mode</button>}
          
          
          
          <h3>Open Tickets:</h3>
          {tickets.length === 0 ? (
            <p>No tickets available.</p>
          ) : (
            <table>
            <thead>
                <tr>
                    <td>
                        ID
                    </td>
                    <td>
                        Short Description
                    </td>
                    <td>
                        State
                    </td>
                </tr>
            </thead>
            <tbody>
            {tickets.map(ticket => (
              <tr>
                <td>
                  {ticket.id}
                </td>
                <td>
                  {ticket.title}
                </td>
                <td>
                  {ticket.status}
                </td>
              </tr>
               ))}
            </tbody>
                <tfoot>
                    <tr>
                      
                    </tr>
                </tfoot>  
            </table>


            
          )}
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default Dashboard;
