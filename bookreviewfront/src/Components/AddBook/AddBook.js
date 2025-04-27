import React, { useEffect } from 'react';
import Navbar from '../Layout/Navbar';
import './AddBook.css';  

const AddBook = () => {
    useEffect(() => {
        document.title = "Booksy - Add a Book";
    }, []);

    return (
        <>
            <Navbar /> 
            <div className="addbook-container">
                <h1>Adaugă o carte nouă</h1>
            </div>
        </>
    );
};

export default AddBook;
