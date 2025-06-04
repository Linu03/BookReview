import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useAuth } from '../Context/AuthContext';
import './BookDetails.css';

const BookDetails = () => {
    const { bookId } = useParams();
    const { isAdmin } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [proposedUserName, setProposedUserName] = useState('Unknown');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: ''
    });

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

    const handleSubmitReview = async () => {
        console.log('handleSubmitReview called');
        if (!newReview.rating || !newReview.comment.trim()) {
            setError('Te rugăm să completezi toate câmpurile obligatorii');
            console.log('STOP: rating sau comment lipsa');
            return;
        }

        const reviewData = {
            bookId: parseInt(bookId),
            userId: 1,
            rating: newReview.rating,
            comment: newReview.comment.trim()
        };
        console.log('Review data to send:', reviewData);
        console.log('bookId trimis:', bookId);

        try {
            const response = await axios.post('http://localhost:5122/api/Reviews', reviewData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('POST /api/Reviews response:', response);
            if (response.status === 200 || response.status === 201) {
                setNewReview({ rating: 0, comment: '' });
                setShowReviewForm(false);
                fetchReviews(); // Refresh the reviews list
                alert('Review-ul a fost adăugat cu succes!');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('A apărut o eroare la salvarea review-ului. Te rugăm să încerci din nou.');
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:5122/api/Reviews/book/${bookId}`);
            console.log('Reviews primite de la backend:', response.data);
            setReviews(response.data);
            setTimeout(() => {
                console.log('Reviews in state:', reviews);
            }, 100);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('A apărut o eroare la încărcarea review-urilor.');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Sigur doriți să ștergeți acest review?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5122/api/Reviews/${reviewId}`);
            // Actualizăm lista de review-uri după ștergere
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            setError('A apărut o eroare la ștergerea review-ului.');
        }
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

                // Fetch reviews after getting book details
                await fetchReviews();

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
                    {reviews.filter(review => review.bookId === parseInt(bookId)).length === 0 ? (
                        <p className="no-reviews">Nu există recenzii pentru această carte. Fii primul care adaugă o recenzie!</p>
                    ) : (
                        <>
                            {reviews
                                .filter(review => review.bookId === parseInt(bookId))
                                .slice(0, showAllReviews ? undefined : 5)
                                .map((review) => (
                                    <div key={review.reviewId} className="review-card">
                                        <div className="review-header">
                                            <span className="review-rating">{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</span>
                                            {isAdmin() && (
                                                <button 
                                                    className="delete-review-btn"
                                                    onClick={() => handleDeleteReview(review.reviewId)}
                                                    title="Șterge review"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                        <p className="review-text">{review.comment}</p>
                                    </div>
                                ))}
                            {reviews.filter(review => review.bookId === parseInt(bookId)).length > 5 && (
                                <button 
                                    className="toggle-reviews-btn"
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                >
                                    {showAllReviews ? 'Arată mai puține review-uri' : 'Arată toate review-urile'}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add Review Button */}
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
                                type="button"
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