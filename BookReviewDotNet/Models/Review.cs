using System.ComponentModel.DataAnnotations;

namespace BookReviewDotNet.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string Comment { get; set; } = string.Empty;

        // Navigation properties
        public Book? Book { get; set; }
        public UserModel? User { get; set; }
    }
} 