namespace PersonalTrainer.API.DTOs;

public class TrainingDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
}

