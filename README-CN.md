<div align="center">

<img src="https://img.shields.io/badge/-Hera-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Hera" width="280"/>

<h4>现代全栈开发模板</h4>

[English](README.md) | **简体中文**

<a href="LICENSE">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</a>

</div>

以希腊神话中的奥林匹斯众神之后赫拉命名，这个模板为创建出色的现代应用程序提供了生产就绪架构的基础。

## 目录

- [为什么选择 Hera？](#为什么选择-hera)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [架构](#架构)
- [部署](#部署)
- [贡献](#贡献)
- [许可证](#许可证)

## 为什么选择 Hera？

Hera 是一个现代化的全栈开发模板，让开发者能够以前所未有的速度和可靠性创建生产就绪的应用程序。就像它的同名神话人物——强大的奥林匹斯众神之后一样，Hera 为您的项目提供了蓬勃发展的基础和培育环境。

### 核心能力

**生产就绪技术栈**

- 基于 Next.js 16 和 FastAPI 的现代全栈架构
- TypeScript 和 Python 的类型安全开发
- 可扩展的 PostgreSQL 数据库集成
- Docker 容器化部署就绪

**企业级身份认证**

- Better Auth 支持 OAuth（GitHub、Google）
- 安全的会话管理
- 数据库支持的用户配置文件
- 细粒度访问控制

**开发者体验**

- Shadcn/UI 组件的精美界面
- 热重载开发环境
- 全面的错误处理
- 多语言支持（国际化：中文/英文）

**灵活可定制**

- 易于定制以满足您的特定需求
- 基于流行的、得到良好支持的技术构建
- 遵循行业标准和经过验证的架构模式
- 全面的文档

## 功能特性

### 🌐 现代化前端

**用户体验**

- Shadcn/UI 组件的精美界面
- 适配所有设备的响应式设计
- 多语言支持（中文/英文）
- 可自定义品牌

**开发者体验**

- TypeScript 类型安全
- Drizzle ORM 数据库操作
- 热重载开发
- Zustand 状态管理

### 🔐 身份认证

**Better Auth 集成**

- OAuth 支持（GitHub、Google）
- 安全的会话管理
- 数据库支持的用户配置文件
- 邮箱验证就绪

### 🎨 UI 组件

- 完整的 Shadcn/UI 组件库
- Radix UI 原语
- Tailwind CSS 样式
- Framer Motion 动画
- 暗色模式支持

## 快速开始

### 前置要求

- Node.js 18+ 和 npm
- Python 3.11+
- PostgreSQL 数据库（或 Neon 账号）
- Docker（可选，用于容器化部署）

### 安装

```bash
# 1. 克隆仓库
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git
cd Hera

# 2. 安装前端依赖
cd frontend
npm install

# 3. 安装后端依赖
cd ../backend
pip install -r requirements.txt

# 4. 启动开发环境
cd ..
make dev
```

### 环境配置

**前端 (.env.local)**

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**后端 (.env)**

```env
# 在此添加您的后端环境变量
```

### 数据库设置

```bash
# 推送数据库架构
cd frontend
export DATABASE_URL="your-database-url"
npx drizzle-kit push --force
```

## 架构

Hera 遵循现代全栈架构，具有清晰的关注点分离：

### 技术栈

**前端**

- Next.js 16（App Router）
- TypeScript
- Shadcn/UI + Radix UI + Tailwind CSS
- Better Auth 身份认证
- Drizzle ORM 数据库
- next-intl 国际化

**后端**

- FastAPI（Python）
- Uvicorn 服务器
- Pydantic 数据验证

**数据库**

- PostgreSQL
- Drizzle ORM 迁移
- 用户范围数据隔离

### 系统流程

```
前端 (Next.js)
    ↓ API 路由（代理 + 认证）
后端 (FastAPI)
    ↓ 业务逻辑
    ↓ 数据库
```

### 项目结构

```
Hera/
├── frontend/          # Next.js 应用
│   ├── src/
│   │   ├── app/      # App Router 页面和 API 路由
│   │   ├── components/ # React 组件
│   │   ├── lib/      # 数据库、认证、工具
│   │   └── i18n/     # 国际化
│   └── drizzle.config.ts
│
├── backend/           # Python 后端
│   ├── src/
│   │   ├── api/      # FastAPI 路由
│   │   ├── services/ # 业务逻辑
│   │   ├── repository/ # 数据访问层
│   │   └── utils/    # 工具
│   └── requirements.txt
│
└── docker/            # Docker 配置
```

## 部署

### Docker 部署（推荐）

```bash
cd Hera
docker compose -f docker/docker-compose.yml up -d
```

### 手动部署

**前端**

```bash
cd frontend
npm run build
npm start
```

**后端**

```bash
cd backend
uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

### 服务管理

```bash
# 查看日志
docker compose -f docker/docker-compose.yml logs -f

# 重启服务
docker compose -f docker/docker-compose.yml restart

# 停止服务
docker compose -f docker/docker-compose.yml down
```

## 贡献

我们欢迎对 Hera 做出贡献！以下是您可以提供帮助的方式：

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

### 开发指南

- 遵循 TypeScript/Python 最佳实践
- 编写有意义的提交消息
- 为新功能添加测试
- 根据需要更新文档
- 提交 PR 前确保代码质量

## 许可证

该项目根据 MIT 许可证授权 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。

## 致谢

- [Next.js](https://nextjs.org/) 前端框架
- [FastAPI](https://fastapi.tiangolo.com/) 后端框架
- [Better Auth](https://www.better-auth.com/) 身份认证
- [Shadcn/UI](https://ui.shadcn.com/) UI 组件
- [Drizzle ORM](https://orm.drizzle.team/) 数据库管理

---

<div align="center">

由 AutoAgents Algorithm Group 用 ❤️ 构建

</div>
