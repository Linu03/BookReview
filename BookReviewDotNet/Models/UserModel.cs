namespace BookReviewDotNet.Models
{

public class UserModel
{   
    public int ID { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string Role { get; set; } = "user";
    
    // deserialization
    public UserModel()
    {
    }

    public UserModel(int id, string name, string email, string password)
    {
        ID = id;
        Name = name;
        Email = email;
        Password = password;
    }
}
}