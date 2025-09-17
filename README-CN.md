<div align="center">

<img src="https://img.shields.io/badge/-Hera-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Hera" width="280"/>

<h4>现代全栈开发模板</h4>

[English](README.md) | **简体中文**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="media/dark_license.svg" />
  <img alt="License MIT" src="media/light_license.svg" />
</picture>

</div>

以古希腊奥林匹斯山万神之母赫拉（Hera）命名，此模板如同女神般为现代应用的诞生提供强大基础和孕育环境，助力开发者创造出卓越的生产级应用。

## 目录
- [为什么选择 Hera？](#为什么选择-hera)
- [快速开始](#快速开始)
- [架构设计](#架构设计)
- [部署指南](#部署指南)
- [开发指南](#开发指南)
- [贡献指南](#贡献指南)
- [开源协议](#开源协议)

## 为什么选择 Hera？

Hera 是一个革命性的全栈开发模板，让开发者能够以前所未有的速度和可靠性创建现代应用程序。如同其命名源泉——强大的奥林匹斯山万神之母，Hera 为您的项目提供坚实的基础和孕育环境。

### 核心特性

#### 现代技术栈
- **Next.js 15**: 最新 React 框架，支持 App Router 和 Turbopack
- **TypeScript**: 全应用类型安全保障
- **Tailwind CSS**: 实用优先的 CSS 框架，快速 UI 开发
- **Shadcn UI**: 高质量、可访问的组件库
- **FastAPI**: 高性能 Python Web 框架
- **Pydantic**: 数据验证和设置管理

#### 开发体验
- **零配置**: 自动化设置，分钟级启动
- **热重载**: 开发期间即时反馈
- **类型安全**: 端到端 TypeScript 支持
- **代码质量**: 预配置的代码检查和格式化
- **组件库**: 40+ 预构建 UI 组件开箱即用

#### 生产就绪
- **Docker 支持**: 容器化部署，多阶段构建
- **模块化架构**: 清晰的关注点分离
- **环境管理**: 灵活的多环境配置
- **性能优化**: 内置生产工作负载优化

#### 快速开发
- **交互式设置**: 自动化项目配置
- **Makefile 命令**: 简化的开发工作流
- **现代工具**: 集成开发工具和实用程序
- **可扩展结构**: 组织良好的代码库，便于团队协作

### 选择 Hera 的理由

- **快速上市**: 预配置设置减少高达 70% 的开发时间
- **最佳实践**: 遵循行业标准和经过验证的架构模式
- **灵活性**: 轻松定制以适应您的特定需求
- **社区支持**: 基于流行且得到良好支持的技术构建
- **完整文档**: 全面的指南和示例

## 快速开始

### 环境要求
- Node.js 18+ 和 npm
- Python 3.11+
- Docker（可选，用于容器化部署）

### 使用 setup.sh 自动化设置（推荐）

使用我们的交互式设置脚本是启动 Hera 的最简单方法：

```bash
# 1. 克隆仓库
git clone https://github.com/your-org/hera.git
cd hera

# 2. 使设置脚本可执行并运行
chmod +x setup.sh
./setup.sh
```

设置脚本将引导您完成：
- ✅ **项目配置**: 自定义项目名称和设置
- ✅ **端口配置**: 设置前端（默认: 3000）和后端（默认: 8000）端口
- ✅ **依赖安装**: 自动安装前端和后端依赖
- ✅ **环境设置**: 创建必要的配置文件

### 开始开发
```bash
# setup.sh 完成后，启动应用程序
make dev

# 或手动启动两个服务：
# 后端: cd backend && uvicorn API.main:app --reload --port 8000 &
# 前端: cd frontend && npm run dev
```

### 手动环境配置（如需要）
```bash
# 创建环境文件（如果未通过 setup.sh 完成）
cp frontend/.env.example frontend/.env.local

# 设置 API 配置
export NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 访问 Hera
- **前端界面**: http://localhost:3000
- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/

### 第一个应用
1. 在浏览器中访问 **http://localhost:3000**
2. 开始使用预配置的 UI 组件构建
3. 使用模块化路由结构开发后端 API
4. 准备好生产时使用 Docker 部署

### 替代快速开始（不使用 setup.sh）
```bash
# 如果您不想使用 setup.sh 的手动设置
git clone https://github.com/your-org/hera.git
cd hera

# 安装依赖
cd frontend && npm install && cd ..
cd backend && pip install -r requirements.txt && cd ..

# 启动服务
make dev
```

**注意**: 如果您以后想使用 setup.sh，记得先使其可执行：
```bash
chmod +x setup.sh
./setup.sh
```

## 架构设计

### 项目结构
```
hera/
├── frontend/                 # Next.js 15 应用程序
│   ├── app/                 # App Router 页面
│   ├── components/          # React 组件
│   │   └── ui/              # Shadcn UI 组件
│   ├── hooks/               # 自定义 React 钩子
│   ├── lib/                 # 工具函数
│   └── package.json         # 前端依赖
├── backend/                 # FastAPI 应用程序
│   ├── API/                 # 主 API 模块
│   │   ├── main.py         # FastAPI 应用配置
│   │   └── routers/        # 模块化路由处理器
│   ├── Agent/              # 业务逻辑模块
│   └── requirements.txt    # 后端依赖
├── docker/                 # 容器配置
│   ├── Dockerfile          # 多阶段构建
│   ├── docker-compose.yml  # 服务编排
│   └── start.sh           # 应用启动脚本
├── setup.sh               # 交互式项目设置
├── Makefile               # 开发命令
└── README.md              # 项目文档
```

### 技术栈

#### 前端（Next.js 15）
- **框架**: Next.js 与 App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件**: Shadcn UI + Radix UI
- **状态管理**: React Hooks
- **包管理器**: npm

#### 后端（FastAPI）
- **框架**: FastAPI
- **语言**: Python 3.11+
- **数据验证**: Pydantic
- **服务器**: Uvicorn ASGI 服务器
- **架构**: 模块化路由模式

#### 开发工具
- **构建工具**: Turbopack（Next.js）
- **代码检查**: ESLint + TypeScript ESLint
- **代码格式化**: Prettier（通过 ESLint）
- **包管理器**: npm + pip

#### 部署
- **容器化**: Docker + Docker Compose
- **进程管理**: 多服务编排
- **环境**: 可配置开发/测试/生产环境

### API 架构

后端使用模块化路由模式实现清晰的代码组织：

```python
# 模块化路由结构
backend/API/routers/
├── __init__.py
└── [未来的路由将添加在这里]

# 每个路由遵循此模式：
from fastapi import APIRouter
router = APIRouter(prefix="/api/module", tags=["module"])
```

## 部署指南

### Docker 部署（推荐）

#### 使用 Docker Compose 生产部署
```bash
# 1. 创建部署目录
mkdir -p /path/to/deployment/hera
cd hera

# 2. 下载项目包
wget -P /root/hera https://your-cdn.com/Hera.zip
unzip Hera.zip -x "__MACOSX/*"

# 3. 进入项目目录
cd Hera

# 4. 启动服务
docker compose -f docker/docker-compose.yml up -d

# 5. 查看应用日志
docker compose -f docker/docker-compose.yml logs -f app
```

#### 环境变量
```bash
# 可选 - 在 docker-compose.yml 或 .env 文件中设置
FRONTEND_PORT=3000
BACKEND_PORT=8000
NODE_ENV=production
```

### 服务管理

#### 查看服务状态
```bash
# 检查运行状态
docker compose -f docker/docker-compose.yml ps

# 查看实时日志
docker compose -f docker/docker-compose.yml logs -f

# 重启服务
docker compose -f docker/docker-compose.yml restart
```

#### 停止和清理
```bash
# 停止所有服务
docker compose -f docker/docker-compose.yml down

# 完全清理（包括卷）
docker compose -f docker/docker-compose.yml down -v

# 清理未使用的镜像
docker image prune -f
```

### 生产配置

#### 安全检查清单
- [ ] 配置 HTTPS/SSL 证书
- [ ] 设置安全的 CORS 源
- [ ] 使用环境变量管理机密信息
- [ ] 启用速率限制
- [ ] 配置适当的日志记录

#### 性能优化
- [ ] 启用 gzip 压缩
- [ ] 为静态资源配置 CDN
- [ ] 监控资源使用情况
- [ ] 实施健康检查

### 监控和维护
- **健康检查**: 通过 `/` 端点访问
- **日志**: 使用 `docker compose logs -f` 进行实时监控
- **指标**: 监控 API 性能和使用情况
- **更新**: 定期进行依赖更新和安全补丁

### 故障排除

#### 清理旧容器和镜像
```bash
# 停止并删除旧容器
docker stop hera && docker rm hera

# 删除旧镜像
docker rmi hera-app

# 清理所有未使用的容器和镜像
docker system prune -f
```

#### 常见问题解决
```bash
# 如果端口冲突
docker compose -f docker/docker-compose.yml down
# 修改 docker-compose.yml 中的端口映射

# 如果容器启动失败
docker compose -f docker/docker-compose.yml logs app

# 重新构建镜像
docker compose -f docker/docker-compose.yml build --no-cache

# 如果权限问题（setup.sh）
chmod +x setup.sh
./setup.sh
```

## 开发指南

### 开发命令
```bash
# 安装所有依赖
make install

# 启动开发环境
make dev

# 启动生产环境
make prod

# 查看可用命令
make help
```

### 项目配置

`setup.sh` 脚本提供交互式配置：

1. **项目设置**: 自定义项目名称和元数据
2. **端口配置**: 为前端和后端设置自定义端口
3. **依赖管理**: 自动安装所有必需的包
4. **环境配置**: 创建和配置环境文件

### 添加新功能

#### 前端组件
```bash
# 添加新的 UI 组件
npx shadcn-ui@latest add [component-name]

# 创建自定义组件
touch frontend/components/MyComponent.tsx
```

#### 后端路由
```bash
# 创建新路由
touch backend/API/routers/my_router.py

# 在 main.py 中注册
# app.include_router(my_router)
```

### 代码质量

- **TypeScript**: 启用严格类型检查
- **ESLint**: 为 Next.js 和 TypeScript 配置
- **Prettier**: 通过 ESLint 集成进行代码格式化
- **热重载**: 开发期间即时反馈

## 贡献指南

1. Fork 此仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

### 开发指南
- 遵循 TypeScript 最佳实践
- 编写清晰的提交信息
- 为新功能添加测试
- 根据需要更新文档

## 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

以古希腊奥林匹斯山万神之母赫拉命名，此模板体现了力量、可靠性以及创造卓越应用所需的孕育基础。
