import React, { useEffect } from 'react';
import Navbar from '../Layout/Navbar';

const Home = () => {
  useEffect(() => {
    const token = localStorage.getItem('authToken');  
    console.log("Token in Home:", token);
    
    document.title = "Booksy";
  }, []);

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Home;
