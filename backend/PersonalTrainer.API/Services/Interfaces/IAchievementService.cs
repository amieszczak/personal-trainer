using PersonalTrainer.API.Models;
using PersonalTrainer.API.DTOs;

namespace PersonalTrainer.API.Services.Interfaces;

public interface IAchievementService
{
    Task<IEnumerable<Achievement>> GetAllAsync();
    Task<Achievement?> GetByIdAsync(int id);
    Task<Achievement> CreateAsync(CreateAchievementDto dto);

    Task<Achievement?> UpdateAsync(int id, UpdateAchievementDto dto);
}
