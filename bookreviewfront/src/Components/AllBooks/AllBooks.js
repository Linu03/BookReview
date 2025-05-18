import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllBooks.css';

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                console.log('Fetching books...');
                const response = await axios.get('http://localhost:5122/api/books');
                console.log('Response:', response.data);
                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError('Error fetching books');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    console.log('Current books state:', books);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="all-books-container">
            <h1></h1>
            <div className="books-grid">
                {books.map((book) => (
                    <div key={book.bookId} className="book-card">
                        {book.coverImageUrl && (
                            <img 
                                src={book.coverImageUrl} 
                                alt={book.title} 
                                className="book-cover"
                            />
                        )}
                        <div className="book-info">
                            <h2>{book.title}</h2>
                            <p className="author">By {book.author}</p>
                            <p className="description">{book.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllBooks; 