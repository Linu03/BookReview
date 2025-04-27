import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </>
  );
};

export default Layout;