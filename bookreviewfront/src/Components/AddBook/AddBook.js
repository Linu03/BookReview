import React, { useEffect, useState } from 'react';
import Navbar from '../Layout/Navbar';
import './AddBook.css';

const AddBook = () => {
    useEffect(() => {
        document.title = "Booksy - Add a Book";
    }, []);

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [showThankYou, setShowThankYou] = useState(false);

    useEffect(() => {
        let timer;
        if (showThankYou) {
            timer = setTimeout(() => {
                setShowThankYou(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showThankYou]);

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!title || !author || !description || !coverUrl) {
            alert("Vă rugăm să completați toate câmpurile!");
            return;
        }

        const book = {
            title,
            author,
            description,
            coverImageUrl: coverUrl
        };

        try {
            const response = await fetch('http://localhost:5122/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            });

            if (response.ok) {
                setTitle('');
                setAuthor('');
                setDescription('');
                setCoverUrl('');
                setShowThankYou(true);
            } else {
                setTitle('');
                setAuthor('');
                setDescription('');
                setCoverUrl('');
                alert("A apărut o eroare la adăugarea cărții.");
            }
        } catch (error) {
            setTitle('');
            setAuthor('');
            setDescription('');
            setCoverUrl('');
            console.error("Eroare la trimitere:", error);
            alert("Eroare la trimitere.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="addbook-container">
                <h1>Adaugă o carte nouă</h1>
                {showThankYou && (
                    <div className="thank-you-message">
                        Mulțumim pentru ajutor!
                    </div>
                )}
                <form className="addbook-form" onSubmit={handleSubmit}>
                    <label>
                        Titlu:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Autor:
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Descriere:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label>
                        URL imagine copertă:
                        <input
                            type="text"
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                        />
                    </label>
                    <button type="submit">Adaugă carte</button>
                </form>
            </div>
        </>
    );
};

export default AddBook;
