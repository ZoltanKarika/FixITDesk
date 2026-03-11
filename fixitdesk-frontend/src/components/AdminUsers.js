import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

import { useUserHandler } from './UserHandler';

const AdminUsers = () => {
    const { user, loginHandler, logouthandler } = useUserHandler();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get('/api/accounts/whoami/');
                if (!res.ok) {
                    navigate('/gatekeeper');
                    logouthandler();
                    return;
                }
                const data = await res.json();
                loginHandler(data);

                if (!data.is_support_staff) {
                    navigate('/dashboard'); // nem admin
                    return;
                }

                // Fetch admin users csak ha support staff

                if (user?.is_support_staff) {
                    const usersRes = await api.get('/api/accounts/admin/users/');
                    if (!usersRes.ok) throw new Error('Failed to fetch users');
                    const usersData = await usersRes.json();
                    setUsers(usersData.results || usersData);
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        checkUser();
    }, [navigate]);

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading user info...</p>;

    return (
        <div>
            <h2>Admin User Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Support</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) &&
                        users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.department}</td>
                                <td>{u.role}</td>
                                <td>{u.is_support_staff ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;