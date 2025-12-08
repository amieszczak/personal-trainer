using System.Reflection.Metadata;
using Microsoft.Data.Sqlite;
using PersonalTrainer.API.DTOs;
using PersonalTrainer.API.Models;
using PersonalTrainer.API.Services.Interfaces;

namespace PersonalTrainer.API.Services.Implementations;

public class AchievementService : IAchievementService
{
    private readonly string _connectionString;

    public AchievementService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }
    
    public async Task<IEnumerable<Achievement>> GetAllAsync()
    {
        var achievements = new List<Achievement>();

        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand("SELECT id, title, description FROM Achievements", connection);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            achievements.Add(MapToAchievement(reader));
        }

        return achievements;
    }

    public async Task<Achievement?> GetByIdAsync(int id)
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand("SELECT Id, Title, Description FROM Achievements WHERE id = @Id", connection);
        command.Parameters.AddWithValue("@Id", id);

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return MapToAchievement(reader);
        }

        return null;
    }

    public async Task<Achievement> CreateAsync(CreateAchievementDto dto)
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand("INSERT INTO Achievements (Title, Description) VALUES (@Title, @Description); SELECT last_insert_rowid();", connection);

        command.Parameters.AddWithValue("@Title", dto.Title);
        command.Parameters.AddWithValue("@Description", dto.Description);

        var newId = Convert.ToInt32(await command.ExecuteScalarAsync());

        return new Achievement {
            Id = newId,
            Title = dto.Title,
            Description = dto.Description,
        };
    }

    public async Task<Achievement?> UpdateAsync(int id, UpdateAchievementDto dto)
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand(@"UPDATE Achievements SET Title = @Title, Description = @Description WHERE Id = @Id", connection);
        command.Parameters.AddWithValue("@Id", id);
        command.Parameters.AddWithValue("@Title", dto.Title);
        command.Parameters.AddWithValue("@Description", dto.Description);

        var rowsAffected = await command.ExecuteNonQueryAsync();
        if (rowsAffected == 0)
        {
            return null;
        }
        return await GetByIdAsync(id);
    }

    private static Achievement MapToAchievement(SqliteDataReader reader)
    {
        return new Achievement
        {
            Id = reader.GetInt32(0),
            Title = reader.GetString(1),
            Description = reader.GetString(2),
        };
    }
}
