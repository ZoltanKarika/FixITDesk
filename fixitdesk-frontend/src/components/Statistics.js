import { useUserHandler } from './UserHandler';
import { useEffect, useState } from 'react';
import api from './api';

const Statistics = () => {
    const { user, loginHandler, logoutHandler } = useUserHandler();
    const [tickets, setTickets] = useState([]);

    const fetchTickets = async () => {
        try {
            const response = await api.get('/api/tickets/');
            if (!response.ok) throw new Error('Failed to fetch tickets');
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [])


    return (
        <div>
            <div className="stat p-top">AJEMÖ STAT</div>
            {tickets.map(ticket => (
                <div key={ticket.id}>
                    {Object.entries(ticket).map(([key, value]) => (
                        <p key={key}>{key}: {value}</p>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Statistics