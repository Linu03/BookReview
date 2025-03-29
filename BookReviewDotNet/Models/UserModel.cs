namespace BookReviewDotNet.Models
{

public class UserModel
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public UserModel(string name, string email, string password)
    {
        Name = name;
        Email = email;
        Password = password;
    }
}
}