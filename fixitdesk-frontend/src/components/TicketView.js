import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';




function getCookie(name) {
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  console.log("getCookie is hit: ", cookieValue )
  return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null;
}

const TicketNotesAndDetailsPage = () => {
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
        const response = await fetch('https://localhost:8000/api/accounts/whoami/', {
          credentials: 'include',
        });
        if (!response.ok) {
          navigate('/accounts/login');
          return;
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/accounts/login');
      }
    };
    checkUser();
  }, [navigate]);

  



  // Fetch ticket and notes
  useEffect(() => {
    const fetchTicketAndNotes = async () => {
      try {
        const ticketRes = await fetch(`https://localhost:8000/api/tickets/${ticketId}/`, {
          credentials: 'include',
        });
        const notesRes = await fetch(`https://localhost:8000/api/tickets/${ticketId}/notes/`, {
          credentials: 'include',
        });

        if (ticketRes.ok && notesRes.ok) {
          const ticketData = await ticketRes.json();
          const notesData = await notesRes.json();
          setTicket(ticketData);
          setEditTicketData(ticketData);
          setNotes(notesData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); // Reverse chronological
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
      const response = await fetch(`https://localhost:8000/api/tickets/${ticketId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',
        body: JSON.stringify(editTicketData),
      });

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
      const response = await fetch(`https://localhost:8000/api/tickets/${ticketId}/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newNote,
          note_type: newNoteType,
        }),
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
      const response = await fetch(`https://localhost:8000/api/notes/${noteId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',
        body: JSON.stringify({ content: editingContent }),
      });

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
      const response = await fetch(`https://localhost:8000/api/notes/${noteId}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',
      });

      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (!ticket || !userInfo) return <div>Loading...</div>;

  return (
    <div>
      <h2>Ticket #{ticketId}</h2>

      {/* Ticket Details */}
      {!ticketEditing ? (
        <div>
          <p><strong>Title:</strong> {ticket.title}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Impact:</strong> {ticket.impact}</p>
          <p><strong>Department:</strong> {ticket.department}</p>
          {userInfo.is_support_staff && (
            <button onClick={() => setTicketEditing(true)}>Edit Ticket</button>
          )}
        </div>
      ) : (
        <form onSubmit={handleTicketUpdate}>
          <input type="text" value={editTicketData.title} onChange={(e) => setEditTicketData({...editTicketData, title: e.target.value})} required />
          <textarea value={editTicketData.description} onChange={(e) => setEditTicketData({...editTicketData, description: e.target.value})} required />
          <select value={editTicketData.status} onChange={(e) => setEditTicketData({...editTicketData, status: e.target.value})}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={editTicketData.priority} onChange={(e) => setEditTicketData({...editTicketData, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select value={editTicketData.impact} onChange={(e) => setEditTicketData({...editTicketData, impact: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type="text" value={editTicketData.department} onChange={(e) => setEditTicketData({...editTicketData, department: e.target.value})} required />
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
        <h3>Notes</h3>
        <ul>
          {notes.map(note => (
            (note.note_type !== 'work_note' || userInfo.is_support_staff) && (
              <li key={note.id}>
                <div>
                  <strong>{note.user}</strong> <em>({note.note_type.replace('_', ' ')})</em><br />
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
                    <>
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
                    </>
                  )}
                </div>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketNotesAndDetailsPage;
