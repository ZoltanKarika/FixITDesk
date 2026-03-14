import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import '../css/adminuser.css';

import { useUserHandler } from './UserHandler';

const AdminUsers = () => {
    const { user, loginHandler, logoutHandler } = useUserHandler();

    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

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
                    navigate('/dashboard'); // nem admin
                    return;
                }

                // Fetch admin users csak ha support staff

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

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading user info...</p>;

    return (
        <div className='p-top fade-in enter admin-wrap'>
            <div className='admin-main '>
                <h1 className='admin-title'>Admin User Management</h1>
                <div className='admin-user-wrapper'>
                    <h1>Users</h1>
                    <div className='admin-user-lines'>
                        <table>
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Name</td>
                                    <td>Email</td>
                                    <td>Department</td>
                                    {/*<th>Role</th>*/}
                                    <td>Support</td>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(users) &&
                                    users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            {console.log(u)}
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>{u.department}</td>
                                            {/*<td>{u.role}</td>*/}
                                            <td>{u.is_support_staff ? 'Yes' : 'No'}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;