using Microsoft.AspNetCore.Mvc;

namespace PersonalTrainer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly Dictionary<string, TestUser> _users;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
        _users = LoadUsersFromConfiguration();
    }

    private Dictionary<string, TestUser> LoadUsersFromConfiguration()
    {
        var users = new Dictionary<string, TestUser>();
        var testUsers = _configuration.GetSection("Authentication:TestUsers").Get<List<TestUser>>();

        if (testUsers != null && testUsers.Any())
        {
            foreach (var user in testUsers)
            {
                users[user.Email] = user;
            }
        }

        return users;
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        if (_users.TryGetValue(request.Email, out var user))
        {
            if (user.Password == request.Password)
            {
                return Ok(new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = $"sample-token-{Guid.NewGuid()}",
                    Email = request.Email,
                    Role = user.Role
                });
            }
        }

        return Unauthorized(new { message = "Invalid email or password" });
    }

    [HttpPost("register")]
    public ActionResult<RegisterResponse> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        if (_users.ContainsKey(request.Email))
        {
            return BadRequest(new { message = "User with this email already exists" });
        }

        _users.Add(request.Email, new TestUser 
        { 
            Email = request.Email, 
            Password = request.Password, 
            Role = "User" 
        });

        return Ok(new RegisterResponse
        {
            Success = true,
            Message = "Registration successful",
            Email = request.Email
        });
    }

    [HttpPost("validate")]
    public ActionResult<ValidateResponse> ValidateToken([FromBody] ValidateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return BadRequest(new { message = "Token is required" });
        }

        if (request.Token.StartsWith("sample-token-"))
        {
            return Ok(new ValidateResponse
            {
                IsValid = true,
                Message = "Token is valid"
            });
        }

        return Ok(new ValidateResponse
        {
            IsValid = false,
            Message = "Token is invalid or expired"
        });
    }

    [HttpGet("test")]
    public ActionResult<string> Test()
    {
        return Ok(new { message = "Auth controller is working!", timestamp = DateTime.Now });
    }

    [HttpGet("debug/users")]
    public ActionResult GetLoadedUsers()
    {
        var userList = _users.Select(u => new { 
            Email = u.Key, 
            Role = u.Value.Role,
            HasPassword = !string.IsNullOrEmpty(u.Value.Password)
        });
        return Ok(new { 
            count = _users.Count, 
            users = userList 
        });
    }
}

// DTOs for request/response
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class RegisterResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class ValidateRequest
{
    public string Token { get; set; } = string.Empty;
}

public class ValidateResponse
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class TestUser
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
}
