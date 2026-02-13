
import { Routes, Route} from 'react-router-dom'; // Removed React import from here

import Home from './components/Home';
import Logout from './components/Logout';
import TokenExpiry from './components/TokenExpiry';
import Tickets from './components/Tickets';
import Dashboard from './components/Dashboard';
import SubmitTicket from './components/SubmitTicket';
import TicketPage from './components/TicketView';
import InnerLayout from './components/InnerLayout';
import Rootpage from './components/Rootpage';
import Fixer from './components/Fixer';




const App = () => {
  return (
    <div className='whole-app'>

      {/*<TokenExpiry />*/}
      <Routes>
        <Route path="/gatekeeper" element={<Rootpage />} />
        <Route element={<InnerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/logout" element={<Logout />} /> {/* Add logout route */}
          <Route path="/fixer" element={<Fixer/>}/>
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/submitticket" element={<SubmitTicket />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets/:ticketId/" element={<TicketPage />} />
        </Route>

      </Routes>

    </div>
  );
};

export default App;
