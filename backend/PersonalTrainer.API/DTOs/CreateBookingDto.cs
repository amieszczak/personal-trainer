namespace PersonalTrainer.API.DTOs;

public class CreateBookingDto
{
    public int ClientId { get; set; }
    public int TrainingId { get; set; }
    public DateTime BookingDate { get; set; }
    public string? Notes { get; set; }
}

