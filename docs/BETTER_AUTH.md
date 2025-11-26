# 🔐 Better Auth 认证系统

## 概述

Zeus 使用 [Better Auth](https://better-auth.com) 作为认证解决方案，支持邮箱密码登录和社交登录（GitHub、Google）。

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    前端 (Next.js 16)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Better Auth Client                                  │    │
│  │  - signIn.email()                                   │    │
│  │  - signIn.social({ provider: 'github' })           │    │
│  │  - useSession()                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  API Routes: /api/auth/[...all]                     │    │
│  │  - 处理所有认证请求                                  │    │
│  │  - OAuth 回调                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Better Auth Server (lib/auth/index.ts)            │    │
│  │  - 数据库适配器 (Drizzle)                           │    │
│  │  - Session 管理                                     │    │
│  │  - Cookie 配置                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Proxy (src/proxy.ts) - Next.js 16                 │    │
│  │  - 检查 session_token cookie                        │    │
│  │  - 路由保护                                         │    │
│  │  - 重定向处理                                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                数据库 (PostgreSQL + Drizzle)                │
│  - user 表                                                  │
│  - session 表                                               │
│  - account 表 (OAuth)                                       │
│  - verification 表                                          │
└─────────────────────────────────────────────────────────────┘
```

## 核心配置

### 1. Better Auth 服务端配置

**文件**：`frontend/src/lib/auth/index.ts`

```typescript
export const auth = betterAuth({
  // 数据库配置
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  // 邮箱密码认证
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },

  // 社交登录
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback/google',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback/github',
    },
  },

  // Session 配置
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 天
    updateAge: 60 * 60 * 24, // 每天更新一次
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 分钟缓存
    },
  },

  // Cookie 配置（重要！）
  advanced: {
    cookiePrefix: 'zeus',
    useSecureCookies: process.env.NODE_ENV === 'production',
    defaultCookieAttributes: {
      sameSite: 'lax',  // OAuth 回调兼容
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,   // 防 XSS
      path: '/',
    },
  },

  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL!,
    'http://localhost:3000',
  ],
});
```

### 2. 环境差异配置

#### 开发环境

**Cookie 配置**：
```javascript
{
  cookiePrefix: 'zeus',
  useSecureCookies: false,  // HTTP 允许
  secure: false,
  sameSite: 'lax'
}
```

**Cookie 名称**：
- `zeus.session_token`
- `zeus.session_data`
- `zeus.state`

**特点**：
- ✅ 支持 HTTP (localhost:3000)
- ✅ 无需 HTTPS 证书
- ✅ 开发者工具可见 cookie

#### 生产环境

**Cookie 配置**：
```javascript
{
  cookiePrefix: 'zeus',
  useSecureCookies: true,  // 强制 HTTPS
  secure: true,
  sameSite: 'lax'
}
```

**Cookie 名称**（自动添加 `__Secure-` 前缀）：
- `__Secure-zeus.session_token`
- `__Secure-zeus.session_data`
- `__Secure-zeus.state`

**特点**：
- ✅ 仅 HTTPS 传输
- ✅ 更高安全性
- ⚠️ HTTP 环境无法设置 cookie

## Proxy 路由保护

### Next.js 16 Proxy 配置

**文件**：`frontend/src/proxy.ts`

```typescript
export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // 1. 跳过静态资源和 API
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/brand') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // 2. 处理 i18n
  const response = intlMiddleware(req)
  
  // 3. 检查 session（关键！支持两种 cookie 名称）
  const sessionToken = req.cookies.get('__Secure-zeus.session_token') ||  // 生产
                       req.cookies.get('zeus.session_token')                // 开发
  const hasSession = !!sessionToken
  
  // 4. 定义公开路径
  const isPublicPage = pathname.includes('/sign-in') || 
                       pathname.includes('/sign-up') || 
                       pathname.includes('/auth/callback')
  
  // 5. 未登录重定向到登录页
  if (!hasSession && !isPublicPage) {
    const locale = pathname.split('/')[1] || 'zh'
    const signInUrl = new URL(`/${locale}/sign-in`, req.url)
    signInUrl.searchParams.set('from', pathname)  // 保存原路径
    return NextResponse.redirect(signInUrl)
  }
  
  // 6. 已登录访问登录页，重定向到主页
  if (hasSession && pathname.includes('/sign-in')) {
    const locale = pathname.split('/')[1] || 'zh'
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }
  
  return response
}
```

### 关键点

1. **Cookie 名称兼容**：
   ```typescript
   // 同时支持开发和生产环境
   const token = req.cookies.get('__Secure-zeus.session_token') || 
                 req.cookies.get('zeus.session_token')
   ```

2. **i18n 路由集成**：
   ```typescript
   const locale = pathname.split('/')[1] || 'zh'
   const signInUrl = `/${locale}/sign-in`
   ```

3. **原路径保存**：
   ```typescript
   signInUrl.searchParams.set('from', pathname)
   // 登录后可以跳转回原页面
   ```

## 登录流程

### GitHub 登录流程

```
1. 用户点击 "Sign in with GitHub"
   ↓
2. 前端调用: signIn.social({ provider: 'github' })
   ↓
3. 跳转到: https://github.com/login/oauth/authorize?client_id=xxx
   ↓
4. 用户授权后回调: /api/auth/callback/github?code=xxx
   ↓
5. Better Auth 处理：
   - 用 code 换 access_token
   - 获取用户信息
   - 创建 user (如果不存在)
   - 创建 session
   - 设置 session_token cookie
   ↓
6. 前端检测到 onSuccess 回调
   ↓
