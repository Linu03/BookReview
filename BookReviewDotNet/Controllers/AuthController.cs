using BookReviewDotNet.Models; 
using BookReviewDotNet.Data; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace BookReviewDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {   
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserModel userModel)
        {
            if (userModel == null)
            {
                return BadRequest("User data is required.");
            }

            Console.WriteLine($"Received registration request: Name = {userModel.Name}, Email = {userModel.Email}, Password = {userModel.Password}");

            // validation
            if (string.IsNullOrEmpty(userModel.Name) || string.IsNullOrEmpty(userModel.Email) || string.IsNullOrEmpty(userModel.Password))
            {
                return BadRequest("All fields are required.");
            }

            // email existence check
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userModel.Email);
            if (existingUser != null)
            {
                return BadRequest("User with this email already exists.");
            }

            // Password encryption
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userModel.Password);
            Console.WriteLine($"Password encrypted: {hashedPassword}");

            // Create new user
            var user = new UserModel
            {
                Name = userModel.Name,
                Email = userModel.Email,
                Password = hashedPassword
            };

            // Add new user in DB
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {   
            // Check raw data in the front console
            Console.WriteLine($"User logged in with email: {loginModel.Email} and password: {loginModel.Password}");
    
            if (loginModel == null)
            {   
                return BadRequest("Email and password are required.");
            }

            // Validation
            if (string.IsNullOrEmpty(loginModel.Email) || string.IsNullOrEmpty(loginModel.Password))
            {
                return BadRequest("Email and password are required.");
            }

            // Verificare în baza de date
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginModel.Email);
            if (user == null)
            {
                return BadRequest("Invalid email or password.");
            }

            // Database check
            bool passwordMatch = BCrypt.Net.BCrypt.Verify(loginModel.Password, user.Password);
            Console.WriteLine($"Password from database: {user.Password}");
            Console.WriteLine($"Password from front-end: {loginModel.Password}");
            Console.WriteLine($"Password match: {passwordMatch}");

            if (!passwordMatch)
            {
                return BadRequest("Invalid email or password.");
            }

            // dates match?
            Console.WriteLine("Login corect: Datele din front-end sunt aceleași cu datele din baza de date.");

            return Ok(new { message = "User logged in successfully" });
        }
    }
}
