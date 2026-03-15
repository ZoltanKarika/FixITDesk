import { useUserHandler } from './UserHandler';
import { useState } from 'react';
import api from './api';

const Statistics = () => {
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

    return (
        <div>
            <div className="stat p-top">AJEMÖ STAT</div>
            {console.log(tickets)}
        </div>
    )
}

export default Statistics