'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useCreditBalance, useCreditTransactions } from '@/lib/hooks/use-credits';
import { authClient } from '@/lib/auth/client';
import { Coins, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function StatsCards() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const { data: balance = 0, isLoading: isLoadingBalance } = useCreditBalance(userId);
  const { data: transactions = [], isLoading: isLoadingTransactions } = useCreditTransactions(userId, 100);

  // Calculate stats from transactions
  const totalEarned = transactions
    .filter((tx) => tx.type === 'earn' || tx.type === 'gift')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSpent = Math.abs(
    transactions
      .filter((tx) => tx.type === 'spend')
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  const stats = [
    {
      title: 'Current Balance',
      value: balance.toLocaleString(),
      icon: Coins,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Total Earned',
      value: totalEarned.toLocaleString(),
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Spent',
      value: totalSpent.toLocaleString(),
      icon: TrendingDown,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Transactions',
      value: transactions.length.toString(),
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const isLoading = isLoadingBalance || isLoadingTransactions;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-semibold text-foreground">
                  {isLoading ? (
                    <span className="inline-block w-16 h-7 bg-muted animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

