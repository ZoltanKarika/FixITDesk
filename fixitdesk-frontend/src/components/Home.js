import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null); // To store the user data
  const [loading, setLoading] = useState(true); // Optional loading state

  useEffect(() => {
    // Fetch user info when Dashboard loads
    fetch('https://localhost:8000/api/accounts/whoami/', {
      method: 'GET',
      credentials: 'include', // This makes sure browser sends HttpOnly cookies!
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched user:', data);
        setUser(data); // Save user data
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching
  }

  return (
    <div>
      <h2>Welcome {user ? user.username : 'Guest'}!</h2>
      <p>This is your dashboard.</p>
    </div>
  );
};

export default Dashboard;
