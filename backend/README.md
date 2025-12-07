# Backend - Personal Trainer API

C# .NET 8 Web API for managing trainings, clients, bookings, and transformations.

## Prerequisites

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)

Install on macOS: `brew install --cask dotnet-sdk`

## Getting Started

```bash
cd backend/PersonalTrainer.API
dotnet restore
dotnet watch run
```

API: `http://localhost:5000`  
Docs: `http://localhost:5000/scalar/v1`

## Project Structure

```
PersonalTrainer.API/
├── Controllers/    # API endpoints
├── Models/         # Domain models
├── DTOs/           # Data Transfer Objects
└── Program.cs      # Configuration & entry point
```

## API Endpoints

### Trainings
- `GET /api/trainings` - Get all trainings
- `GET /api/trainings/{id}` - Get by ID
- `POST /api/trainings` - Create
- `PUT /api/trainings/{id}` - Update
- `DELETE /api/trainings/{id}` - Delete

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/{id}` - Get by ID
- `POST /api/clients` - Create
- `PUT /api/clients/{id}` - Update
- `DELETE /api/clients/{id}` - Delete

### Bookings
- `GET /api/bookings` - Get all
- `GET /api/bookings/upcoming` - Get upcoming
- `POST /api/bookings` - Create
- `PUT /api/bookings/{id}/status` - Update status
- `DELETE /api/bookings/{id}` - Cancel

### Transformations
- `GET /api/transformations` - Get all
- `GET /api/transformations/featured` - Get featured
- `POST /api/transformations` - Create
- `PUT /api/transformations/{id}` - Update
- `DELETE /api/transformations/{id}` - Delete

## Current Implementation

- **Storage**: In-memory (replace with database for production)
- **Sample data**: 4 trainings, 2 clients, 2 bookings, 3 transformations
- **CORS**: Configured for `http://localhost:4200`

## Next Steps

- Add Entity Framework Core + SQL Server
- Implement JWT authentication
- Add FluentValidation
- Create unit tests

