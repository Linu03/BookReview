import React, { useEffect } from 'react';
import Navbar from '../Layout/Navbar';

const Home = () => {
  useEffect(() => {
    console.log("Home component mounted");
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
