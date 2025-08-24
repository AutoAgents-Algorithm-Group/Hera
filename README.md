# ⭐ Hera - 现代全栈开发模板

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
</div>

<br>

<div align="center">
  <p><strong>以古希腊万神之母赫拉命名的现代全栈开发模板</strong></p>
  <p>如赫拉孕育诸神般，此模板能塑造出无数优秀的项目 🏛️</p>
  <p>开箱即用的前后端架构，专为快速项目孵化而设计 ✨</p>
</div>

---

## 📑 目录

- [⭐ Hera - 现代全栈开发模板](#-hera---现代全栈开发模板)
  - [📑 目录](#-目录)
  - [🎨 模板特点](#-模板特点)
  - [🚀 快速开始](#-快速开始)

---

## 🎨 模板特点

> "如同赫拉（Hera）是奥林匹斯山的万神之母，此模板亦是现代应用的孕育之源。"  
> Hera 不仅是女神的名字，更代表着**创造力**、**孵化能力**和**生命力**的源泉。

**核心优势**
- **🎯 万物之源** - 如同赫拉孕育诸神，这个模板能孵化出无数优秀项目
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
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git 

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
docker compose build
docker compose up -d
```