<div align="center">

<img src="https://img.shields.io/badge/-Hera-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Hera" width="280"/>

<h4>Modern Full-Stack Development Template</h4>

**English** | [简体中文](README-CN.md)

<a href="LICENSE">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</a>

</div>

Named after Hera, the Queen of Olympian Gods in Greek mythology, this template serves as the foundation for creating exceptional modern applications with production-ready architecture.

## Table of Contents

- [Why Hera?](#why-hera)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Why Hera?

Hera is a modern full-stack development template that empowers developers to create production-ready applications with unprecedented speed and reliability. Like its namesake, the powerful Queen of Olympian Gods, Hera provides the foundation and nurturing environment for your projects to flourish.

### Core Capabilities

**Production-Ready Stack**

- Modern full-stack architecture with Next.js 16 and FastAPI
- Type-safe development with TypeScript and Python
- Scalable PostgreSQL database integration
- Docker-ready containerized deployment

**Enterprise Authentication**

- Better Auth with OAuth support (GitHub, Google)
- Secure session management
- Database-backed user profiles
- Fine-grained access control

**Developer Experience**

- Beautiful UI with Shadcn/UI components
- Hot reload development environment
- Comprehensive error handling
- Multi-language support (i18n: English/Chinese)

**Flexible & Customizable**

- Easy to customize to fit your specific requirements
- Built on popular, well-supported technologies
- Follow industry standards and proven architectural patterns
- Comprehensive documentation

## Features

### 🌐 Modern Frontend

**User Experience**

- Beautiful UI with Shadcn/UI components
- Responsive design for all devices
- Multi-language support (English/Chinese)
- Custom branding ready

**Developer Experience**

- TypeScript for type safety
- Drizzle ORM for database operations
- Hot reload development
- Zustand for state management

### 🔐 Authentication

**Better Auth Integration**

- OAuth support (GitHub, Google)
- Secure session management
- Database-backed user profiles
- Email verification ready

### 🎨 UI Components

- Complete Shadcn/UI component library
- Radix UI primitives
- Tailwind CSS styling
- Framer Motion animations
- Dark mode support

## Quick Start

### Prerequisites

- Node.js 22+ and npm
- Python 3.11+
- PostgreSQL database (or Neon account)
- Docker (optional, for containerized deployment)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git
cd Hera

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Install backend dependencies
cd ../backend
pip install -r requirements.txt

# 4. Start development
cd ..
make dev
```

### Environment Configuration

**Frontend (.env.local)**

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Backend (.env)**

```env
# Add your backend environment variables here
```

### Database Setup

```bash
# Push database schema
cd frontend
export DATABASE_URL="your-database-url"
npx drizzle-kit push --force
```

## Architecture

Hera follows a modern full-stack architecture with clear separation of concerns:

### Technology Stack

**Frontend**

- Next.js 16 (App Router)
- TypeScript
- Shadcn/UI + Radix UI + Tailwind CSS
- Better Auth for authentication
- Drizzle ORM for database
- next-intl for internationalization

**Backend**

- FastAPI (Python)
- Uvicorn server
- Pydantic for data validation

**Database**

- PostgreSQL
- Drizzle ORM migrations
- User-scoped data isolation

### System Flow

```
Frontend (Next.js)
    ↓ API Routes (Proxy + Auth)
Backend (FastAPI)
    ↓ Business Logic
    ↓ Database
```

### Project Structure

```
Hera/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # App Router pages & API routes
│   │   ├── components/ # React components
│   │   ├── lib/      # Database, auth, utilities
│   │   └── i18n/     # Internationalization
│   └── drizzle.config.ts
│
├── backend/           # Python backend
│   ├── src/
│   │   ├── api/      # FastAPI routers
│   │   ├── services/ # Business logic
│   │   ├── repository/ # Data access layer
│   │   └── utils/    # Utilities
│   └── requirements.txt
│
└── docker/            # Docker configuration
```

## Deployment

### Docker Deployment (Recommended)

```bash
cd Hera
docker compose -f docker/docker-compose.yml up -d
```

### Manual Deployment

**Frontend**

```bash
cd frontend
npm run build
npm start
```

**Backend**

```bash
cd backend
uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

### Service Management

```bash
# View logs
docker compose -f docker/docker-compose.yml logs -f

# Restart services
docker compose -f docker/docker-compose.yml restart

# Stop services
docker compose -f docker/docker-compose.yml down
```

## Contributing

We welcome contributions to Hera! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript/Python best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code quality before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Better Auth](https://www.better-auth.com/) for authentication
- [Shadcn/UI](https://ui.shadcn.com/) for UI components
- [Drizzle ORM](https://orm.drizzle.team/) for database management

---

<div align="center">

Built with ❤️ by the AutoAgents Algorithm Group

</div>