namespace PersonalTrainer.API.DTOs;

public class CreateAchievementDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}