// src/components/SubmitTicket.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SubmitTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure the user is authenticated and the token exists
    const accessToken = Cookies.get('access_token');
    if (!accessToken) {
      setError('You must be logged in to submit a ticket.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/tickets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Send the token in the header
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the ticket');
      }

      const data = await response.json();
      if (data && data.id) {
        navigate('/dashboard'); // Redirect to the dashboard after successful submission
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setError('An error occurred while submitting your ticket. Please try again.');
    }
  };

  return (
    <div>
      <h1>Submit a Ticket</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
};

export default SubmitTicket;