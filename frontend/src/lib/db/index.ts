/**
 * Drizzle 数据库连接
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// 创建 PostgreSQL 连接
const client = postgres(process.env.DATABASE_URL)

// 创建 Drizzle 实例
export const db = drizzle(client, { schema })

// 导出 schema
export { schema }

