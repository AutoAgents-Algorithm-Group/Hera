'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreditBalance, useCreditTransactions } from '@/lib/hooks/use-credits';
import { authClient } from '@/lib/auth/client';
import { Coins, TrendingUp, TrendingDown, Gift, Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function CreditsOverview() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const { data: balance = 0, isLoading: isLoadingBalance } = useCreditBalance(userId);
  const { data: transactions = [], isLoading: isLoadingTransactions } = useCreditTransactions(userId, 5);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />;
      case 'spend':
        return <TrendingDown className="size-4 text-red-500 dark:text-red-400" />;
      case 'gift':
        return <Gift className="size-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Coins className="size-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earn':
      case 'gift':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'spend':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Balance Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Coins className="size-4" />
            Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary">
                {isLoadingBalance ? (
                  <span className="inline-block w-24 h-9 bg-muted animate-pulse rounded" />
                ) : (
                  balance.toLocaleString()
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Credits available
              </p>
            </div>
            <Link 
              href="/dashboard/credits"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
            >
              Buy more
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              Recent Activity
            </CardTitle>
            <Link 
              href="/dashboard/history"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(tx.type)}
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${getTransactionColor(tx.type)}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

