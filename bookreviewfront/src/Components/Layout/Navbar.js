import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useAuth } from '../Context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAdmin } = useAuth();
  const location = useLocation(); 

  
  useEffect(() => {
    console.log(`Navbar rendered on path: ${location.pathname}. Is Admin: ${isAdmin()}`);
  }, [location.pathname, isAdmin]); 

  return (
    <nav className="navbar">
      <div className="navdiv">
        {/* Logo */}
        <div className="logo">
          <Link to="/home">Booksy</Link>
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
