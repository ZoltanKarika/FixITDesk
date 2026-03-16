import { useEffect, useState } from 'react';
import api from './api';
import '../css/statistics.css';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
 
const STATUS_COLORS = {
    open: '#60a5fa',
    in_progress: '#f59e0b',
    resolved: '#34d399',
    closed: '#9ca3af',
};
 
const PRIORITY_COLORS = {
    low: '#60a5fa',
    medium: '#f59e0b',
    high: '#f87171',
    urgent: '#dc2626',
};
 
const Statistics = () => {
    const [tickets, setTickets] = useState([]);
 
    useEffect(() => {
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
        fetchTickets();
    }, []);
 
    // Státuszonkénti adat
    const statusData = ['open', 'in_progress', 'resolved', 'closed'].map(s => ({
        name: s.replace('_', ' '),
        value: tickets.filter(t => t.status === s).length,
        key: s,
    })).filter(d => d.value > 0);
 
    // Prioritásonkénti adat
    const priorityData = ['low', 'medium', 'high', 'urgent'].map(p => ({
        name: p.charAt(0).toUpperCase() + p.slice(1),
        value: tickets.filter(t => t.priority === p).length,
        key: p,
    })).filter(d => d.value > 0);
 
    // Átlagos megoldási idő
    const resolvedTickets = tickets.filter(t => t.status === 'resolved');
    const avgResolutionTime = resolvedTickets.length > 0
        ? resolvedTickets.reduce((acc, t) => {
            return acc + (new Date(t.updated_at) - new Date(t.created_at));
        }, 0) / resolvedTickets.length
        : null;
 
    const formatDuration = (ms) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return '< 1 hour';
    };
 
    return (
        <div className='stat-wrap p-top'>
            <h1 className='stat-title'>Statistics</h1>
 
            {/* Overview kártyák */}
            <div className='stat-panel'>
                <h2 className='stat-section-title'>Overview</h2>
                <div className='stat-cards'>
                    <div className='stat-card'>
                        <div className='stat-card-value'>{tickets.length}</div>
                        <div className='stat-card-label'>Total Tickets</div>
                    </div>
                    <div className='stat-card'>
                        <div className='stat-card-value'>{resolvedTickets.length}</div>
                        <div className='stat-card-label'>Resolved</div>
                    </div>
                    <div className='stat-card'>
                        <div className='stat-card-value'>
                            {avgResolutionTime ? formatDuration(avgResolutionTime) : 'N/A'}
                        </div>
                        <div className='stat-card-label'>Avg. Resolution Time</div>
                    </div>
                </div>
            </div>
 
            <div className='stat-charts-row'>
                {/* Kördiagram - státusz */}
                <div className='stat-panel stat-chart-panel'>
                    <h2 className='stat-section-title'>By Status</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {statusData.map((entry) => (
                                    <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: 'rgba(10,10,40,.9)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 10 }}
                                labelStyle={{ color: 'white' }}
                                itemStyle={{ color: 'white' }}
                            />
                            <Legend
                                formatter={(value) => <span style={{ color: 'rgba(255,255,255,.7)' }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
 
                {/* Oszlopdiagram - prioritás */}
                <div className='stat-panel stat-chart-panel'>
                    <h2 className='stat-section-title'>By Priority</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,.6)', fontSize: 13 }} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,.6)', fontSize: 13 }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(10,10,40,.9)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 10 }}
                                labelStyle={{ color: 'white' }}
                                itemStyle={{ color: 'white' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {priorityData.map((entry) => (
                                    <Cell key={entry.key} fill={PRIORITY_COLORS[entry.key]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
 
export default Statistics;