import React, { useEffect } from 'react';
import Navbar from '../Layout/Navbar';

const AcceptBook = () => {
    useEffect(() => {
        document.title = "Booksy";
    }, []);


    return (
        <>
            <Navbar />
        
        
        </>
    );

};

export default AcceptBook;