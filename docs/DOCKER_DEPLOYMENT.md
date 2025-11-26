# 🐳 Docker 部署指南

## 概述

Zeus 使用 Docker 和 Docker Compose 进行容器化部署，支持开发和生产环境的差异化配置。

## 架构设计

```
┌───────────────────────────────────────────────────────────┐
│                    Docker Compose                          │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  app (Zeus 应用容器)                              │    │
│  │  ┌──────────────────────────────────────────┐    │    │
│  │  │  前端 (Next.js 16)                        │    │    │
│  │  │  - Port 3000                             │    │    │
│  │  │  - 生产构建                               │    │    │
│  │  └──────────────────────────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────┐    │    │
│  │  │  后端 (FastAPI)                          │    │    │
│  │  │  - Port 8000                             │    │    │
│  │  │  - Uvicorn ASGI                          │    │    │
│  │  └──────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────┘    │
│                          ↓                                 │
│  ┌──────────────────────────────────────────────────┐    │
│  │  db (PostgreSQL 16)                              │    │
│  │  - Port 5432                                     │    │
│  │  - Volume: postgres_data                         │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

## Dockerfile 分析

### 多阶段构建

**文件**：`docker/Dockerfile`

```dockerfile
# ==================== 前端构建阶段 ====================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制依赖文件
COPY frontend/package*.json ./
RUN npm ci && npm cache clean --force

# 复制源代码和环境变量
COPY frontend/ .
COPY frontend/.env.production ./.env.production

# 生产构建 (NODE_ENV=production 自动禁用 Turbo)
ENV NODE_ENV=production
RUN npm run build

# ==================== 后端构建阶段 ====================
FROM python:3.11-slim AS backend-builder

WORKDIR /app/backend

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc g++ gfortran \
    liblapack-dev libblas-dev \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# ==================== 生产运行阶段 ====================
FROM ubuntu:22.04 AS production

# 安装 Node.js 20 和 Python 3.11
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs python3.11 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 复制前端构建产物
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/next.config.ts ./frontend/
COPY --from=frontend-builder /app/frontend/.env.production ./frontend/

# 安装前端生产依赖
WORKDIR /app/frontend
RUN npm ci --only=production && npm cache clean --force

# 复制后端代码和依赖
WORKDIR /app
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY backend/ ./backend/
COPY backend/.env.production ./backend/.env.production

# 复制启动脚本
COPY docker/start.sh ./
RUN chmod +x start.sh

# 暴露端口
EXPOSE 3000 8000

# 启动服务
CMD ["./start.sh"]
```

### 关键配置说明

#### 1. Node.js 版本

```dockerfile
FROM node:20-alpine AS frontend-builder
```

**原因**：
- Next.js 16 要求 Node.js ≥ 20.9.0
- Alpine 镜像体积小 (~40MB vs ~200MB)

#### 2. Turbo 禁用

```dockerfile
ENV NODE_ENV=production
RUN npm run build
```

**效果**：
- `next.config.ts` 中 `useWasmBinary: process.env.NODE_ENV !== 'production'`
- 生产构建自动禁用 Turbo，使用 Webpack
- 避免 Alpine + WASM 兼容性问题

#### 3. 环境变量文件

```dockerfile
COPY frontend/.env.production ./.env.production
COPY backend/.env.production ./backend/.env.production
```

**目的**：
- 将环境变量直接打包到镜像中
- 避免运行时依赖外部文件

#### 4. 多阶段构建优势

- **减小镜像体积**：不包含构建工具
- **提高安全性**：生产环境只包含必需文件
- **加速部署**：缓存构建层

## Docker Compose 配置

**文件**：`docker/docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL 数据库
  db:
    image: postgres:16-alpine
    container_name: zeus-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-your_secure_password}
      POSTGRES_DB: zeus_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Zeus 应用 (前端 + 后端)
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: zeus-app
    depends_on:
      db:
        condition: service_healthy
    environment:
      # 应用 URL
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-https://zenus.agentspro.cn}
      NEXT_PUBLIC_BACKEND_URL: ${NEXT_PUBLIC_BACKEND_URL:-https://zenus.agentspro.cn/api}
      
      # 数据库连接
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD:-your_secure_password}@db:5432/zeus_prod
      
      # 后端 URL (内部)
      BACKEND_URL: http://localhost:8000
      
      # Node 环境
      NODE_ENV: production
    ports:
      - "3000:3000"
      - "8000:8000"
    restart: unless-stopped
    networks:
      - zeus-network

volumes:
  postgres_data:
    driver: local

networks:
  zeus-network:
    driver: bridge
