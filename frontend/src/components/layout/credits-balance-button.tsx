'use client';

import { Button } from '@/components/ui/button';
import { useCreditBalance } from '@/lib/hooks/use-credits';
import { authClient } from '@/lib/auth/client';
import { Coins, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CreditsBalanceButton() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: balance = 0, isLoading } = useCreditBalance(session?.user?.id);

  const handleClick = () => {
    router.push('/dashboard/credits');
  };

  if (!session?.user) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 gap-2 px-3 text-sm font-medium cursor-pointer hover:bg-accent"
      onClick={handleClick}
    >
      <Coins className="size-4" />
      <span>
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          balance.toLocaleString()
        )}
      </span>
    </Button>
  );
}

