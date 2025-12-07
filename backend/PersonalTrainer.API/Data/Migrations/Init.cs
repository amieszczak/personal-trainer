using Microsoft.Data.Sqlite;

namespace PersonalTrainer.API.Data.Migrations;

public class Init
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<Init> _logger;

    public Init(IConfiguration configuration, ILogger<Init> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task InitializeDatabaseAsync()
    {
        try
        {
            var databasePath = _configuration["Database:LocalPath"];
            if (string.IsNullOrEmpty(databasePath))
            {
                _logger.LogWarning("Database:LocalPath not configured. Skipping database initialization.");
                return;
            }

            // Create directory if it doesn't exist
            if (!Directory.Exists(databasePath))
            {
                Directory.CreateDirectory(databasePath);
                _logger.LogInformation("Created database directory: {Path}", databasePath);
            }

            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(connectionString))
            {
                _logger.LogError("Connection string 'DefaultConnection' not found.");
                return;
            }

            // Extract database file path from connection string
            var dbFilePath = connectionString.Replace("Data Source=", "").Trim();
            var dbDirectory = Path.GetDirectoryName(dbFilePath);
            if (!string.IsNullOrEmpty(dbDirectory) && !Directory.Exists(dbDirectory))
            {
                Directory.CreateDirectory(dbDirectory);
                _logger.LogInformation("Created database file directory: {Path}", dbDirectory);
            }

            // Read SQL script - try multiple possible paths
            var possiblePaths = new[]
            {
                Path.Combine(AppContext.BaseDirectory, "Data", "01_CreateTables.sql"),
                Path.Combine(Directory.GetCurrentDirectory(), "Data", "01_CreateTables.sql"),
                Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Data", "01_CreateTables.sql")
            };

            string? sqlScriptPath = null;
            foreach (var path in possiblePaths)
            {
                if (File.Exists(path))
                {
                    sqlScriptPath = path;
                    break;
                }
            }

            if (string.IsNullOrEmpty(sqlScriptPath) || !File.Exists(sqlScriptPath))
            {
                _logger.LogWarning("SQL script not found. Tried paths: {Paths}", string.Join(", ", possiblePaths));
                return;
            }

            var sqlScript = await File.ReadAllTextAsync(sqlScriptPath);

            // Execute SQL script
            using var connection = new SqliteConnection(connectionString);
            await connection.OpenAsync();

            // Check if table already exists
            var checkTableQuery = @"
                SELECT COUNT(*) 
                FROM sqlite_master 
                WHERE type='table' AND name='Transformations'";

            using var checkCommand = new SqliteCommand(checkTableQuery, connection);
            var result = await checkCommand.ExecuteScalarAsync();
            var tableExists = result != null && Convert.ToInt64(result) > 0;

            if (tableExists)
            {
                _logger.LogInformation("Transformations table already exists. Skipping creation.");
                return;
            }

            // Execute the SQL script (SQLite doesn't use GO statements)
            using var command = new SqliteCommand(sqlScript, connection);
            await command.ExecuteNonQueryAsync();

            _logger.LogInformation("Database initialized successfully at: {Path}", dbFilePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing database: {Message}", ex.Message);
            throw;
        }
    }
}
