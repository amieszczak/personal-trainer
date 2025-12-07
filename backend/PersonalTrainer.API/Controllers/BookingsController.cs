using Microsoft.AspNetCore.Mvc;
using PersonalTrainer.API.Models;
using PersonalTrainer.API.DTOs;

namespace PersonalTrainer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private static readonly List<Booking> _bookings = new()
    {
        new Booking { Id = 1, ClientId = 1, TrainingId = 1, BookingDate = DateTime.Now.AddDays(2), CreatedAt = DateTime.Now, Status = BookingStatus.Confirmed, Notes = "First session" },
        new Booking { Id = 2, ClientId = 2, TrainingId = 3, BookingDate = DateTime.Now.AddDays(5), CreatedAt = DateTime.Now, Status = BookingStatus.Pending }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Booking>> GetAll()
    {
        return Ok(_bookings);
    }

    [HttpGet("{id}")]
    public ActionResult<Booking> GetById(int id)
    {
        var booking = _bookings.FirstOrDefault(b => b.Id == id);
        if (booking == null)
        {
            return NotFound(new { message = $"Booking with ID {id} not found" });
        }
        return Ok(booking);
    }

    [HttpGet("client/{clientId}")]
    public ActionResult<IEnumerable<Booking>> GetByClient(int clientId)
    {
        var bookings = _bookings.Where(b => b.ClientId == clientId);
        return Ok(bookings);
    }

    [HttpGet("upcoming")]
    public ActionResult<IEnumerable<Booking>> GetUpcoming()
    {
        var upcomingBookings = _bookings
            .Where(b => b.BookingDate > DateTime.Now && b.Status != BookingStatus.Cancelled)
            .OrderBy(b => b.BookingDate);
        return Ok(upcomingBookings);
    }

    [HttpPost]
    public ActionResult<Booking> Create(CreateBookingDto dto)
    {
        var booking = new Booking
        {
            Id = _bookings.Any() ? _bookings.Max(b => b.Id) + 1 : 1,
            ClientId = dto.ClientId,
            TrainingId = dto.TrainingId,
            BookingDate = dto.BookingDate,
            CreatedAt = DateTime.Now,
            Status = BookingStatus.Pending,
            Notes = dto.Notes
        };

        _bookings.Add(booking);
        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
    }

    [HttpPut("{id}/status")]
    public ActionResult<Booking> UpdateStatus(int id, [FromBody] BookingStatus status)
    {
        var booking = _bookings.FirstOrDefault(b => b.Id == id);
        if (booking == null)
        {
            return NotFound(new { message = $"Booking with ID {id} not found" });
        }

        booking.Status = status;
        return Ok(booking);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var booking = _bookings.FirstOrDefault(b => b.Id == id);
        if (booking == null)
        {
            return NotFound(new { message = $"Booking with ID {id} not found" });
        }

        booking.Status = BookingStatus.Cancelled;
        return NoContent();
    }
}

