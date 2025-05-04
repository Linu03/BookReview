
import BookCarousel from '../Layout/BookCarousel'
import React, { useEffect } from 'react';
import Navbar from '../Layout/Navbar';
import './Home.css';

const Home = () => {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log("Token in Home:", token);
    document.title = "Booksy";
  }, []);

  return (
    <div>
      <Navbar />
      <div className="carousel-wrapper">
        <BookCarousel />
      </div>
    </div>
  );
};

export default Home;
