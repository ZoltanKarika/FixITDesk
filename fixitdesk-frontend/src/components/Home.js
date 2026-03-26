

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { useUserHandler } from './UserHandler';
import '../css/home.css';
import '../css/animations.css';

const Home = () => {
  const { user, loginHandler, logoutHandler } = useUserHandler();
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
    checkUser();
  }, [navigate]);

  const cards = [
    {
      icon: '🎫',
      title: 'Tickets',
      desc: user?.is_support_staff
        ? 'Manage tickets and write messages to users or other admins.'
        : 'Check your tickets or write a message to an admin.',
      path: '/tickets',
    },
    {
      icon: '🤖',
      title: 'Mr.Fixer',
      desc: user?.is_support_staff
        ? 'Chatbot that can help solve problems.'
        : 'Consider asking Mr.Fixer before opening a ticket — it might help.',
      path: '/fixer',
    },
    {
      icon: '➕',
      title: 'Create Ticket',
      desc: 'Submit a new ticket here.',
      path: '/submitticket',
    },
    {
      icon: '📊',
      title: 'Statistics',
      desc: 'View statistics about the tickets.',
      path: '/statistics',
    },
    ...(user?.is_support_staff ? [{
      icon: '🙍‍♀️🙍‍♂️',
      title: 'Manage Users',
      desc: "Manage and modify user details.",
      path: '/admin/users',
    }] : []), {
      icon: '➡️🚪',
      title: 'Logout',
      desc: 'Goodbye!',
      path: '/accounts/logout',
    }
  ];

  return (
    <div className='p-top enter home-wrap pad10'>
      <div className='home-welcome'>
        <h1>Welcome, {user ? user.username : 'Guest'}!</h1>
        <p>This is the homepage of the FixIT ticket management. Check the instructions below!</p>
      </div>
      <div className='home-cards'>
        {cards.map((card, i) => (
          <div className='home-card' key={i} onClick={() => navigate(card.path)}>
            <div className='home-card-icon'>{card.icon}</div>
            <div className='home-card-title'>{card.title}</div>
            <p className='home-card-desc'>{card.desc}</p>
          </div>
        ))}
      </div>
    

    </div>
  );
};

export default Home;

