import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllBooks.css';

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('all');

    const genres = [
        'all',
        'Fiction',
        'Non-Fiction',
        'Mystery',
        'Science Fiction',
        'Fantasy',
        'Romance',
        'Thriller',
        'Biography',
        'History',
        'Poetry'
    ];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                console.log('Fetching books...');
                const response = await axios.get('http://localhost:5122/api/Books');
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

    // Filter books based on selected genre
    const filteredBooks = selectedGenre === 'all' 
        ? books 
        : books.filter(book => book.genre === selectedGenre);

    console.log('Current books state:', books);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="all-books-container">
            <div className="genre-buttons">
                {genres.map(genre => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`genre-button ${selectedGenre === genre ? 'active' : ''}`}
                    >
                        {genre === 'all' ? 'All Books' : genre}
                    </button>
                ))}
            </div>
            <div className="books-grid">
                {filteredBooks.map((book) => (
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
                            <p className="genre">Genre: {book.genre}</p>
                            <p className="description">{book.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllBooks; 