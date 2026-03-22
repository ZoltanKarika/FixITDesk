import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import '../css/ticketsubmit.css';

import { useUserHandler } from './UserHandler';

//checkuser?
const SubmitTicket = () => {
  const { user, loginHandler, logoutHandler } = useUserHandler();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('incident');
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('low');
  const [impact, setImpact] = useState('low');
  const [department, setDepartment] = useState(user?.department || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request to submit the ticket
      const response = await api.post('/api/tickets/', {
        title,
        description,
        type,
        status,
        priority,
        impact,
        department,
        submitted_via: 'api'
      });
      if (!response.ok) {
        // Handle different responses from the backend
        if (response.status === 401) {
          setError('You must be logged in to submit a ticket.');
          navigate('/gatekeeper');
          logoutHandler();

          return;
        }
        throw new Error('Failed to submit the ticket');
      }
      console.log("user data: " + user);
      const data = await response.json();
      if (data && data.id) {
        navigate('/tickets');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setError('An error occurred while submitting your ticket. Please try again.');
    }
  };

  return (
    <div className='ticket-page p-top'>
      <div className='main-c enter ticket-panel'>
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
          {user?.is_support_staff ? (
            <div>
              <label htmlFor="department">Department:</label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
          ) : null}
          <div>
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="incident">Incident</option>
              <option value="problem">Problem</option>
              <option value="request">Request</option>
              <option value="change">Change</option>
            </select>
          </div>
          <div>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">Open</option>
              {user?.is_support_staff && (
                <>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              {user?.is_support_staff && (
                <>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </>)}
            </select>
          </div>
          <div>
            <label htmlFor="impact">Impact:</label>
            <select
              id="impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            >
              <option value="low">Low</option>
              {user?.is_support_staff && (
                <>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </>)}
            </select>
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
    </div>
  );
};

export default SubmitTicket;
