
import { Link } from "react-router-dom";
import '../css/navbar.css';
import logo from '../img/ChatGPT_generated_logo.png';


const NavBar = () => {
  function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
  }
  function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
  }
  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <ul>
          <li><img src={logo} alt="FixIT-logo" className="logo" /></li>
          <li className="hideOnMobile">
            <Link to="/">Home</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/fixer">Mr.Fixxer</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/tickets">Tickets</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/submitticket">Create ticket</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="hideOnMobile">
            <Link>Admin??</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/accounts/logout">Logout</Link>
          </li>
          <li onClick={showSidebar} className="menu-button"><svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="45px" fill="#1f1f1f"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg></li>
        </ul>


        <ul className="sidebar">
          <li onClick={hideSidebar} ><svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="45px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg></li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/fixer">Mr.Fixxa</Link>
          </li>
          <li>
            <Link to="/tickets">Tickets</Link>
          </li>
          <li>
            <Link to="/submitticket">Create ticket</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/accounts/logout">Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
