using Microsoft.AspNetCore.Mvc;
using PersonalTrainer.API.Models;
using PersonalTrainer.API.DTOs;
using PersonalTrainer.API.Services.Interfaces;

namespace PersonalTrainer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransformationsController : ControllerBase
{
    private readonly ITransformationService _transformationService;

    public TransformationsController(ITransformationService transformationService)
    {
        _transformationService = transformationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transformation>>> GetAll()
    {
        var transformations = await _transformationService.GetAllAsync();
        return Ok(transformations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Transformation>> GetById(int id)
    {
        var transformation = await _transformationService.GetByIdAsync(id);
        if (transformation == null)
        {
            return NotFound(new { message = $"Transformation with ID {id} not found" });
        }
        return Ok(transformation);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Transformation>>> GetFeatured()
    {
        var featured = await _transformationService.GetFeaturedAsync();
        return Ok(featured);
    }

    [HttpPost]
    public async Task<ActionResult<Transformation>> Create(CreateTransformationDto dto)
    {
        var transformation = await _transformationService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = transformation.Id }, transformation);
    }

    [HttpPost("bulk")]
    public async Task<ActionResult<IEnumerable<Transformation>>> CreateBulk(IEnumerable<CreateTransformationDto> dtos)
    {
        try
        {
            if (dtos == null || !dtos.Any())
            {
                return BadRequest(new { message = "No transformations provided" });
            }

            var transformations = await _transformationService.CreateBulkAsync(dtos);
            return CreatedAtAction(nameof(GetAll), transformations);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"We cannot save data into local database. Error: {ex.Message}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Transformation>> Update(int id, UpdateTransformationDto dto)
    {
        var transformation = await _transformationService.UpdateAsync(id, dto);
        if (transformation == null)
        {
            return NotFound(new { message = $"Transformation with ID {id} not found" });
        }
        return Ok(transformation);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var deleted = await _transformationService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = $"Transformation with ID {id} not found" });
        }
        return NoContent();
    }
}

