namespace PersonalTrainer.API.Models;

public class Transformation
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Story { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string? Image { get; set; }
}

