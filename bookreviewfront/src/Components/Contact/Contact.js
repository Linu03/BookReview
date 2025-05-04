import React, { useEffect } from 'react';
import './Contact.css';
import Navbar from '../Layout/Navbar';

const Contact = () => {
  useEffect(() => {
    document.title = "Booksy";
  }, []);

  return (
    <>
      <Navbar />
      <div className="contact-wrapper">
        <div className="contact-page">
          <div className="contact-container">
            <h1 className="contact-title">Ai o problemă sau o sugestie?</h1>
            <div className="contact-info">
              <div className="contact-method">
                <div className="icon-container">
                  <svg className="contact-icon" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <p>Trimite-ne un email la</p>
                <a href="mailto:booksy@gmail.com" className="contact-link">
                  booksy@gmail.com
                </a>
              </div>
              <div className="contact-method">
                <div className="icon-container">
                  <svg className="contact-icon" viewBox="0 0 24 24">
                    <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM21 6h-3V3h-2v3h-3v2h3v3h2V8h3z"/>
                  </svg>
                </div>
                <p>Suport tehnic</p>
                <p className="contact-detail">Luni - Vineri: 9:00 - 18:00</p>
              </div>
              <div className="contact-method">
                <div className="icon-container">
                  <svg className="contact-icon" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <p>Timp de răspuns</p>
                <p className="contact-detail">În maxim 24 de ore</p>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer">
          © 2024 Booksy | Dezvoltat de Linu
        </footer>
      </div>
    </>
  );
};

export default Contact;