import React from 'react';
import { Link } from 'react-router-dom';  // Importă Link din react-router-dom
import { useAuth } from '../Context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="navdiv">
        {/* Logo */}
        <div className="logo">
          <a href="#">Booksy</a>
        </div>

        {/* Meniul de navigare */}
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>  
          <li><Link to="/contact">Contact</Link></li>  
          <li><Link to="/addBook">Adaugă o idee de carte</Link></li>
          {isAdmin() && (
            <li><Link to="/acceptBook">Acceptă cărți</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
