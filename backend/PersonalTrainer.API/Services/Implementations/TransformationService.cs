using System.Data;
using Microsoft.Data.Sqlite;
using PersonalTrainer.API.Models;
using PersonalTrainer.API.DTOs;
using PersonalTrainer.API.Services.Interfaces;

namespace PersonalTrainer.API.Services.Implementations;

public class TransformationService : ITransformationService
{
    private readonly string _connectionString;

    public TransformationService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    public async Task<IEnumerable<Transformation>> GetAllAsync()
    {
        var transformations = new List<Transformation>();

        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand("SELECT Id, Name, Age, Description, Story, Quote, Image FROM Transformations", connection);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            transformations.Add(MapToTransformation(reader));
        }

        return transformations;
    }

    public async Task<Transformation?> GetByIdAsync(int id)
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand(
            "SELECT Id, Name, Age, Description, Story, Quote, Image FROM Transformations WHERE Id = @Id",
            connection);
        command.Parameters.AddWithValue("@Id", id);

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return MapToTransformation(reader);
        }

        return null;
    }

    public async Task<IEnumerable<Transformation>> GetFeaturedAsync(int count = 3)
    {
        var transformations = new List<Transformation>();

        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand(
            $"SELECT Id, Name, Age, Description, Story, Quote, Image FROM Transformations ORDER BY Id LIMIT {count}",
            connection);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            transformations.Add(MapToTransformation(reader));
        }

        return transformations;
    }

    public async Task<Transformation> CreateAsync(CreateTransformationDto dto)
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand(
            @"INSERT INTO Transformations (Name, Age, Description, Story, Quote, Image)
              VALUES (@Name, @Age, @Description, @Story, @Quote, @Image);
              SELECT last_insert_rowid();",
            connection);

        command.Parameters.AddWithValue("@Name", dto.Name);
        command.Parameters.AddWithValue("@Age", dto.Age);
        command.Parameters.AddWithValue("@Description", dto.Description);
        command.Parameters.AddWithValue("@Story", dto.Story);
        command.Parameters.AddWithValue("@Quote", dto.Quote);
        command.Parameters.AddWithValue("@Image", (object?)dto.Image ?? DBNull.Value);

        var newId = Convert.ToInt32(await command.ExecuteScalarAsync());

        return new Transformation
        {
            Id = newId,
            Name = dto.Name,
            Age = dto.Age,
            Description = dto.Description,
            Story = dto.Story,
            Quote = dto.Quote,
            Image = dto.Image
        };
    }

    public async Task<IEnumerable<Transformation>> CreateBulkAsync(IEnumerable<CreateTransformationDto> dtos)
    {
        var transformations = new List<Transformation>();
        var dtosList = dtos.ToList();

        if (!dtosList.Any())
        {
            return transformations;
        }

        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        // Check if table exists
        var checkTableQuery = @"
            SELECT COUNT(*) 
            FROM sqlite_master 
            WHERE type='table' AND name='Transformations'";
        
        using var checkCommand = new SqliteCommand(checkTableQuery, connection);
        var tableExistsResult = await checkCommand.ExecuteScalarAsync();
        var tableExists = tableExistsResult != null && Convert.ToInt64(tableExistsResult) > 0;

        if (!tableExists)
        {
            throw new InvalidOperationException("Transformations table does not exist. Please ensure the database is initialized.");
        }

        // Use a transaction to ensure all-or-nothing behavior
        using var transaction = (SqliteTransaction)await connection.BeginTransactionAsync();

        try
        {
            foreach (var dto in dtosList)
            {
                var command = new SqliteCommand(
                    @"INSERT INTO Transformations (Name, Age, Description, Story, Quote, Image)
                      VALUES (@Name, @Age, @Description, @Story, @Quote, @Image);
                      SELECT last_insert_rowid();",
                    connection,
                    transaction);

                command.Parameters.AddWithValue("@Name", dto.Name ?? string.Empty);
                command.Parameters.AddWithValue("@Age", dto.Age);
                command.Parameters.AddWithValue("@Description", dto.Description ?? string.Empty);
                command.Parameters.AddWithValue("@Story", dto.Story ?? string.Empty);
                command.Parameters.AddWithValue("@Quote", dto.Quote ?? string.Empty);
                // Handle empty string as null for Image
                var imageValue = string.IsNullOrWhiteSpace(dto.Image) ? null : dto.Image;
                command.Parameters.AddWithValue("@Image", (object?)imageValue ?? DBNull.Value);

                var result = await command.ExecuteScalarAsync();
                if (result == null || result == DBNull.Value)
                {
                    throw new InvalidOperationException("Failed to insert transformation: no ID returned");
                }

                var newId = Convert.ToInt32(result);

                transformations.Add(new Transformation
                {
                    Id = newId,
                    Name = dto.Name ?? string.Empty,
                    Age = dto.Age,
                    Description = dto.Description ?? string.Empty,
                    Story = dto.Story ?? string.Empty,
                    Quote = dto.Quote ?? string.Empty,
                    Image = dto.Image
                });
            }

            await transaction.CommitAsync();
            return transformations;
        }
        catch (SqliteException sqlEx)
        {
            await transaction.RollbackAsync();
            throw new InvalidOperationException($"Database error: {sqlEx.Message}", sqlEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new InvalidOperationException($"Error saving transformations: {ex.Message}", ex);
        }
    }

    public async Task<Transformation?> UpdateAsync(int id, UpdateTransformationDto dto)
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand(
            @"UPDATE Transformations 
              SET Name = @Name, Age = @Age, Description = @Description, 
                  Story = @Story, Quote = @Quote, Image = @Image
              WHERE Id = @Id",
            connection);

        command.Parameters.AddWithValue("@Id", id);
        command.Parameters.AddWithValue("@Name", dto.Name);
        command.Parameters.AddWithValue("@Age", dto.Age);
        command.Parameters.AddWithValue("@Description", dto.Description);
        command.Parameters.AddWithValue("@Story", dto.Story);
        command.Parameters.AddWithValue("@Quote", dto.Quote);
        command.Parameters.AddWithValue("@Image", (object?)dto.Image ?? DBNull.Value);

        var rowsAffected = await command.ExecuteNonQueryAsync();

        if (rowsAffected == 0)
        {
            return null;
        }

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = new SqliteConnection(_connectionString);
        await connection.OpenAsync();

        var command = new SqliteCommand("DELETE FROM Transformations WHERE Id = @Id", connection);
        command.Parameters.AddWithValue("@Id", id);

        var rowsAffected = await command.ExecuteNonQueryAsync();
        return rowsAffected > 0;
    }

    private static Transformation MapToTransformation(SqliteDataReader reader)
    {
        return new Transformation
        {
            Id = reader.GetInt32(0),
            Name = reader.GetString(1),
            Age = reader.GetInt32(2),
            Description = reader.GetString(3),
            Story = reader.GetString(4),
            Quote = reader.GetString(5),
            Image = reader.IsDBNull(6) ? null : reader.GetString(6)
        };
    }
}
