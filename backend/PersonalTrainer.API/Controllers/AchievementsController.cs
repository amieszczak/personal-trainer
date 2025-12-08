

using Microsoft.AspNetCore.Mvc;
using PersonalTrainer.API.DTOs;
using PersonalTrainer.API.Models;
using PersonalTrainer.API.Services.Interfaces;

namespace PersonalTrainer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AchievementsController : ControllerBase
{
    private readonly IAchievementService _achievementService;

    public AchievementsController(IAchievementService achievementService)
    {
        _achievementService = achievementService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Achievement>>> GetAll()
    {
        var achievements = await _achievementService.GetAllAsync();
        return Ok(achievements);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Achievement>> GetById(int id)
    {
        var achievement = await _achievementService.GetByIdAsync(id);
        if (achievement == null) 
        {
            return NotFound(new {message = $"Achievement with ID {id} not found"});
        }
        return Ok(achievement);
    }

    [HttpPost]
    public async Task<ActionResult<Achievement>> Create(CreateAchievementDto dto)
    {
        var achievement = await _achievementService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new {id = achievement.Id}, achievement);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Achievement>> Update(int id, UpdateAchievementDto dto)
    {
        var achievement = await _achievementService.UpdateAsync(id, dto);
        if (achievement == null)
        {
            return NotFound(new {message = $"Achievement with ID {id} not found"});
        }
        return Ok(achievement);
    }
}
