using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace BookReviewDotNet.Models
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        [StringLength(255)]
        public string Author { get; set; }

        public string? Description { get; set; }

        [StringLength(500)]
        public string? CoverImageUrl { get; set; }

        public string? Status { get; set; }

        [StringLength(100)]
        public string? Genre { get; set; }

        public int? ProposedByUserId { get; set; }

        // Navigation property for the many-to-many relationship (made nullable)
        public ICollection<BookGenre>? BookGenres { get; set; }
    }
} 