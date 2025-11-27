/**
 * 积分系统相关表
 */

import { pgTable, text, timestamp, integer, index } from 'drizzle-orm/pg-core'
import { user } from './user'

/**
 * 用户积分余额表
 */
export const userCredit = pgTable('user_credit', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  currentCredits: integer('current_credits').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userCreditUserIdIdx: index('user_credit_user_id_idx').on(table.userId),
}))

/**
 * 积分交易历史表
 */
export const creditTransaction = pgTable('credit_transaction', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'earn' | 'spend' | 'gift' | 'expire'
  amount: integer('amount').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  creditTransactionUserIdIdx: index('credit_transaction_user_id_idx').on(table.userId),
  creditTransactionTypeIdx: index('credit_transaction_type_idx').on(table.type),
}))

// 类型定义
export type UserCredit = typeof userCredit.$inferSelect
export type NewUserCredit = typeof userCredit.$inferInsert

export type CreditTransaction = typeof creditTransaction.$inferSelect
export type NewCreditTransaction = typeof creditTransaction.$inferInsert

