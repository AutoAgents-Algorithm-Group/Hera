'use client';

import { authClient } from '@/lib/auth/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserWelcome() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-28 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
      <Avatar className="size-12 ring-2 ring-border">
        <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {getInitials(user?.name || 'User')}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
        </h2>
        <p className="text-sm text-muted-foreground">
          Here's what's happening with your credits today.
        </p>
      </div>
    </div>
  );
}

