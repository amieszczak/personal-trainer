using PersonalTrainer.API.Models;
using PersonalTrainer.API.DTOs;

namespace PersonalTrainer.API.Services.Interfaces;

public interface ITransformationService
{
    Task<IEnumerable<Transformation>> GetAllAsync();
    Task<Transformation?> GetByIdAsync(int id);
    Task<IEnumerable<Transformation>> GetFeaturedAsync(int count = 3);
    Task<Transformation> CreateAsync(CreateTransformationDto dto);
    Task<IEnumerable<Transformation>> CreateBulkAsync(IEnumerable<CreateTransformationDto> dtos);
    Task<Transformation?> UpdateAsync(int id, UpdateTransformationDto dto);
    Task<bool> DeleteAsync(int id);
}
