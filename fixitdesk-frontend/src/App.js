
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Logout from './components/Logout';
import NewTickets from './components/Tickets';

import SubmitTicket from './components/SubmitTicket';
import TicketPage from './components/TicketView';
import InnerLayout from './components/InnerLayout';
import Rootpage from './components/Rootpage';
import Fixer from './components/Fixer';
import AdminUsers from "./components/AdminUsers";
import Statistics from './components/Statistics';





const App = () => {
  return (
    <div className='whole-app'>

      <Routes>
        <Route path="/gatekeeper" element={<Rootpage />} />
        <Route element={<InnerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/logout" element={<Logout />} />
          <Route path="/fixer" element={<Fixer />} />
          <Route path="/tickets" element={<NewTickets />} />
          <Route path="/submitticket" element={<SubmitTicket />} />
          <Route path="/statistics" element={<Statistics/>} />
          <Route path="/tickets/:ticketId/" element={<TicketPage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>

    </div>
  );
};

export default App;
