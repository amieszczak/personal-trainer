namespace PersonalTrainer.API.DTOs;

public class CreateTransformationDto
{
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Story { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string? Image { get; set; }
}

