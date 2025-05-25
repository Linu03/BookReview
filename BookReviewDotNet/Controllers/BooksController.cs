using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookReviewDotNet.Data;
using BookReviewDotNet.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BookReviewDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BooksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Books (Approved books)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            try
            {
                var books = await _context.Books
                    .Where(b => b.Status == "approved")
                    .Select(b => new Book
                    {
                        BookId = b.BookId,
                        Title = b.Title,
                        Author = b.Author,
                        Description = b.Description,
                        CoverImageUrl = b.CoverImageUrl,
                        Status = b.Status,
                        Genre = b.Genre,
                        ProposedByUserId = b.ProposedByUserId
                    })
                    .ToListAsync();

                if (!books.Any())
                {
                    return Ok(new List<Book>()); // Return empty list instead of null
                }

                return Ok(books);
            }
            catch (Exception ex)
            {
                // Log the exception details
                Console.WriteLine($"Error in GetBooks: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Books/5 (Specific book)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books
                .Select(b => new Book
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author,
                    Description = b.Description,
                    CoverImageUrl = b.CoverImageUrl,
                    Status = b.Status,
                    Genre = b.Genre,
                    ProposedByUserId = b.ProposedByUserId
                })
                .FirstOrDefaultAsync(b => b.BookId == id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // POST: api/Books (Add new pending book)
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate required fields
            if (string.IsNullOrWhiteSpace(book.Title))
            {
                ModelState.AddModelError("Title", "Title is required");
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(book.Author))
            {
                ModelState.AddModelError("Author", "Author is required");
                return BadRequest(ModelState);
            }

            // Set default values for optional fields
            book.Status = "pending";
            if (string.IsNullOrWhiteSpace(book.CoverImageUrl))
            {
                book.CoverImageUrl = "default-cover.jpg"; // You can set a default cover image
            }

            if (string.IsNullOrWhiteSpace(book.Description))
            {
                book.Description = "No description provided";
            }

            // Get the ID of the logged-in user
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("User is not authenticated or user ID is not available.");
            }

            book.ProposedByUserId = userId;

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
        }

        // GET: api/Books/pending
        [HttpGet("pending")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Book>>> GetPendingBooks()
        {
            return await _context.Books
                .Where(b => b.Status == "pending")
                .ToListAsync();
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Books/approve/5
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveBook(int id, [FromBody] List<string> genres)
        {
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.BookId == id);

            if (book == null)
            {
                return NotFound();
            }

            book.Genre = string.Join(", ", genres);
            book.Status = "approved";
            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Books.Any(e => e.BookId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // GET: api/Books/genres
        [HttpGet("genres")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Genre>>> GetGenres()
        {
            return await _context.Genres.ToListAsync();
        }
    }
} 