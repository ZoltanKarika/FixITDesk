import { createContext, useState, useContext, useEffect } from "react";
import api from '../components/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            const fetchUnread = async () => {
                try {
                    const res = await api.get('/api/tickets/');
                    if (res.ok) {
                        const data = await res.json();
                        const total = data.reduce((sum, t) => sum + (t.unread_count || 0), 0);
                        setUnreadCount(total);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchUnread();
        }
    }, [user]);

    const updateUnreadCount = (count) => {
        setUnreadCount(count);
    };

    const loginHandler = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log(user);
    };

    const logoutHandler = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, loginHandler, logoutHandler, unreadCount, updateUnreadCount }}>
            {children}
        </UserContext.Provider>
    );

};

export const useUserHandler = () => useContext(UserContext);
