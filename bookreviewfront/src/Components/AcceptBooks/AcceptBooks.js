import React, { useEffect, useState } from 'react';
import Navbar from '../Layout/Navbar';
import './AcceptBooks.css'; // Assuming you'll create a CSS file for styling

const AcceptBook = () => {
    const [pendingBooks, setPendingBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [errorBooks, setErrorBooks] = useState(null);
    const [approvingBookId, setApprovingBookId] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);

    // Lista predefinită de genuri
    const availableGenres = [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Science Fiction",
        "Fantasy",
        "Romance",
        "Thriller",
        "Biography",
        "History",
        "Poetry"
    ];

    useEffect(() => {
        document.title = "Booksy - Accept Books";
        fetchPendingBooks();
    }, []);

    const fetchPendingBooks = async () => {
        try {
            const response = await fetch('http://localhost:5122/api/books/pending');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPendingBooks(data);
        } catch (error) {
            setErrorBooks(error);
            console.error("Error fetching pending books:", error);
        } finally {
            setLoadingBooks(false);
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (window.confirm("Sigur doriți să ștergeți această carte?")) {
            try {
                const response = await fetch(`http://localhost:5122/api/books/${bookId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setPendingBooks(pendingBooks.filter(book => book.bookId !== bookId));
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("A apărut o eroare la ștergerea cărții.");
            }
        }
    };

    const handleApproveClick = (bookId) => {
        setApprovingBookId(bookId);
        setSelectedGenres([]);
    };

    const handleGenreChange = (genre) => {
        setSelectedGenres(prevSelectedGenres =>
            prevSelectedGenres.includes(genre)
                ? prevSelectedGenres.filter(g => g !== genre)
                : [...prevSelectedGenres, genre]
        );
    };

    const handleApproveSubmit = async (bookId) => {
        if (selectedGenres.length === 0) {
            alert("Vă rugăm selectați cel puțin un gen.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5122/api/books/approve/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedGenres),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setPendingBooks(pendingBooks.filter(book => book.bookId !== bookId));
            setApprovingBookId(null);
            setSelectedGenres([]);

        } catch (error) {
            console.error("Error approving book:", error);
            alert("A apărut o eroare la aprobarea cărții.");
        }
    };

    const handleCancelApprove = () => {
        setApprovingBookId(null);
        setSelectedGenres([]);
    };

    if (loadingBooks) {
        return <> <Navbar /> <div className="loading-container">Se încarcă...</div> </>;
    }

    if (errorBooks) {
        return <> <Navbar /> <div className="error-container">Eroare la încărcarea cărților: {errorBooks.message}</div> </>;
    }

    return (
        <>
            <Navbar />
            <div className="main-content-scrollable">
                <div className="acceptbooks-container">
                    <h1>Cărți în așteptare</h1>
                    {pendingBooks.length === 0 ? (
                        <p>Nu există cărți în așteptare.</p>
                    ) : (
                        <ul className="book-list">
                            {pendingBooks.map(book => (
                                <li key={book.bookId} className="book-item">
                                    <h2>{book.title} de {book.author}</h2>
                                    <p>Descriere: {book.description || 'N/a'}</p>
                                    {book.coverImageUrl && (
                                        <img src={book.coverImageUrl} alt={`Coperta ${book.title}`} className="book-cover" />
                                    )}
                                    <div className="actions">
                                        <button onClick={() => handleDeleteBook(book.bookId)}>Cerere neconformă</button>
                                        {approvingBookId === book.bookId ? (
                                            <div className="genre-selection">
                                                <h3>Selectează genuri:</h3>
                                                {availableGenres.map(genre => (
                                                    <label key={genre}>
                                                        <input
                                                            type="checkbox"
                                                            value={genre}
                                                            checked={selectedGenres.includes(genre)}
                                                            onChange={() => handleGenreChange(genre)}
                                                        />
                                                        {genre}
                                                    </label>
                                                ))}
                                                <button onClick={() => handleApproveSubmit(book.bookId)}>Confirmă aprobare</button>
                                                <button onClick={handleCancelApprove}>Anulează</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleApproveClick(book.bookId)}>Acceptă carte</button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default AcceptBook;