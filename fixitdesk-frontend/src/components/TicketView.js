import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';
import '../css/ticketview.css';

import { useUserHandler } from './UserHandler';

const TicketNotesAndDetailsPage = () => {

  const { user, loginHandler, logoutHandler } = useUserHandler();
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState('customer_note');

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const [ticketEditing, setTicketEditing] = useState(false);
  const [editTicketData, setEditTicketData] = useState({});

  // Fetch user info
  useEffect(() => {
    const checkUser = async () => {
      try {
        let response = await api.get('/api/accounts/whoami/');
        if (!response.ok) {
          navigate('/gatekeeper');
          logoutHandler();
          return;
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/gatekeeper');
        logoutHandler();
      }
    };
    checkUser();
  }, [navigate]);




  // Fetch ticket and notes + read ticket
  useEffect(() => {
    const fetchTicketAndNotes = async () => {
      try {
        const ticketRes = await api.get(`/api/tickets/${ticketId}/`);
        const notesRes = await api.get(`/api/tickets/${ticketId}/notes/`);

        if (ticketRes.ok && notesRes.ok) {
          const ticketData = await ticketRes.json();
          const notesData = await notesRes.json();
          setTicket(ticketData);
          setEditTicketData(ticketData);
          setNotes(notesData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); // Reverse chronological

          await api.post(`/api/tickets/${ticketId}/notes/read/`);
        } else {
          console.error('Failed to fetch ticket or notes');
        }
      } catch (error) {
        console.error('Error fetching ticket and notes:', error);
      }
    };

    fetchTicketAndNotes();
  }, [ticketId]);

  // Ticket update (only admins)
  const handleTicketUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/api/tickets/${ticketId}/`, editTicketData);
      if (response.ok) {
        const updatedTicket = await response.json();
        setTicket(updatedTicket);
        setTicketEditing(false);
      } else {
        console.error('Failed to update ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  // Notes CRUD
  const handleAddNote = async () => {
    try {
      const response = await api.post(`/api/tickets/${ticketId}/notes/`, {
        content: newNote,
        note_type: newNoteType
      });
      if (response.ok) {
        const addedNote = await response.json();
        setNotes(prev => [addedNote, ...prev]); // New note on top
        setNewNote('');
      } else {
        console.error('Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleUpdateNote = async (noteId) => {
    try {
      const response = await api.patch(`/api/notes/${noteId}/`, { content: editingContent });
      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(prev => prev.map(note => note.id === noteId ? updatedNote : note));
        setEditingNoteId(null);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await api.delete(`/api/notes/${noteId}/`);
      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      const response = await api.delete(`/api/tickets/${ticketId}/`);
      if (response.ok) {
        navigate('/tickets');
      } else {
        console.error('Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };
  if (!ticket || !userInfo) return <div>Loading...</div>;

  return (
    <div className='p-top enter'>
      <div className='ticket-details-page'>
        <h1>Ticket #{ticketId}</h1>

        {!ticketEditing ? (
          <div>
            <p>User: {ticket.username}</p>
            <p><strong>Title:</strong> {ticket.title}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Impact:</strong> {ticket.impact}</p>
            <p><strong>Department:</strong> {ticket.department}</p>
            {userInfo.is_support_staff && (
              <div className='gap'>
                <button onClick={() => setTicketEditing(true)}>Edit Ticket</button>
                <button onClick={handleDeleteTicket}>Delete Ticket</button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleTicketUpdate}>
            <strong>Title: </strong><input type="text" value={editTicketData.title} onChange={(e) => setEditTicketData({ ...editTicketData, title: e.target.value })} required />
            <strong>Description: </strong><textarea value={editTicketData.description} onChange={(e) => setEditTicketData({ ...editTicketData, description: e.target.value })} required />
            <strong>Status: </strong><select value={editTicketData.status} onChange={(e) => setEditTicketData({ ...editTicketData, status: e.target.value })}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <strong>Priority: </strong><select value={editTicketData.priority} onChange={(e) => setEditTicketData({ ...editTicketData, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <strong>Impact: </strong><select value={editTicketData.impact} onChange={(e) => setEditTicketData({ ...editTicketData, impact: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <strong>Department: </strong><input type="text" value={editTicketData.department} onChange={(e) => setEditTicketData({ ...editTicketData, department: e.target.value })} required />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setTicketEditing(false)}>Cancel</button>
          </form>
        )}

        <hr />

        {/* New Note */}
        <div>
          <h3>Add a Note</h3>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
          />
          {userInfo.is_support_staff && (
            <select value={newNoteType} onChange={(e) => setNewNoteType(e.target.value)}>
              <option value="customer_note">Customer Visible Note</option>
              <option value="work_note">Internal Work Note</option>
            </select>
          )}
          <button onClick={handleAddNote}>Add Note</button>
        </div>

        {/* Notes List */}
        <div>
          <hr />
          <h3>Notes</h3>

          <br></br>
          <ul>
            {notes.map(note => (
              (note.note_type !== 'work_note' || userInfo.is_support_staff) && (
                <li key={note.id} className={`note-bubble ${note.is_support_staff ? 'note-admin' : 'note-customer'}`}>
                  <div>
                    <strong>{note.user}</strong> <em>({note.note_type.replace('_', ' ')}){note.note_type == 'work_note' && '🔧🛠️🪛'}</em><br />
                    {editingNoteId === note.id ? (
                      <>
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                        />
                        <button onClick={() => handleUpdateNote(note.id)}>Save</button>
                        <button onClick={() => setEditingNoteId(null)}>Cancel</button>
                      </>
                    ) : (
                      <div>
                        {note.content}<br />
                        <small>{new Date(note.created_at).toLocaleString()}</small>
                        {userInfo.is_support_staff && (
                          <>
                            <button onClick={() => {
                              setEditingNoteId(note.id);
                              setEditingContent(note.content);
                            }}>Edit</button>
                            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TicketNotesAndDetailsPage;
