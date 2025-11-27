'use client';

import { Header } from '@/components/dashboard/header';
import { Card, CardContent } from '@/components/ui/card';
import { useCreditTransactions } from '@/lib/hooks/use-credits';
import { authClient } from '@/lib/auth/client';
import { TrendingUp, TrendingDown, Gift, Coins, History } from 'lucide-react';
import { format } from 'date-fns';

export default function HistoryPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const { data: transactions = [], isLoading } = useCreditTransactions(userId, 50);

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

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'earn':
        return <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">Earned</span>;
      case 'spend':
        return <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">Spent</span>;
      case 'gift':
        return <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">Gift</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">{type}</span>;
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
    <div className="flex flex-col h-full">
      <Header title="History" description="View all your credit transactions" />
      <div className="flex-1 overflow-auto p-6">
        <div className="w-full">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted animate-pulse rounded-lg" />
                        <div className="space-y-1">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No transactions yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Your transaction history will appear here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(tx.createdAt), 'MMM d, yyyy · h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTransactionBadge(tx.type)}
                        <span className={`text-sm font-semibold ${getTransactionColor(tx.type)}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

