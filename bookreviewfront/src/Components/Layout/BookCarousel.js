import React, { useState, useEffect } from 'react';
import './BookCarousel.css';

const books = [
  {
    title: 'The Great Gatsby',
    img: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'To Kill a Mockingbird',
    img: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: '1984',
    img: 'https://m.media-amazon.com/images/I/81StSOpmkjL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'Pride and Prejudice',
    img: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'The Catcher in the Rye',
    img: 'https://m.media-amazon.com/images/I/91HPG31dTwL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    title: 'Crime and Punishment',
    img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg',
  }
];

const BookCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotateBooks = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  useEffect(() => {
    const interval = setInterval(rotateBooks, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/200x300?text=Book+Cover';
  };

  // Get the three books to display
  const getDisplayBooks = () => {
    const booksToShow = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % books.length;
      booksToShow.push(books[index]);
    }
    return booksToShow;
  };

  const displayBooks = getDisplayBooks();

  return (
    <div className="carousel-container" onClick={rotateBooks}>
      <div className="book small">
        <img 
          src={displayBooks[0].img} 
          alt={displayBooks[0].title} 
          onError={handleImageError}
        />
      </div>
      <div className="book large">
        <img 
          src={displayBooks[1].img} 
          alt={displayBooks[1].title} 
          onError={handleImageError}
        />
        <p className="book-title">{displayBooks[1].title}</p>
      </div>
      <div className="book small">
        <img 
          src={displayBooks[2].img} 
          alt={displayBooks[2].title} 
          onError={handleImageError}
        />
      </div>
    </div>
  );
};

export default BookCarousel;
