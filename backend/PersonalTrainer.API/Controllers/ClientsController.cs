using Microsoft.AspNetCore.Mvc;
using PersonalTrainer.API.Models;
using PersonalTrainer.API.DTOs;

namespace PersonalTrainer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private static readonly List<Client> _clients = new()
    {
        new Client { Id = 1, Name = "Anna Kowalska", Email = "anna.kowalska@example.com", Phone = "+48 123 456 789", JoinDate = DateTime.Now.AddMonths(-6), ImageUrl = "/images/gallery/Anna.png", IsActive = true },
        new Client { Id = 2, Name = "Marek Nowak", Email = "marek.nowak@example.com", Phone = "+48 987 654 321", JoinDate = DateTime.Now.AddMonths(-3), ImageUrl = "/images/gallery/Marek.png", IsActive = true }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Client>> GetAll()
    {
        return Ok(_clients.Where(c => c.IsActive));
    }

    [HttpGet("{id}")]
    public ActionResult<Client> GetById(int id)
    {
        var client = _clients.FirstOrDefault(c => c.Id == id);
        if (client == null)
        {
            return NotFound(new { message = $"Client with ID {id} not found" });
        }
        return Ok(client);
    }

    [HttpPost]
    public ActionResult<Client> Create(CreateClientDto dto)
    {
        var client = new Client
        {
            Id = _clients.Any() ? _clients.Max(c => c.Id) + 1 : 1,
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            ImageUrl = dto.ImageUrl,
            JoinDate = DateTime.Now,
            IsActive = true
        };

        _clients.Add(client);
        return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
    }

    [HttpPut("{id}")]
    public ActionResult<Client> Update(int id, CreateClientDto dto)
    {
        var client = _clients.FirstOrDefault(c => c.Id == id);
        if (client == null)
        {
            return NotFound(new { message = $"Client with ID {id} not found" });
        }

        client.Name = dto.Name;
        client.Email = dto.Email;
        client.Phone = dto.Phone;
        client.ImageUrl = dto.ImageUrl;

        return Ok(client);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var client = _clients.FirstOrDefault(c => c.Id == id);
        if (client == null)
        {
            return NotFound(new { message = $"Client with ID {id} not found" });
        }

        client.IsActive = false;
        return NoContent();
    }
}

