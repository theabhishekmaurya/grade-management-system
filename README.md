# OpenHearing Grade Management System

A full-stack mono-repo demonstration featuring Next.js frontend, Nest.js backend, and PostgreSQL database, all containerized with Docker.

## 🏗️ Architecture

This project showcases a modern full-stack architecture with:

- **Frontend**: Next.js 15.4.1 with React 19.1.0, TypeScript, and Tailwind CSS 4
- **Backend**: Nest.js 10 with TypeORM and PostgreSQL integration
- **Database**: PostgreSQL 15 running in Docker container with health checks
- **DevOps**: Docker Compose for orchestrated deployment with custom networking
- **Mono-repo**: NPM workspace-based structure for unified development

## 📁 Project Structure

```
openhearing-gms/
├── docker-compose.yml          # Docker orchestration with health checks
├── package.json               # Root workspace configuration
├── .prettierrc                # Code formatting rules
├── .eslintrc.json            # Linting configuration
├── .gitignore                # Comprehensive gitignore
└── apps/
    ├── frontend/              # Next.js application
    │   ├── src/
    │   │   ├── app/           # Next.js 15 app router
    │   │   │   ├── page.tsx   # Main landing page
    │   │   │   ├── layout.tsx # Root layout with fonts
    │   │   │   └── globals.css # Tailwind CSS configuration
    │   │   ├── components/    # React components
    │   │   │   └── dashboard/ # Dashboard components
    │   │   │       └── HealthCard.tsx # System health display
    │   │   └── lib/           # Utilities and API client
    │   │       └── api.ts     # Axios-based API client
    │   ├── Dockerfile         # Development-focused container
    │   ├── next.config.ts     # Next.js configuration with Turbopack
    │   ├── postcss.config.mjs # PostCSS configuration
    │   └── package.json       # Frontend dependencies
    └── backend/               # Nest.js application
        ├── src/
        │   ├── config/        # Database configuration
        │   │   └── database.config.ts # TypeORM PostgreSQL config
        │   ├── common/        # Shared entities and utilities
        │   │   └── base.entity.ts # Base entity with common fields
        │   ├── modules/       # Feature modules (placeholder)
        │   ├── app.controller.ts # Health check endpoint
        │   ├── app.service.ts    # Application services
        │   ├── app.module.ts     # Main application module
        │   └── main.ts           # Application entry point
        ├── Dockerfile            # Backend container configuration
        ├── nest-cli.json        # Nest CLI configuration
        └── package.json         # Backend dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- Git

### Option 1: Docker Deployment (Recommended)

1. **Clone and navigate to the project:**

   ```bash
   git clone <repository-url>
   cd openhearing-gms
   ```

2. **Start the entire stack:**

   ```bash
   npm run dev
   ```

3. **Access the applications:**
   - Frontend: http://localhost:3003
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health
   - PostgreSQL: localhost:5432

### Option 2: Local Development

1. **Install all dependencies:**

   ```bash
   npm run workspace:install
   ```

2. **Start development servers together with Docker:**

   ```bash
   # Terminal 1: Start frontend and backend
   npm run dev
   ```

3. **Start development servers individually:**

   ```bash
   # Terminal 1: Start backend
   npm run dev:backend

   # Terminal 2: Start frontend
   npm run dev:frontend
   ```

4. **Start PostgreSQL separately:**
   ```bash
   docker run --name postgres-dev -e POSTGRES_DB=grade_management -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15-alpine
   ```

## 📜 Available Scripts

### Root Level Commands

| Command                     | Description                                  |
| --------------------------- | -------------------------------------------- |
| `npm run workspace:install` | Install all dependencies for both apps       |
| `npm run dev`               | Start entire stack with Docker (recommended) |
| `npm run dev:no-build`      | Start Docker containers without rebuilding   |
| `npm run workspace:build`   | Build both applications for production       |
| `npm run workspace:start`   | Start both applications in production mode   |
| `npm run dev:frontend`      | Start Next.js dev server (port 3003)         |
| `npm run dev:backend`       | Start Nest.js dev server (port 3001)         |
| `npm run lint`              | Run ESLint on all workspaces                 |
| `npm run format`            | Format code with Prettier                    |
| `npm run docker:up`         | Start Docker containers                      |
| `npm run docker:down`       | Stop Docker containers                       |
| `npm run docker:restart`    | Restart all Docker containers                |

### Docker Utility Commands

| Command                          | Description                             |
| -------------------------------- | --------------------------------------- |
| `npm run docker:build`           | Build Docker images                     |
| `npm run docker:debug`           | Start containers with verbose logging   |
| `npm run docker:clean`           | Clean Docker system and remove cache    |
| `npm run docker:list-containers` | List running containers with status     |
| `npm run docker:ping-postgres`   | Test backend to PostgreSQL connectivity |

## 🔧 Configuration

### Environment Variables

**Backend (Docker environment):**

```env
NODE_ENV=development
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=grade_management
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DB_LOGGING=error
```

**Frontend (Docker environment):**

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
FAST_REFRESH=true
WATCHPACK_POLLING=true
```

