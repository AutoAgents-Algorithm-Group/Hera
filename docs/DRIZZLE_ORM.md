# 🗄️ Drizzle ORM 数据库层

## 概述

Zeus 使用 [Drizzle ORM](https://orm.drizzle.team) 作为数据库访问层，连接 PostgreSQL 数据库，提供类型安全的数据库操作。

## 架构设计

```
┌──────────────────────────────────────────────────────────┐
│           前端 (Next.js API Routes)                       │
│                                                           │
│  ┌─────────────────────────────────────────────┐         │
│  │  Drizzle ORM Client (lib/db/index.ts)      │         │
│  │  - db.select()                              │         │
│  │  - db.insert()                              │         │
│  │  - db.update()                              │         │
│  │  - db.delete()                              │         │
│  └─────────────────────────────────────────────┘         │
│                     ↓                                    │
│  ┌─────────────────────────────────────────────┐         │
│  │  Schema Definitions (lib/db/schema.ts)      │         │
│  │  - user, session, account                   │         │
│  │  - chatSession, message                     │         │
│  │  - mcpServer                                │         │
│  └─────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────┐
│              PostgreSQL Database                          │
│  - 用户认证数据                                           │
│  - 聊天会话和消息                                         │
│  - MCP 服务器配置                                        │
└──────────────────────────────────────────────────────────┘
```

## 核心配置

### 1. 数据库连接

**文件**：`frontend/src/lib/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// 创建连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // 最大连接数
  idleTimeoutMillis: 30000,   // 空闲超时
  connectionTimeoutMillis: 2000,
})

// 创建 Drizzle 实例
export const db = drizzle(pool, { schema })
```

### 2. 环境配置

#### 开发环境

```bash
# .env.local
DATABASE_URL=postgresql://postgres:password@localhost:5432/zeus_dev
```

**特点**：
- ✅ 本地 PostgreSQL
- ✅ 开发数据可以随时重置
- ✅ 详细的查询日志

#### 生产环境

```bash
# .env.production
DATABASE_URL=postgresql://postgres:password@db:5432/zeus_prod
```

**特点**：
- ✅ Docker 容器内的 PostgreSQL
- ✅ 持久化存储（Docker Volume）
- ⚠️ 需要备份策略

## Schema 定义

### 1. 认证相关表

**用户表**：
```typescript
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})
```

**Session 表**：
```typescript
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})
```

**OAuth Account 表**：
```typescript
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  // ... 其他字段
})
```

### 2. 聊天相关表

**聊天会话表**：
```typescript
export const chatSession = pgTable('chat_session', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

**消息表**：
```typescript
export const message = pgTable('message', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text('session_id')
    .notNull()
    .references(() => chatSession.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### 3. MCP 服务器表

```typescript
export const mcpServer = pgTable('mcp_server', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  serverName: text('server_name').notNull(),
  baseUrl: text('base_url').notNull(),
  transportType: text('transport_type').notNull().default('streamable_http'),
  apiKey: text('api_key'),
  headers: jsonb('headers'),
  enabled: boolean('enabled').notNull().default(true),
  validated: boolean('validated').notNull().default(false),
  status: text('status', { 
    enum: ['connected', 'disconnected', 'error'] 
  }).default('disconnected'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

## 数据库操作示例

### 1. 查询操作

**查询用户的 MCP 服务器**：
```typescript
import { db } from '@/lib/db'
import { mcpServer } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// 查询用户启用的服务器
const userServers = await db
  .select()
  .from(mcpServer)
  .where(
    and(
      eq(mcpServer.userId, session.user.id),
      eq(mcpServer.enabled, true),
      eq(mcpServer.validated, true)
    )
  )
```

**查询聊天历史**：
```typescript
// 查询某个会话的所有消息
const messages = await db
  .select()
  .from(message)
  .where(eq(message.sessionId, chatSessionId))
  .orderBy(message.createdAt)
```

### 2. 插入操作

**创建新会话**：
```typescript
const [newSession] = await db
  .insert(chatSession)
  .values({
    userId: session.user.id,
    title: userMessage.substring(0, 50),
  })
  .returning()

console.log('创建会话:', newSession.id)
```

**保存消息**：
```typescript
await db.insert(message).values({
  sessionId: chatSessionId,
  role: 'user',
  content: userMessage,
})
```

### 3. 更新操作

**更新 MCP 服务器状态**：
```typescript
await db
  .update(mcpServer)
  .set({ 
    status: 'connected',
    validated: true,
    updatedAt: new Date(),
  })
  .where(eq(mcpServer.id, serverId))
```

### 4. 删除操作

**删除会话（级联删除消息）**：
```typescript
await db
  .delete(chatSession)
  .where(eq(chatSession.id, sessionId))
// 因为 onDelete: 'cascade'，相关消息会自动删除
```

## 数据库迁移

### 1. 生成迁移文件

```bash
# 安装 drizzle-kit
npm install -D drizzle-kit

# 生成迁移 SQL
npx drizzle-kit generate:pg
```

### 2. 应用迁移

```bash
# 推送到数据库
npx drizzle-kit push:pg
```

### 3. 迁移文件结构

```
frontend/drizzle/
├── 0000_init.sql
├── 0001_add_mcp_servers.sql
└── meta/
    └── _journal.json
```

## 类型安全

### 1. 自动类型推导

```typescript
// Drizzle 自动推导类型
type User = typeof user.$inferSelect
type NewUser = typeof user.$inferInsert

// 使用类型
const createUser = async (data: NewUser): Promise<User> => {
  const [newUser] = await db.insert(user).values(data).returning()
  return newUser
}
```

### 2. 关系查询

```typescript
// 定义关系
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  chatSessions: many(chatSession),
  mcpServers: many(mcpServer),
}))

