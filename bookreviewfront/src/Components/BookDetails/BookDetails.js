import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import './BookDetails.css';

const BookDetails = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [proposedUserName, setProposedUserName] = useState('Unknown');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: ''
    });

    // Hardcoded reviews for demonstration
    const hardcodedReviews = [
        {
            id: 1,
            reviewerName: "Maria Popescu",
            rating: 5,
            comment: "O carte extraordinară! Mi-a captivat atenția de la prima pagină. Personajele sunt foarte bine construite și povestea este captivantă.",
            date: "2024-03-15"
        },
        {
            id: 2,
            reviewerName: "Ion Ionescu",
            rating: 4,
            comment: "O lectură plăcută, cu momente foarte interesante. Recomand cu plăcere, deși finalul mi s-a părut puțin grăbit.",
            date: "2024-03-10"
        },
        {
            id: 3,
            reviewerName: "Ana Dumitrescu",
            rating: 5,
            comment: "Una dintre cele mai bune cărți pe care le-am citit anul acesta. Stilul de scriere este fluid și personajele sunt memorabile.",
            date: "2024-03-05"
        }
    ];

    useDocumentTitle('Booksy');

    const truncateText = (text, wordLimit) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const handleStarClick = (rating) => {
        setNewReview(prev => ({ ...prev, rating }));
    };

    const handleCommentChange = (e) => {
        setNewReview(prev => ({ ...prev, comment: e.target.value }));
    };

    const handleSubmitReview = () => {
        // Here you would typically send the review to your backend
        console.log('New review:', newReview);
        // Reset form
        setNewReview({ rating: 0, comment: '' });
        setShowReviewForm(false);
    };

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5122/api/Books/${bookId}`);
                setBook(response.data);
                setLoading(false);

                if (response.data && response.data.proposedByUserId) {
                    const userResponse = await axios.get(`http://localhost:5122/api/Auth/user/${response.data.proposedByUserId}`);
                    if (userResponse.data && userResponse.data.name) {
                        setProposedUserName(userResponse.data.name);
                    } else {
                        setProposedUserName('Unknown user');
                    }
                } else {
                    setProposedUserName('Unknown');
                }

            } catch (err) {
                setError('Error fetching book or user details');
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!book) return <div>Book not found</div>;

    return (
        <div className="book-details-container">
            <div className="book-details-content">
                <div className="book-image-section">
                    {book.coverImageUrl && (
                        <img 
                            src={book.coverImageUrl} 
                            alt={book.title} 
                            className="book-cover-large"
                        />
                    )}
                </div>
                <div className="book-info-section">
                    <div className="book-title-box">
                        <h1>{book.title}</h1>
                    </div>
                    <div className="book-author-box">
                        <p className="author">By {book.author}</p>
                    </div>
                    <div className="book-genre-box">
                        <p className="genre">Gen: {book.genre}</p>
                    </div>
                    <div className="book-description-box">
                        <p className="description">
                            Descriere: {book.description ? (showFullDescription ? book.description : truncateText(book.description, 50)) : 'No description available'}
                        </p>
                        {book.description && book.description.split(' ').length > 50 && (
                            <button 
                                className="toggle-description-btn"
                                onClick={() => setShowFullDescription(!showFullDescription)}
                            >
                                {showFullDescription ? 'Arata mai putin' : 'Arata mai mult'}
                            </button>
                        )}
                    </div>
                    <div className="book-proposed-by-box">
                        <p className="proposed-by">Propusa de: {proposedUserName}</p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
                <h2>Recenzii</h2>
                <div className="reviews-list">
                    {hardcodedReviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <span className="reviewer-name">{review.reviewerName}</span>
                                <span className="review-rating">{renderStars(review.rating)}</span>
                            </div>
                            <p className="review-text">{review.comment}</p>
                            <div className="review-date">
                                {new Date(review.date).toLocaleDateString('ro-RO')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Review Button - Moved outside reviews section */}
            <div className="add-review-container">
                <button 
                    className="add-review-btn"
                    onClick={() => setShowReviewForm(true)}
                >
                    Adaugă Review
                </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="review-form-container">
                    <div className="review-form">
                        <h3>Adaugă un review</h3>
                        
                        {/* Star Rating */}
                        <div className="star-rating">
                            <p>Rating:</p>
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${star <= newReview.rating ? 'filled' : ''}`}
                                        onClick={() => handleStarClick(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="comment-input">
                            <p>Comentariu:</p>
                            <textarea
                                value={newReview.comment}
                                onChange={handleCommentChange}
                                placeholder="Scrie un comentariu despre această carte..."
                                rows="4"
                            />
                        </div>

                        {/* Submit and Cancel Buttons */}
                        <div className="form-buttons">
                            <button 
                                className="submit-review-btn"
                                onClick={handleSubmitReview}
                                disabled={!newReview.rating || !newReview.comment.trim()}
                            >
                                Trimite Review
                            </button>
                            <button 
                                className="cancel-review-btn"
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setNewReview({ rating: 0, comment: '' });
                                }}
                            >
                                Anulează
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails; 