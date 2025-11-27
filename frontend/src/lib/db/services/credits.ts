'use server';

import { db } from '@/lib/db';
import { userCredit, creditTransaction } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string): Promise<number> {
  try {
    const record = await db
      .select({ currentCredits: userCredit.currentCredits })
      .from(userCredit)
      .where(eq(userCredit.userId, userId))
      .limit(1);

    return record[0]?.currentCredits || 0;
  } catch (error) {
    console.error('getUserCredits error:', error);
    return 0;
  }
}

/**
 * Get user's credit transactions
 */
export async function getUserTransactions(userId: string, limit = 10) {
  try {
    const transactions = await db
      .select()
      .from(creditTransaction)
      .where(eq(creditTransaction.userId, userId))
      .orderBy(desc(creditTransaction.createdAt))
      .limit(limit);

    return transactions;
  } catch (error) {
    console.error('getUserTransactions error:', error);
    return [];
  }
}

/**
 * Add credits to user account
 */
export async function addCredits({
  userId,
  amount,
  type,
  description,
}: {
  userId: string;
  amount: number;
  type: string;
  description: string;
}) {
  try {
    // Get current balance
    const current = await db
      .select()
      .from(userCredit)
      .where(eq(userCredit.userId, userId))
      .limit(1);

    if (current.length > 0) {
      const newBalance = (current[0]?.currentCredits || 0) + amount;
      await db
        .update(userCredit)
        .set({
          currentCredits: newBalance,
          updatedAt: new Date(),
        })
        .where(eq(userCredit.userId, userId));
    } else {
      await db.insert(userCredit).values({
        userId,
        currentCredits: amount,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Record transaction
    await db.insert(creditTransaction).values({
      userId,
      type,
      amount,
      description,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('addCredits error:', error);
    return { success: false, error: 'Failed to add credits' };
  }
}

/**
 * Initialize new user with gift credits
 */
export async function initializeUserCredits(userId: string) {
  const GIFT_CREDITS = 100;
  
  // Check if user already has credits
  const existing = await db
    .select()
    .from(userCredit)
    .where(eq(userCredit.userId, userId))
    .limit(1);

  if (existing.length === 0) {
    await addCredits({
      userId,
      amount: GIFT_CREDITS,
      type: 'gift',
      description: 'Welcome bonus credits',
    });
  }
}

