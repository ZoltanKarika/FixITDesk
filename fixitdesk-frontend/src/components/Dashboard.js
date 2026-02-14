import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css'
import '../css/animations.css'
import api from './api';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // Store user info like username, is_staff
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get('/api/accounts/whoami/');
        if (!response.ok) {
          navigate('/gatekeeper');
          return;
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/gatekeeper');
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets/');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    checkUser().then(fetchTickets);
  }, [navigate]);


  return (
    <div className="dashboard-page fade-in enter p-top">

      <h1 className="page-title">Dashboard</h1>

      {userInfo ? (
        <div className="dashboard-panel">

          <h1>Welcome, {userInfo.username}!</h1>

          {userInfo.is_support_staff && (
            <button className="admin-btn">Admin Mode</button>
          )}

          <h3>Open Tickets:</h3>

          {tickets.length === 0 ? (
            <p>No tickets available.</p>
          ) : (
            <div className="table-panel">
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
                      <td>
                        <a href={'/tickets/' + ticket.id}>
                          <button>View</button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>

                  </tr>
                </tfoot>
              </table>
            </div>

          )}

        </div>
      ) : (
        <p className="loading">Loading user information...</p>
      )}

    </div>
  );
};

export default Dashboard;
