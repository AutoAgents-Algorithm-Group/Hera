'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { useCreditBalance } from '@/lib/hooks/use-credits';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  Coins, 
  History,
  Settings,
  LogOut,
  ChevronUp,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Credits',
    href: '/dashboard/credits',
    icon: Coins,
  },
  {
    name: 'History',
    href: '/dashboard/history',
    icon: History,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { data: balance = 0 } = useCreditBalance(user?.id);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="flex flex-col w-60 h-screen bg-secondary border-r border-border">
      {/* Credits Display */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary shadow-sm">
            <Coins className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-lg font-semibold text-foreground">{balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="size-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      {user && (
        <div className="border-t border-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors">
                <Avatar className="size-9 ring-2 ring-border">
                  <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {getInitials(user.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <ChevronUp className="size-4 text-muted-foreground flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="mr-2 size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  );
}

