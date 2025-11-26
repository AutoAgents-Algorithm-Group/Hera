import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'

export const auth = betterAuth({
  // Secret 密钥（用于加密、签名和哈希）
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,

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
    requireEmailVerification: false, // 开发环境关闭，生产环境建议开启
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

  // 高级选项
  advanced: {
    cookiePrefix: 'hera',
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false,
    },
    // 生产环境 cookie 配置
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/',
    },
  },

  // 基础 URL
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  
  // 信任的来源
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL!,
    'http://localhost:3000',
  ],

  // Logger 配置（生产环境启用以调试）
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
})

export type Session = typeof auth.$Infer.Session

