using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookReviewDotNet.Data;
using BookReviewDotNet.Models;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace BookReviewDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(AppDbContext context, ILogger<ReviewsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Reviews/book/5
        [HttpGet("book/{bookId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsForBook(int bookId)
        {
            try
            {
                _logger.LogInformation($"Fetching reviews for book {bookId}");
                
                // First check if the book exists
                var bookExists = await _context.Books.AnyAsync(b => b.BookId == bookId);
                if (!bookExists)
                {
                    _logger.LogWarning($"Book with ID {bookId} not found");
                    return NotFound($"Book with ID {bookId} not found");
                }

                var reviews = await _context.Reviews
                    .Include(r => r.User)
                    .Where(r => r.BookId == bookId)
                    .OrderByDescending(r => r.ReviewId)
                    .ToListAsync();

                _logger.LogInformation($"Found {reviews.Count} reviews for book {bookId}");
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching reviews for book {bookId}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Reviews
        [HttpPost]
        // [Authorize]
        public async Task<ActionResult<Review>> CreateReview(Review review)
        {
            try
            {
                _logger.LogInformation($"Creating review: {JsonSerializer.Serialize(review)}");

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning($"Invalid model state: {JsonSerializer.Serialize(ModelState)}");
                    return BadRequest(ModelState);
                }

                // Verify the book exists
                var book = await _context.Books.FindAsync(review.BookId);
                if (book == null)
                {
                    _logger.LogWarning($"Book not found with ID: {review.BookId}");
                    return NotFound("Book not found");
                }

                // Verify the user exists
                var user = await _context.Users.FindAsync(review.UserId);
                if (user == null)
                {
                    _logger.LogWarning($"User not found with ID: {review.UserId}");
                    return NotFound("User not found");
                }

                // Ensure comment is not null
                if (string.IsNullOrEmpty(review.Comment))
                {
                    review.Comment = string.Empty;
                }

                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Review created successfully with ID: {review.ReviewId}");

                // Include user information in the response
                var createdReview = await _context.Reviews
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.ReviewId == review.ReviewId);

                return CreatedAtAction(nameof(GetReviewsForBook), new { bookId = review.BookId }, createdReview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Reviews/5
        [HttpDelete("{id}")]
        // [Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                var review = await _context.Reviews.FindAsync(id);
                if (review == null)
                {
                    _logger.LogWarning($"Review not found with ID: {id}");
                    return NotFound();
                }

                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Review deleted successfully with ID: {id}");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting review with ID: {id}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
} 