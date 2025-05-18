import React, { useEffect } from 'react';
import Navbar from '../Layout/Navbar';
import BookCarousel from '../Layout/BookCarousel';
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
      <div className="hero-text">
        <h1>Descoperă lumi noi în paginile cărților</h1>
        <p>Inspiră-te din idei, povești și recenzii autentice.</p>
      </div>

      <div className="carousel-wrapper">
        <BookCarousel />
      </div>

      <div className="see-more-btn">
        <button onClick={() => window.location.href = "/books"}>Vezi toate cărțile</button>
      </div>

      <div className="testimonials">
        <p>"Booksy m-a ajutat să găsesc cărți pe gustul meu. Interfața e super prietenoasă!" — Ana</p>
      </div>
    </div>
  );
};

export default Home;
