import React from "react";
import { Link } from "react-router-dom";
//import './NavBar.css';  // Optional for styling

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
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
  );
};

export default NavBar;
