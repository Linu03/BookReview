using BookReviewDotNet.Models; 
using BookReviewDotNet.Data; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Text;  
using Microsoft.Extensions.Configuration;  
using Microsoft.IdentityModel.Tokens;  
using System.IdentityModel.Tokens.Jwt;  
using System.Security.Claims;  

namespace BookReviewDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {   
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
        _context = context;
        _configuration = configuration;
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
                Password = hashedPassword,
                Role = "user"
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
                Console.WriteLine("Login failed: Email not found in database.");
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
            
            if (string.IsNullOrEmpty(_configuration["Jwt:SecretKey"]))
            {
            return BadRequest("SecretKey is missing in configuration.");
            }

            var secretKey = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]);
            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
            // putem adauga mai multe
            };

            var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1), // 1 ora
            signingCredentials: signingCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // returnează token-ul JWT
            return Ok(new { Token = tokenString });

        }
    }
}