7. 重定向到主页: router.push(`/${locale}`)
```

### 登录页面实现

**文件**：`frontend/src/app/[locale]/(auth)/sign-in/page.tsx`

```typescript
export default function SignIn() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'

  const handleGitHubLogin = async () => {
    setLoading(true)
    try {
      await signIn.social(
        {
          provider: "github",
          callbackURL: `/${locale}`,  // 回调后跳转
        },
        {
          onRequest: (ctx) => {
            console.log('[GitHub Login] Starting...', ctx)
          },
          onSuccess: (ctx) => {
            console.log('[GitHub Login] Success!', ctx)
            toast.success("Login successful! Redirecting...")
            // 重定向到主页
            setTimeout(() => {
              router.push(`/${locale}`)
              router.refresh()  // 刷新状态
            }, 500)
          },
          onError: (ctx) => {
            console.error('[GitHub Login] Error:', ctx.error)
            setLoading(false)
            toast.error(ctx.error?.message || "Failed to sign in")
          },
        },
      )
    } catch (error) {
      console.error('[GitHub Login] Exception:', error)
      setLoading(false)
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <Button onClick={handleGitHubLogin} disabled={loading}>
      Sign in with Github
    </Button>
  )
}
```

## 数据库 Schema

### Drizzle ORM Schema

**文件**：`frontend/src/lib/db/schema.ts`

```typescript
// 用户表
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

// Session 表
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

// OAuth Account 表
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})
```

## 环境变量配置

### 开发环境 `.env.local`

```bash
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/zeus_dev

# GitHub OAuth (开发应用)
GITHUB_CLIENT_ID=your_dev_github_client_id
GITHUB_CLIENT_SECRET=your_dev_github_secret

# Google OAuth (开发应用)
GOOGLE_CLIENT_ID=your_dev_google_client_id
GOOGLE_CLIENT_SECRET=your_dev_google_secret

# Better Auth
BETTER_AUTH_SECRET=your_dev_secret_key_at_least_32_chars
```

### 生产环境 `.env.production`

```bash
# App URL (HTTPS!)
NEXT_PUBLIC_APP_URL=https://zenus.agentspro.cn

# Database
DATABASE_URL=postgresql://user:password@db:5432/zeus_prod

# GitHub OAuth (生产应用)
GITHUB_CLIENT_ID=your_prod_github_client_id
GITHUB_CLIENT_SECRET=your_prod_github_secret

# Google OAuth (生产应用)
GOOGLE_CLIENT_ID=your_prod_google_client_id
GOOGLE_CLIENT_SECRET=your_prod_google_secret

# Better Auth
BETTER_AUTH_SECRET=your_prod_secret_key_at_least_32_chars_very_secure
```

### OAuth 回调 URL 配置

**GitHub OAuth App**：
- 开发：`http://localhost:3000/api/auth/callback/github`
- 生产：`https://zenus.agentspro.cn/api/auth/callback/github`

**Google OAuth App**：
- 开发：`http://localhost:3000/api/auth/callback/google`
- 生产：`https://zenus.agentspro.cn/api/auth/callback/google`

## 故障排查

### 问题 1：Cookie 未设置

**症状**：
- 登录成功但立即重定向回登录页
- 浏览器 Cookie 中没有 `session_token`

**原因**：
1. 生产环境使用 HTTP 而不是 HTTPS
2. `secure: true` 导致 HTTP 无法设置 cookie

**解决方案**：
```typescript
// 临时测试：强制禁用 secure
advanced: {
  useSecureCookies: false,  // 仅用于测试
  defaultCookieAttributes: {
    secure: false,
  },
}
```

### 问题 2：OAuth 回调失败

**症状**：
- 授权后跳转到 404
- 或显示 "redirect_uri_mismatch"

**原因**：
1. GitHub/Google 配置的回调 URL 不匹配
2. `NEXT_PUBLIC_APP_URL` 配置错误

**解决方案**：
```bash
# 检查环境变量
echo $NEXT_PUBLIC_APP_URL

# 确保与 OAuth 应用配置一致
GitHub: https://github.com/settings/developers
Google: https://console.cloud.google.com/apis/credentials
```

### 问题 3：Proxy 无法读取 Session

**症状**：
- 已登录但 Proxy 仍重定向到登录页
- 日志显示 `hasSession: false`

**原因**：
- Cookie 名称不匹配（开发 vs 生产）

**解决方案**：
```typescript
// proxy.ts 中同时支持两种格式
const sessionToken = req.cookies.get('__Secure-zeus.session_token') || 
                     req.cookies.get('zeus.session_token')
```

## 安全最佳实践

### 1. Cookie 安全

```typescript
defaultCookieAttributes: {
  httpOnly: true,       // 防止 XSS 攻击
  secure: true,         // 仅 HTTPS（生产）
  sameSite: 'lax',     // 防止 CSRF，兼容 OAuth
  path: '/',           // 全站有效
}
```

### 2. Session 管理

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7,  // 7天过期
  updateAge: 60 * 60 * 24,       // 每天更新一次
}
```

### 3. 环境隔离

- 开发和生产使用**不同的** OAuth 应用
- 开发和生产使用**不同的** `BETTER_AUTH_SECRET`
- 开发和生产使用**不同的**数据库

### 4. HTTPS 强制

```typescript
// 生产环境强制 HTTPS
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_APP_URL?.startsWith('https://')) {
    throw new Error('Production must use HTTPS')
  }
}
```

## 参考资料

- [Better Auth 官方文档](https://better-auth.com)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- [Next.js Middleware/Proxy](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [OAuth 2.0 RFC](https://oauth.net/2/)