```

### 配置说明

#### 1. 健康检查

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

**作用**：
- 确保数据库就绪后再启动应用
- 避免连接失败

#### 2. 服务依赖

```yaml
depends_on:
  db:
    condition: service_healthy
```

**效果**：
- 等待数据库健康检查通过
- 应用才开始启动

#### 3. 环境变量

```yaml
environment:
  NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-https://zenus.agentspro.cn}
```

**优先级**：
1. 宿主机环境变量 `$NEXT_PUBLIC_APP_URL`
2. 默认值 `https://zenus.agentspro.cn`

#### 4. 数据持久化

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

**作用**：
- 数据库数据持久化
- 容器重启数据不丢失

## 启动脚本

**文件**：`docker/start.sh`

```bash
#!/bin/bash
set -e

echo "🚀 Zeus AI Multi-Agent Platform"
echo "=================================="
echo ""

# 1. 启动后端服务 (后台)
echo "🔧 启动后端服务 (FastAPI)..."
cd /app/backend
python3 -m uvicorn src.api.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --log-level info &

BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
echo ""

# 2. 等待后端就绪
echo "⏳ 等待后端服务就绪..."
sleep 5

# 检查后端健康
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ 后端服务健康检查通过"
else
    echo "⚠️ 后端服务可能未完全启动"
fi
echo ""

# 3. 启动前端服务
echo "🎨 启动前端服务 (Next.js)..."
cd /app/frontend
npm start -- -H 0.0.0.0 -p 3000

# 如果前端退出，杀死后端
kill $BACKEND_PID
```

### 脚本特点

1. **后台启动后端**：
   ```bash
   python3 -m uvicorn src.api.main:app ... &
   BACKEND_PID=$!
   ```

2. **健康检查**：
   ```bash
   curl -f http://localhost:8000/health
   ```

3. **前台启动前端**：
   ```bash
   npm start -- -H 0.0.0.0 -p 3000
   ```
   - 保持容器运行
   - 可以查看日志

4. **优雅退出**：
   ```bash
   kill $BACKEND_PID
   ```

## 环境配置

### 开发环境

**不使用 Docker**：
```bash
# 前端
cd frontend
npm run dev  # Turbopack 启用

# 后端
cd backend
uvicorn src.api.main:app --reload
```

**特点**：
- 热重载
- 快速迭代
- Turbopack 加速

### 生产环境

**使用 Docker**：
```bash
# 构建镜像
docker compose -f docker/docker-compose.yml build

# 启动服务
docker compose -f docker/docker-compose.yml up -d

# 查看日志
docker compose -f docker/docker-compose.yml logs -f
```

**特点**：
- 优化构建
- Turbo 禁用
- 稳定运行

## 环境变量管理

### 前端环境变量

**文件**：`frontend/.env.production`

```bash
# 应用 URL (必须是 HTTPS)
NEXT_PUBLIC_APP_URL=https://zenus.agentspro.cn
NEXT_PUBLIC_BACKEND_URL=https://zenus.agentspro.cn/api

# 数据库
DATABASE_URL=postgresql://postgres:password@db:5432/zeus_prod

# OAuth (生产应用)
GITHUB_CLIENT_ID=prod_github_client_id
GITHUB_CLIENT_SECRET=prod_github_secret
GOOGLE_CLIENT_ID=prod_google_client_id
GOOGLE_CLIENT_SECRET=prod_google_secret

# Better Auth
BETTER_AUTH_SECRET=your_production_secret_min_32_chars
```

### 后端环境变量

**文件**：`backend/.env.production`

```bash
# LLM API Keys (可选，支持 localStorage 覆盖)
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-xxx
DASHSCOPE_API_KEY=sk-xxx
```

### 安全注意事项

1. **不提交敏感信息**：
   ```.gitignore
   .env
   .env.local
   .env.production
   ```

2. **使用 .example 文件**：
   ```bash
   # 提供模板
   frontend/.env.production.example
   backend/.env.production.example
   ```

3. **生产环境使用密钥管理**：
   - AWS Secrets Manager
   - HashiCorp Vault
   - Docker Secrets

## 部署流程

### 1. 本地测试

```bash
# 1. 准备环境变量
cp frontend/.env.production.example frontend/.env.production
cp backend/.env.production.example backend/.env.production

# 编辑配置
vim frontend/.env.production
vim backend/.env.production

# 2. 构建镜像
docker compose -f docker/docker-compose.yml build

# 3. 启动服务
docker compose -f docker/docker-compose.yml up -d

# 4. 查看日志
docker compose -f docker/docker-compose.yml logs -f

# 5. 访问应用
open http://localhost:3000
```

