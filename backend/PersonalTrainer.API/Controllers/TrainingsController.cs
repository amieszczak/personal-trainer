using Microsoft.AspNetCore.Mvc;
using PersonalTrainer.API.Models;
using PersonalTrainer.API.DTOs;

namespace PersonalTrainer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainingsController : ControllerBase
{
    private static readonly List<Training> _trainings = new()
    {
        new Training { Id = 1, Name = "Personal Training", Description = "One-on-one personalized training session", DurationMinutes = 60, Price = 100, Category = "Individual", IsAvailable = true },
        new Training { Id = 2, Name = "Group Training", Description = "Small group training session", DurationMinutes = 45, Price = 50, Category = "Group", IsAvailable = true },
        new Training { Id = 3, Name = "Strength & Conditioning", Description = "Advanced strength training program", DurationMinutes = 90, Price = 120, Category = "Specialized", IsAvailable = true }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Training>> GetAll()
    {
        return Ok(_trainings.Where(t => t.IsAvailable));
    }

    [HttpGet("{id}")]
    public ActionResult<Training> GetById(int id)
    {
        var training = _trainings.FirstOrDefault(t => t.Id == id);
        if (training == null)
        {
            return NotFound(new { message = $"Training with ID {id} not found" });
        }
        return Ok(training);
    }

    [HttpGet("category/{category}")]
    public ActionResult<IEnumerable<Training>> GetByCategory(string category)
    {
        var trainings = _trainings.Where(t => 
            t.Category.Equals(category, StringComparison.OrdinalIgnoreCase) && t.IsAvailable);
        return Ok(trainings);
    }

    [HttpPost]
    public ActionResult<Training> Create(TrainingDto dto)
    {
        var training = new Training
        {
            Id = _trainings.Max(t => t.Id) + 1,
            Name = dto.Name,
            Description = dto.Description,
            DurationMinutes = dto.DurationMinutes,
            Price = dto.Price,
            Category = dto.Category,
            IsAvailable = true
        };

        _trainings.Add(training);
        return CreatedAtAction(nameof(GetById), new { id = training.Id }, training);
    }

    [HttpPut("{id}")]
    public ActionResult<Training> Update(int id, TrainingDto dto)
    {
        var training = _trainings.FirstOrDefault(t => t.Id == id);
        if (training == null)
        {
            return NotFound(new { message = $"Training with ID {id} not found" });
        }

        training.Name = dto.Name;
        training.Description = dto.Description;
        training.DurationMinutes = dto.DurationMinutes;
        training.Price = dto.Price;
        training.Category = dto.Category;

        return Ok(training);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var training = _trainings.FirstOrDefault(t => t.Id == id);
        if (training == null)
        {
            return NotFound(new { message = $"Training with ID {id} not found" });
        }

        training.IsAvailable = false;
        return NoContent();
    }
}

