# Backend - Personal Trainer API

This directory will contain the C# .NET backend API for the Personal Trainer application.

## Planned Stack

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server / PostgreSQL
- JWT Authentication

## Getting Started

To initialize the backend project, run:

```bash
dotnet new webapi -n PersonalTrainer.API
```

## Structure (Planned)

```
backend/
├── PersonalTrainer.API/          # Web API project
├── PersonalTrainer.Core/         # Domain models and interfaces
├── PersonalTrainer.Infrastructure/ # Data access and external services
└── PersonalTrainer.Tests/        # Unit and integration tests
```

## API Endpoints (Planned)

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh

### Trainings
- GET /api/trainings
- POST /api/trainings
- GET /api/trainings/{id}
- PUT /api/trainings/{id}
- DELETE /api/trainings/{id}

### Clients
- GET /api/clients
- POST /api/clients
- GET /api/clients/{id}
- PUT /api/clients/{id}

### Bookings
- GET /api/bookings
- POST /api/bookings
- GET /api/bookings/{id}
- PUT /api/bookings/{id}
- DELETE /api/bookings/{id}

## Development

*(Instructions will be added once the project is initialized)*

