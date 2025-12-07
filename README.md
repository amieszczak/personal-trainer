# PersonalTrainer

A modern, fullstack personal training application with Angular frontend and C# backend.

Check out the latest build [here](https://amieszczak.github.io/personal-trainer/)

## Project Structure

```
personal-trainer/
├── frontend/          # Angular 19 application
│   ├── src/          # Angular source code
│   ├── public/       # Static assets
│   └── ...           # Angular configuration files
├── backend/          # C# .NET backend API
│   └── ...           # Backend source code (to be implemented)
└── README.md         # This file
```

## Technologies

### Frontend
- Angular 19.2
- TypeScript 5.7
- SCSS
- Angular Material

### Backend
- C# / .NET (planned)
- ASP.NET Core Web API (planned)

## Getting Started

### Prerequisites

- **Frontend:**
  - Node.js v22.14.0 or higher
  - npm

- **Backend:**
  - .NET SDK 10.0 or higher

### Quick Start

1. **Clone the repository**
2. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Frontend Development

Navigate to the frontend directory:

```bash
cd frontend
```

#### Installation

```bash
npm install
```

#### Development Server

```bash
npm run start
```

Navigate to `http://localhost:4200/`

#### Build

```bash
npm run build
```

Build artifacts will be stored in the `frontend/dist/` directory.

### Backend Development

Navigate to the backend directory:

```bash
cd backend/PersonalTrainer.API
```

#### First Time Setup

Install .NET SDK 10.0 if not already installed:
```bash
# macOS (Homebrew)
brew install --cask dotnet-sdk

# Verify installation (should show 10.0.x)
dotnet --version
```

#### Restore & Run

```bash
# Restore dependencies
dotnet restore

# Run the API
dotnet run

# Or use watch mode (auto-reload)
dotnet watch run
```

The API will be available at:
- **HTTP**: http://localhost:5000
- **HTTPS**: https://localhost:5001
- **API Documentation**: http://localhost:5000/scalar/v1

For detailed backend documentation, see [backend/README.md](backend/README.md)

## Running Both Frontend & Backend

For full functionality, run both services simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend/PersonalTrainer.API
dotnet watch run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Then access:
- Frontend: http://localhost:4200
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/scalar/v1

## Connecting Frontend to Backend

The backend is configured with CORS to accept requests from `http://localhost:4200`.

To integrate API calls in Angular:

1. **Create an environment configuration** (`frontend/src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

2. **Create a service** (example for trainings):
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private apiUrl = `${environment.apiUrl}/trainings`;

  constructor(private http: HttpClient) {}

  getAllTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  getTrainingById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${id}`);
  }
}
```

3. **Use the service in components**:
```typescript
export class TrainingsComponent implements OnInit {
  trainings: Training[] = [];

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.trainingService.getAllTrainings()
      .subscribe(data => this.trainings = data);
  }
}
```

## API Documentation

When the backend is running, full API documentation is available at:
- **Scalar API Reference**: http://localhost:5000/scalar/v1

This provides a modern, interactive documentation interface for all endpoints with the ability to test them directly.

## License

This project is private and not licensed for public use.