### 2. 服务器部署

```bash
# 1. 连接服务器
ssh user@your-server.com

# 2. 克隆代码
git clone https://github.com/yourusername/Zeus.git
cd Zeus

# 3. 配置环境变量
vim frontend/.env.production
vim backend/.env.production

# 4. 构建并启动
docker compose -f docker/docker-compose.yml up -d --build

# 5. 配置 Nginx 反向代理 (可选)
sudo vim /etc/nginx/sites-available/zeus
```

### 3. Nginx 配置 (可选)

```nginx
server {
    listen 80;
    server_name zenus.agentspro.cn;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zenus.agentspro.cn;
    
    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/zenus.agentspro.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zenus.agentspro.cn/privkey.pem;
    
    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 后端 API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # SSE 支持
        proxy_buffering off;
        proxy_cache off;
    }
}
```

## 运维命令

### 查看服务状态

```bash
# 查看运行中的容器
docker compose -f docker/docker-compose.yml ps

# 查看资源使用
docker stats zeus-app zeus-db
```

### 查看日志

```bash
# 实时日志
docker compose -f docker/docker-compose.yml logs -f

# 仅查看应用日志
docker logs zeus-app -f

# 仅查看数据库日志
docker logs zeus-db -f

# 过滤日志
docker logs zeus-app | grep ERROR
```

### 重启服务

```bash
# 重启所有服务
docker compose -f docker/docker-compose.yml restart

# 重启单个服务
docker compose -f docker/docker-compose.yml restart app
```

### 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建
docker compose -f docker/docker-compose.yml build

# 3. 重启服务
docker compose -f docker/docker-compose.yml up -d

# 4. 清理旧镜像
docker image prune -f
```

### 备份数据库

```bash
# 导出数据
docker exec zeus-db pg_dump -U postgres zeus_prod > backup_$(date +%Y%m%d).sql

# 导入数据
docker exec -i zeus-db psql -U postgres zeus_prod < backup_20250101.sql
```

### 清理数据

```bash
# 停止并删除容器
docker compose -f docker/docker-compose.yml down

# 删除数据卷 (⚠️ 危险操作)
docker compose -f docker/docker-compose.yml down -v

# 删除镜像
docker rmi $(docker images -q zeus*)
```

## 故障排查

### 问题 1：容器无法启动

**症状**：
```
ERROR: Service 'app' failed to build
```

**解决方案**：
```bash
# 查看详细构建日志
docker compose -f docker/docker-compose.yml build --progress=plain

# 清理缓存重新构建
docker compose -f docker/docker-compose.yml build --no-cache
```

### 问题 2：数据库连接失败

**症状**：
```
ERROR: could not connect to server: Connection refused
```

**解决方案**：
```bash
# 检查数据库是否运行
docker ps | grep zeus-db

# 检查数据库日志
docker logs zeus-db

# 检查健康状态
docker inspect zeus-db | grep Health
```

### 问题 3：前端 502 错误

**症状**：
- 前端显示 "Bad Gateway"

**原因**：
- 后端未启动或崩溃

**解决方案**：
```bash
# 检查后端日志
docker logs zeus-app | grep -A 10 "后端服务"

# 手动测试后端
curl http://localhost:8000/health
```

### 问题 4：环境变量未生效

**症状**：
- OAuth 回调失败
- 数据库连接错误

**解决方案**：
```bash
# 检查容器内环境变量
docker exec zeus-app env | grep NEXT_PUBLIC

# 重新构建镜像 (环境变量已打包)
docker compose -f docker/docker-compose.yml build --no-cache
```

## 性能优化

### 1. 镜像体积优化

```dockerfile
# 使用 Alpine 基础镜像
FROM node:20-alpine

# 清理缓存
RUN npm cache clean --force
RUN rm -rf /var/lib/apt/lists/*

# 多阶段构建
# 只复制必要文件到生产镜像
```

### 2. 构建速度优化

```dockerfile
# 利用 Docker 缓存层
COPY package*.json ./
RUN npm ci

# 在代码复制之前安装依赖
```

### 3. 运行时优化

```yaml
# 限制资源使用
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

## 监控和日志

### 1. Docker 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

### 2. 日志聚合 (可选)

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 3. 监控工具 (未来)

- Prometheus + Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Datadog

## 参考资料

- [Docker 官方文档](https://docs.docker.com)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Next.js Docker 部署](https://nextjs.org/docs/deployment)
- [FastAPI Docker 部署](https://fastapi.tiangolo.com/deployment/docker/)

