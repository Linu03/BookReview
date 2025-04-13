import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    console.log("Home component mounted");
    const token = localStorage.getItem('authToken');
    console.log("Token in Home:", token);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bine ai venit!</h1>
      <h2>Totul fain</h2>
      <p>Ai fost autentificat cu succes.</p>
    </div>
  );
};

export default Home;