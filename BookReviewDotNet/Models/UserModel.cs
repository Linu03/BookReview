namespace BookReviewDotNet.Models
{

public class UserModel
{   
    public int ID { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

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