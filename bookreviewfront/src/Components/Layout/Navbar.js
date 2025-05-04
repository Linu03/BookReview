import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Importă Link din react-router-dom
import { useAuth } from '../Context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const { isAdmin } = useAuth();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

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

        {/* Căutare și filtrare */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Căutare carte..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <select value={selectedGenre} onChange={handleGenreChange}>
            <option value="">Toate genurile</option>
            <option value="fantasy">Fantasy</option>
            <option value="thriller">Thriller</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="nonfiction">Non-fiction</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
