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
      <div className="contact-page">
        <div className="contact-container">
          <h1>Ai o problemă sau o sugestie?</h1>
          <p>
            Contactează-ne la{' '}
            <a
              href="mailto:booksy@gmail.com"
              className="contact-link"
            >
              booksy@gmail.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Contact;