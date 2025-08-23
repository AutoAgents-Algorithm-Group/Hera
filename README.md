# 🚀 Fullstack FrankStyle - 现代全栈开发模板

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
</div>

<br>

<div align="center">
  <p><strong>一个现代化的全栈项目开发模板</strong></p>
  <p>开箱即用的前后端架构，专为快速项目启动而设计 🎯</p>
</div>

---

## 📑 目录

- [🚀 Fullstack FrankStyle - 现代全栈开发模板](#-fullstack-frankstyle---现代全栈开发模板)
  - [📑 目录](#-目录)
  - [🎨 模板特点](#-模板特点)
  - [🚀 快速开始](#-快速开始)

---

## 🎨 模板特点

**核心优势**
- **🎯 开箱即用** - 无需从零搭建，clone即可开始开发
- **📐 现代技术栈** - 基于最新的前后端技术框架
- **🖼️ 完整配置** - 包含开发、测试、部署的完整配置
- **🌐 Docker支持** - 容器化开发和部署，环境一致性保障
- **⚡ 开发效率** - 热重载、类型安全、代码提示完整支持
- **🎨 UI组件库** - 预集成Shadcn UI高质量组件

**技术选型**
- **前端**: Next.js 15 + TypeScript + Tailwind CSS + Shadcn UI
- **后端**: FastAPI + Python + Pydantic
- **部署**: Docker + Docker Compose + Makefile

---

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/Hehua-Fan/fullstack-frankstyle.git 

# 安装依赖
make install

# 开发环境
make dev

# 传输到服务器
rsync -avz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='.DS_Store'\
  --exclude='__pycache__' \
  ./ ubuntu@your_server_ip:your_path

# 生产环境
cd docker
docker-compose up --build
```