// 查询用户及其会话
const userWithSessions = await db.query.user.findFirst({
  where: eq(user.id, userId),
  with: {
    sessions: true,
    chatSessions: {
      with: {
        messages: true,
      },
    },
  },
})
```

## 性能优化

### 1. 连接池配置

```typescript
const pool = new Pool({
  max: 20,                      // 最大连接数
  idleTimeoutMillis: 30000,     // 空闲连接超时
  connectionTimeoutMillis: 2000, // 连接超时
})
```

### 2. 索引优化

```typescript
// 在 schema 中定义索引
export const message = pgTable('message', {
  // ... 字段定义
}, (table) => ({
  // 会话ID索引（加速查询）
  sessionIdx: index('message_session_idx').on(table.sessionId),
  // 创建时间索引（加速排序）
  createdIdx: index('message_created_idx').on(table.createdAt),
}))
```

### 3. 批量操作

```typescript
// 批量插入消息
const messagesToInsert = [
  { sessionId: 'xxx', role: 'user', content: 'Hello' },
  { sessionId: 'xxx', role: 'assistant', content: 'Hi!' },
]

await db.insert(message).values(messagesToInsert)
```

## Docker 部署配置

### 1. Docker Compose 配置

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password
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

  app:
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:your_secure_password@db:5432/zeus_prod

volumes:
  postgres_data:
```

### 2. 初始化脚本

```sql
-- docker/init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 3. 备份策略

**定期备份**：
```bash
# 备份数据库
docker exec zeus-db pg_dump -U postgres zeus_prod > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker exec -i zeus-db psql -U postgres zeus_prod < backup_20250101.sql
```

## 开发工具

### 1. Drizzle Studio

```bash
# 启动可视化管理界面
npx drizzle-kit studio

# 访问 https://local.drizzle.studio
```

### 2. 查询日志

```typescript
// 开发环境启用日志
export const db = drizzle(pool, { 
  schema,
  logger: process.env.NODE_ENV === 'development',
})
```

## 故障排查

### 问题 1：连接失败

**症状**：
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**解决方案**：
```bash
# 检查 PostgreSQL 是否运行
docker ps | grep postgres

# 检查连接字符串
echo $DATABASE_URL

# 测试连接
psql $DATABASE_URL
```

### 问题 2：迁移冲突

**症状**：
```
Error: relation "user" already exists
```

**解决方案**：
```bash
# 重置数据库（开发环境）
npx drizzle-kit drop
npx drizzle-kit push:pg
```

### 问题 3：类型不匹配

**症状**：
```
Type 'string | null' is not assignable to type 'string'
```

**解决方案**：
```typescript
// 使用可选链和空值合并
const userName = user.name ?? 'Unknown'
const userEmail = user.email!  // 确保非空
```

## 最佳实践

1. **使用事务处理关键操作**：
   ```typescript
   await db.transaction(async (tx) => {
     await tx.insert(chatSession).values(sessionData)
     await tx.insert(message).values(messageData)
   })
   ```

2. **定义清晰的关系**：
   ```typescript
   // 使用 onDelete: 'cascade' 自动清理
   userId: text('user_id')
     .references(() => user.id, { onDelete: 'cascade' })
   ```

3. **使用索引加速查询**：
   ```typescript
   // 频繁查询的字段添加索引
   sessionIdx: index().on(table.sessionId)
   ```

4. **类型安全的查询**：
   ```typescript
   // 使用 Drizzle 的类型推导
   const users: User[] = await db.select().from(user)
   ```

## 参考资料

- [Drizzle ORM 官方文档](https://orm.drizzle.team)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)

