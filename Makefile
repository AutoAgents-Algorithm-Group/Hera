# Fullstack FrankStyle Makefile

.PHONY: dev prod prod-docker

# Default target shows available commands
help:
	@echo "Available commands:"
	@echo "  make dev         - Start development environment"
	@echo "  make prod        - Start production environment with Docker"
	@echo "  make prod-docker - Start production services inside Docker container"

# Development environment
dev:
	@echo "🚀 Starting development environment..."
	@echo "📱 Frontend will be available at http://localhost:3000"
	@echo "🔧 Backend will be available at http://localhost:8000"
	@echo "📚 API Documentation at http://localhost:8000/docs"
	@echo ""
	@echo "Press Ctrl+C to stop both services"
	@trap 'kill %1 %2' INT; \
	cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload & \
	cd frontend && npm run dev & \
	wait

# Production environment
prod:
	@echo "🚀 Starting production services inside container..."
	@echo "Starting backend service..."
	cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 &
	@echo "Starting frontend service..."
	cd frontend && npm start &
	@echo "✅ Production services started inside container!"
	@echo "📱 Application: http://localhost:3000"
	@echo "🔧 API: http://localhost:8000"
	wait