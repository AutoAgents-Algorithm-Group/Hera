'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserCredits, getUserTransactions } from '@/lib/db/services/credits';

export function useCreditBalance(userId: string | undefined) {
  return useQuery({
    queryKey: ['credits', userId],
    queryFn: () => getUserCredits(userId!),
    enabled: !!userId,
  });
}

export function useCreditTransactions(userId: string | undefined, limit = 10) {
  return useQuery({
    queryKey: ['transactions', userId, limit],
    queryFn: () => getUserTransactions(userId!, limit),
    enabled: !!userId,
  });
}

