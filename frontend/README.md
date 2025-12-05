# Frontend - Personal Trainer

Angular 19 frontend application for the Personal Trainer platform.

## Technologies

- Angular 19.2
- TypeScript 5.7
- SCSS
- Angular Material
- RxJS

## Getting Started

### Prerequisites

- Node.js v22.14.0 or higher
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run start
```

The application will be available at `http://localhost:4200/`

The app will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm run test
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # Business logic and API services
│   │   └── ...
│   ├── styles/            # Global styles and SCSS variables
│   └── ...
├── public/                # Static assets (images, icons)
└── ...                    # Configuration files
```

## Components

- **Header** - Navigation and branding
- **Hero** - Landing section
- **About Me** - Trainer information
- **Achievements** - Trainer accomplishments
- **Transformations** - Client success stories
- **Gallery** - Photo gallery
- **Contact** - Contact form and information
- **Training Booking Modal** - Modal for booking training sessions
- **Footer** - Footer with links and info

## Services

- **ScrollService** - Smooth scrolling functionality

## Future Integration

This frontend will be integrated with the C# backend API for:
- User authentication
- Training session booking
- Client management
- Dynamic content management

