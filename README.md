<div align="center">

<img src="https://img.shields.io/badge/-Hera-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Hera" width="280"/>

<h4>Modern Full-Stack Development Template</h4>

**English** | [简体中文](README-CN.md)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="media/dark_license.svg" />
  <img alt="License MIT" src="media/light_license.svg" />
</picture>

</div>

Named after Hera, the Queen of Olympian Gods in Greek mythology, this template serves as the foundation for creating exceptional modern applications with production-ready architecture.

## Table of Contents
- [Why Hera?](#why-hera)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Why Hera?

Hera is a revolutionary full-stack development template that empowers developers to create modern applications with unprecedented speed and reliability. Like its namesake, the powerful Queen of Olympian Gods, Hera provides the foundation and nurturing environment for your projects to flourish.

### Core Features

#### Modern Technology Stack
- **Next.js 15**: Latest React framework with App Router and Turbopack
- **TypeScript**: Type safety across the entire application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn UI**: High-quality, accessible component library
- **FastAPI**: High-performance Python web framework
- **Pydantic**: Data validation and settings management

#### Developer Experience
- **Zero Configuration**: Get started in minutes with automated setup
- **Hot Reload**: Instant feedback during development
- **Type Safety**: End-to-end TypeScript support
- **Code Quality**: Pre-configured linting and formatting
- **Component Library**: 40+ pre-built UI components ready to use

#### Production Ready
- **Docker Support**: Containerized deployment with multi-stage builds
- **Modular Architecture**: Clean separation of concerns
- **Environment Management**: Flexible configuration for different stages
- **Performance Optimized**: Built-in optimizations for production workloads

#### Rapid Development
- **Interactive Setup**: Automated project configuration
- **Makefile Commands**: Streamlined development workflow
- **Modern Tooling**: Integrated development tools and utilities
- **Scalable Structure**: Organized codebase for team collaboration

### Why Choose Hera?

- **Time to Market**: Reduce development time by up to 70% with pre-configured setup
- **Best Practices**: Follow industry standards and proven architectural patterns
- **Flexibility**: Easily customizable to fit your specific requirements
- **Community**: Built on popular, well-supported technologies
- **Documentation**: Comprehensive guides and examples

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker (optional, for containerized deployment)

### Automated Setup with setup.sh (Recommended)

The easiest way to get Hera running is using our interactive setup script:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/hera.git
cd hera

# 2. Make setup script executable and run it
chmod +x setup.sh
./setup.sh
```

The setup script will guide you through:
- ✅ **Project Configuration**: Customize project name and settings
- ✅ **Port Configuration**: Set frontend (default: 3000) and backend (default: 8000) ports
- ✅ **Dependencies Installation**: Automatically install frontend and backend dependencies
- ✅ **Environment Setup**: Create necessary configuration files

### Start Development
```bash
# After setup.sh completes, start the application
make dev

# Or manually start both services:
# Backend: cd backend && uvicorn API.main:app --reload --port 8000 &
# Frontend: cd frontend && npm run dev
```

### Manual Environment Configuration (If needed)
```bash
# Create environment file (if not done via setup.sh)
cp frontend/.env.example frontend/.env.local

# Set your API configuration
export NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Access Hera
- **Frontend Interface**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/

### First Application
1. Navigate to **http://localhost:3000** in your browser
2. Start building with pre-configured UI components
3. Develop backend APIs using the modular router structure
4. Deploy with Docker when ready for production

### Alternative Quick Start (Without setup.sh)
```bash
# Manual setup if you prefer not to use setup.sh
git clone https://github.com/your-org/hera.git
cd hera

# Install dependencies
cd frontend && npm install && cd ..
cd backend && pip install -r requirements.txt && cd ..

# Start services
make dev
```

**Note**: If you later want to use setup.sh, remember to make it executable first:
```bash
chmod +x setup.sh
./setup.sh
```

## Architecture

### Project Structure
```
hera/
├── frontend/                 # Next.js 15 Application
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   │   └── ui/              # Shadcn UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── package.json         # Frontend dependencies
├── backend/                 # FastAPI Application
│   ├── API/                 # Main API module
│   │   ├── main.py         # FastAPI app configuration
│   │   └── routers/        # Modular route handlers
│   ├── Agent/              # Business logic modules
│   └── requirements.txt    # Backend dependencies
├── docker/                 # Container configuration
│   ├── Dockerfile          # Multi-stage build
│   ├── docker-compose.yml  # Service orchestration
│   └── start.sh           # Application startup script
├── setup.sh               # Interactive project setup
├── Makefile               # Development commands
└── README.md              # Project documentation
```

### Technology Stack

#### Frontend (Next.js 15)
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI + Radix UI
- **State Management**: React Hooks
- **Package Manager**: npm

#### Backend (FastAPI)
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Data Validation**: Pydantic
- **Server**: Uvicorn ASGI server
- **Architecture**: Modular router pattern

#### Development Tools
- **Build Tool**: Turbopack (Next.js)
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier (via ESLint)
- **Package Manager**: npm + pip

#### Deployment
- **Containerization**: Docker + Docker Compose
- **Process Management**: Multi-service orchestration
- **Environment**: Configurable for dev/staging/production

### API Architecture

The backend uses a modular router pattern for clean code organization:

```python
# Modular router structure
backend/API/routers/
├── __init__.py
└── [future routers will be added here]

# Each router follows this pattern:
from fastapi import APIRouter
router = APIRouter(prefix="/api/module", tags=["module"])
```

## Deployment

### Docker Deployment (Recommended)

#### Production Deployment with Docker Compose
```bash
# 1. Create deployment directory
mkdir -p /path/to/deployment/hera
cd hera

# 2. Download project package
wget -P /root/hera https://your-cdn.com/Hera.zip
unzip Hera.zip -x "__MACOSX/*"

# 3. Enter project directory
cd Hera

# 4. Start services
docker compose -f docker/docker-compose.yml up -d

# 5. View application logs
docker compose -f docker/docker-compose.yml logs -f app
```

#### Environment Variables
```bash
# Optional - Set in docker-compose.yml or .env file
FRONTEND_PORT=3000
BACKEND_PORT=8000
NODE_ENV=production
```

### Service Management

#### View Service Status
```bash
# Check running status
docker compose -f docker/docker-compose.yml ps

# View real-time logs
docker compose -f docker/docker-compose.yml logs -f

# Restart services
docker compose -f docker/docker-compose.yml restart
```

#### Stop and Cleanup
```bash
# Stop all services
docker compose -f docker/docker-compose.yml down

# Complete cleanup (including volumes)
docker compose -f docker/docker-compose.yml down -v

# Clean unused images
docker image prune -f
```

### Production Configuration

#### Security Checklist
- [ ] Configure HTTPS/SSL certificates
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Configure proper logging

#### Performance Optimization
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Monitor resource usage
- [ ] Implement health checks

### Monitoring & Maintenance
- **Health Checks**: Access via `/` endpoint
- **Logs**: Use `docker compose logs -f` for real-time monitoring
- **Metrics**: Monitor API performance and usage
- **Updates**: Regular dependency updates and security patches

### Troubleshooting

#### Clean Old Containers and Images
```bash
# Stop and remove old containers
docker stop hera && docker rm hera

# Remove old images
docker rmi hera-app

# Clean all unused containers and images
docker system prune -f
```

#### Common Issue Resolution
```bash
# If port conflicts occur
docker compose -f docker/docker-compose.yml down
# Modify port mappings in docker-compose.yml

# If container startup fails
docker compose -f docker/docker-compose.yml logs app

# Rebuild images
docker compose -f docker/docker-compose.yml build --no-cache

# If permission issues (setup.sh)
chmod +x setup.sh
./setup.sh
```

## Development

### Development Commands
```bash
# Install all dependencies
make install

# Start development environment
make dev

# Start production environment
make prod

# View available commands
make help
```

### Project Configuration

The `setup.sh` script provides interactive configuration for:

1. **Project Settings**: Customize project name and metadata
2. **Port Configuration**: Set custom ports for frontend and backend
3. **Dependencies**: Automatic installation of all required packages
4. **Environment**: Create and configure environment files

### Adding New Features

#### Frontend Components
```bash
# Add new UI component
npx shadcn-ui@latest add [component-name]

# Create custom component
touch frontend/components/MyComponent.tsx
```

#### Backend Routes
```bash
# Create new router
touch backend/API/routers/my_router.py

# Register in main.py
# app.include_router(my_router)
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for Next.js and TypeScript
- **Prettier**: Code formatting via ESLint integration
- **Hot Reload**: Instant feedback during development

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Named after Hera, the Queen of Olympian Gods, this template embodies power, reliability, and the nurturing foundation needed to create exceptional applications.