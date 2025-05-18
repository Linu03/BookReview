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
                const response = await axios.get('http://localhost:5000/api/books');
                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching books');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="all-books-container">
            <h1>All Books</h1>
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
                            <div className="book-status">
                                Status: <span className={book.status}>{book.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllBooks; 