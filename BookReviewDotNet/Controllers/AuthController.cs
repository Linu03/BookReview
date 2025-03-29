using BookReviewDotNet.Models; 
using Microsoft.AspNetCore.Mvc;

namespace BookReviewDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {   
        // POST: api/auth/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserModel userModel)
        {   
            Console.WriteLine($"User name: {userModel.Name} and email: {userModel.Email} and password: {userModel.Password}");
            if (userModel == null)
            {
                return BadRequest("User data is required.");
            }

            // logica inregistrare aici
            // encriptia
            // de vazut daca e gol ce vine // front?

            return Ok(new { message = "User registered successfully" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel loginModel)  
        {   
            Console.WriteLine($"User logged in with email: {loginModel.Email} and password: {loginModel.Password}");
            
            if (loginModel == null)
            {   
                return BadRequest("Email and password are required.");
            }

            // aici verificam daca corespund datele introduse la login cu ceva din baza de date
            // decriptia

            return Ok(new { message = "User logged in successfully" });
        }
    }
}
