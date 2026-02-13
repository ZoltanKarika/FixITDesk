import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "./config";

const SubmitTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('incident');
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('low');
  const [impact, setImpact] = useState('low');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request to submit the ticket
      const response = await fetch(`${ API_URL }/api/tickets/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Ensures cookies (including HttpOnly cookies) are sent with the request
        body: JSON.stringify({
          title,
          description,
          type,
          status,
          priority,
          impact,
          department,
          submitted_via: 'api', // Automatically set to 'api' as it's coming from the frontend
        }),
      });

      if (!response.ok) {
        // Handle different responses from the backend
        if (response.status === 401) {
          setError('You must be logged in to submit a ticket.');
          navigate('/gatekeeper');
          return;
        }
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
    <div className='main-c'>
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
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
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
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
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
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
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
        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
};

export default SubmitTicket;
