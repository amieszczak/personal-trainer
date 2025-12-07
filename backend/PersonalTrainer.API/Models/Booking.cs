namespace PersonalTrainer.API.Models;

public class Booking
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public int TrainingId { get; set; }
    public DateTime BookingDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public BookingStatus Status { get; set; }
    public string? Notes { get; set; }
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Completed,
    Cancelled
}

