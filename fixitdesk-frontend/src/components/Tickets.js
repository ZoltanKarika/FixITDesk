import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/tickets.css'
import '../css/animations.css'
import api from './api';

import { useUserHandler } from './UserHandler';

const NewTickets = () => {

  const { user, loginHandler, logoutHandler } = useUserHandler();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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
    <div className="dashboard-page p-top">

      <h1 className="page-title enter">Tickets</h1>

      {user ? (
        <div className="dashboard-panel enter">
          <input
            className="search-input"
            placeholder="🔍 Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/*<h1>Welcome, {user.username}!</h1>*/}
          <h1>Open tickets: </h1>

          {/*{user.is_support_staff && (
            <button className="admin-btn">Admin Mode</button>
          )}*/}

          {/*<h3>Open Tickets:</h3>*/}

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
                      Username
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
                  {tickets.filter(t =>
                    t.title?.toLowerCase().includes(search.toLowerCase()) ||
                    t.username?.toLowerCase().includes(search.toLowerCase())||
                    t.status?.toLowerCase().includes(search.toLowerCase())||
                     String(t.id)?.includes(search)
                  ).map(ticket => (
                    <tr>
                      <td>
                        {ticket.id}
                        {console.log(ticket)}
                      </td>
                      <td>
                        {ticket.username}
                      </td>
                      <td>
                        {ticket.title}
                      </td>
                      <td className={ticket.status === 'open' ? 'orange' : ticket.status === 'in_progress' ? 'blue' : ticket.status === 'resolved' ? 'green' : 'grey'}>
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
      )
      }

    </div >
  );
};

export default NewTickets;
