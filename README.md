<div align="center">

<img src="https://img.shields.io/badge/-Hera-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Hera" width="280"/>

<h4>Modern Full-Stack Development Template</h4>

English | [简体中文](README-CN.md)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="media/dark_license.svg" />
  <img alt="License MIT" src="media/light_license.svg" />
</picture>

</div>

Named after Hera, the Queen of Olympian Gods in Greek mythology, this template serves as the foundation for creating exceptional modern applications with production-ready architecture.

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Why Hera?](#why-hera)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Why Hera?

Hera is a revolutionary full-stack development template that empowers developers to create modern applications with unprecedented speed and reliability. Like its namesake, the powerful Queen of Olympian Gods, Hera provides the foundation and nurturing environment for your projects to flourish.

- **Time to Market**: Reduce development time by up to 70% with pre-configured setup
- **Best Practices**: Follow industry standards and proven architectural patterns
- **Flexibility**: Easily customizable to fit your specific requirements
- **Community**: Built on popular, well-supported technologies
- **Documentation**: Comprehensive guides and examples

## Quick Start

**Prerequisites**
- Node.js 18+ and npm
- Python 3.11+
- Docker (optional, for containerized deployment)

**Get Started**
```bash
# 1. Clone the repository
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git
cd Hera

# 2. Make setup script executable and run it
chmod +x setup.sh
./setup.sh

# 3. Start development
make dev
```

## Deployment
**Docker**
```bash
cd Hera
docker compose -f docker/docker-compose.yml up -d
```

**Troubleshooting**
```bash
# View application logs
docker compose -f docker/docker-compose.yml logs -f app

# Stop and remove old containers
docker stop hera && docker rm hera
docker rmi hera-app
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.