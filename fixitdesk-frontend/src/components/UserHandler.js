import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
const [user, setUser] = useState(() => {
    try {
        return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
        return null;
    }
});

    const loginHandler = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logoutHandler = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return(
        <UserContext.Provider value={{ user, setUser, loginHandler, logoutHandler }}>
            {children}
        </UserContext.Provider>
    );

};

export const useUserHandler = () => useContext(UserContext);
