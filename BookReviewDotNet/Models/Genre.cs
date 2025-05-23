using System.ComponentModel.DataAnnotations;

namespace BookReviewDotNet.Models
{
    public class Genre
    {
        [Key]
        public int GenreId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string? Description { get; set; }
    }
} 