### Database Configuration

The application uses PostgreSQL with TypeORM featuring:

- **Auto-synchronization** in development mode
- **Health checks** with retry logic (10 attempts, 3s delay)
- **Connection pooling** with timeout configuration
- **Comprehensive logging** (configurable via DB_LOGGING)
- **SSL support** for production environments
- **Entity auto-loading** for seamless development

## 🎯 API Endpoints

### Available Endpoints

| Method | Endpoint  | Description                                     |
| ------ | --------- | ----------------------------------------------- |
| GET    | `/health` | System health status with database connectivity |

### Example API Response

```json
{
  "status": "OK",
  "message": "Service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected"
}
```

## 🛠️ Development Features

### Code Quality & Standards

- **TypeScript 5** throughout the entire stack
- **ESLint** with TypeScript rules and Prettier integration
- **Prettier** for consistent code formatting
- **Comprehensive JSDoc commenting** for all modules
- **Strict type safety** with shared interfaces

### Frontend Features

- **Next.js 15** with App Router and Turbopack support
- **React 19** with hooks for state management
- **Tailwind CSS 4** with PostCSS integration
- **Geist fonts** for modern typography
- **Responsive design** with mobile-first approach
- **Error handling** with retry functionality
- **Loading states** and interactive feedback
- **Real-time health monitoring** with HealthCard component

### Backend Features

- **Nest.js 10** with dependency injection
- **TypeORM** with PostgreSQL adapter
- **Base entity** with common fields (id, timestamps, audit fields)
- **CORS configuration** for frontend communication
- **Environment-based configuration** with fallbacks
- **Health check endpoints** for monitoring
- **Comprehensive error handling** and logging

## 🐳 Docker Configuration

### Services Architecture

1. **PostgreSQL Database (`postgres`)**
   - Image: `postgres:15-alpine`
   - Port: `5432`
   - Health checks with `pg_isready`
   - Persistent volume: `postgres_data`
   - Network aliases: `postgres`, `db`

2. **Backend (`backend`)**
   - Built from `./apps/backend/Dockerfile`
   - Port: `3001`
   - Depends on PostgreSQL health check
   - Volume mounts for hot reloading
   - Custom network: `openhearing-network`

3. **Frontend (`frontend`)**
   - Built from `./apps/frontend/Dockerfile`
   - Port: `3003`
   - Turbopack enabled for fast refresh
   - Volume mounts for development
   - Depends on backend service

### Docker Network

- **Custom bridge network**: `openhearing-network`
- **Service discovery** via container names
- **Inter-service communication** through network aliases

### Docker Commands

```bash
# Start all services with rebuild
docker-compose up --build

# View service logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Reset database (remove volumes)
docker-compose down -v

# Debug networking
npm run docker:network-inspect
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Frontend runs on port **3003** (not 3000)
   - Backend runs on port **3001**
   - PostgreSQL runs on port **5432**

2. **Database connection issues:**
   - Check container health: `docker ps`
   - Verify network connectivity: `npm run docker:ping-postgres`
   - Review logs: `docker-compose logs postgres`

3. **Build failures:**
   - Clear Docker cache: `npm run docker:clean`
   - Reset Docker buildx: `npm run docker:reset-buildx`
   - Fix permissions: `npm run docker:fix-permissions` (macOS)

4. **Hot reloading not working:**
   - Ensure `WATCHPACK_POLLING=true` is set
   - Check volume mounts in docker-compose.yml
   - Restart containers: `npm run docker:restart`

### Health Check

The system includes a comprehensive health check that verifies:

- Backend server status
- Database connectivity
- Service response time
- Real-time status updates via HealthCard component

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test with `npm run dev`
4. Ensure code quality: `npm run lint && npm run format`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 Technology Stack

| Category        | Technology   | Version | Notes                  |
| --------------- | ------------ | ------- | ---------------------- |
| Frontend        | Next.js      | 15.4.1  | App Router + Turbopack |
| Frontend        | React        | 19.1.0  | Latest with hooks      |
| Frontend        | TypeScript   | 5.x     | Strict mode enabled    |
| Frontend        | Tailwind CSS | 4.x     | PostCSS integration    |
| Frontend        | Axios        | 1.10.0  | HTTP client            |
| Backend         | Nest.js      | 10.x    | Latest stable          |
| Backend         | TypeORM      | 0.3.25  | PostgreSQL adapter     |
| Database        | PostgreSQL   | 15      | Alpine Linux image     |
| Container       | Docker       | Latest  | Multi-stage builds     |
| Package Manager | npm          | 9+      | Workspace support      |

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for OpenHearing as a full-stack demonstration
- Showcases modern mono-repo architecture patterns
- Implements industry best practices for TypeScript development
- Features containerized development environment with Docker
- Demonstrates real-world health monitoring and error handling
