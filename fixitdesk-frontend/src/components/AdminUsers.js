import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import '../css/adminuser.css';
import '../css/animations.css';
import { useUserHandler } from './UserHandler';

const AdminUsersSecond = () => {
    const { user, loginHandler, logoutHandler } = useUserHandler();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saveError, setSaveError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get('/api/accounts/whoami/');
                if (!res.ok) {
                    navigate('/gatekeeper');
                    logoutHandler();
                    return;
                }
                const data = await res.json();
                loginHandler(data);

                if (!data.is_support_staff) {
                    navigate('/gatekeeper');
                    logoutHandler();
                    return;
                }

                const usersRes = await api.get('/api/accounts/admin/users/');
                if (!usersRes.ok) throw new Error('Failed to fetch users');
                const usersData = await usersRes.json();
                setUsers(usersData.results || usersData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };
        checkUser();
    }, [navigate]);

    const handleRowClick = (u) => {
        if (editingId === u.id) return;
        if (u.username === user.username) return;
        setEditingId(u.id);
        setEditForm({
            username: u.username,
            email: u.email,
            department: u.department,
            is_support_staff: u.is_support_staff,
        });
        setSaveError(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
        setSaveError(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async (id) => {
        try {
            const res = await api.put(`/api/accounts/admin/users/${id}/`, editForm);
            if (!res.ok) throw new Error('Failed to save');
            const updated = await res.json();
            setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
            setEditingId(null);
            setSaveError(null);
        } catch (err) {
            setSaveError('Save unsuccessful.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete the user?')) return;
        try {
            const res = await api.delete(`/api/accounts/admin/users/${id}/`);
            if (!res.ok) throw new Error('Failed to delete');
            setUsers(prev => prev.filter(u => u.id !== id));
            setEditingId(null);
        } catch (err) {
            setSaveError('Delete unsuccesful.');
        }
    };

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading user info...</p>;

    return (
        <div className='p-top enter admin-wrap'>
            <div className='admin-main'>
                <h1 className='admin-title'>Admin User Management</h1>
                <div className='admin-user-wrapper'>
                    <h1>Users</h1>
                    {saveError && <p style={{ color: 'red' }}>{saveError}</p>}
                    <p className='admin-hint'>Click on a line to modify. <span className="error-message">Own account can not be modified!</span></p>
                    <div className='admin-user-lines'>
                        <table>
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Name</td>
                                    <td>Email</td>
                                    <td>Department</td>
                                    <td>Support</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(users) && users.map(u => (
                                    editingId === u.id ? (
                                        <tr key={u.id} className='editing-row'>
                                            <td>{u.id}</td>
                                            <td>
                                                <input
                                                    name="username"
                                                    value={editForm.username}
                                                    onChange={handleChange}
                                                    className='admin-input'
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    name="email"
                                                    value={editForm.email}
                                                    onChange={handleChange}
                                                    className='admin-input'
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    name="department"
                                                    value={editForm.department}
                                                    onChange={handleChange}
                                                    className='admin-input'
                                                />
                                            </td>
                                            <td>
                                                <span

                                                    className='check-admin zoomer'
                                                 
                                                    onClick={() =>
                                                        setEditForm(prev => ({
                                                            ...prev,
                                                            is_support_staff: !prev.is_support_staff,
                                                        }))
                                                    }
                                                >
                                                    {editForm.is_support_staff ? '✔️' : '❌'}
                                                </span>
                                            </td>
                                            <td className='action-buttons'>
                                                <button onClick={() => handleSave(u.id)} className='btn-save'>Save</button>
                                                <button onClick={handleCancel} className='btn-cancel'>Cancel</button>
                                                <button onClick={() => handleDelete(u.id)} className='btn-delete'>Delete</button>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={u.id} onClick={() => handleRowClick(u)}  className={`clickable-row ${u.username === user.username ? 'own-row' : ''}`}>
                                            <td>{u.id}</td>
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>{u.department}</td>
                                            <td>{u.is_support_staff ? '✔️' : '❌'}</td>
                                            <td></td>
                                        </tr>
                                        //classname tr-ben nem optimális id kellene, whoamiview-ban
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersSecond;