'use client';

import { UserAvatar } from '@/components/layout/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth/client';
import { LogOut, Settings, LayoutDashboard, Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserButtonProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export function UserButton({ user }: UserButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <UserAvatar
            name={user.name}
            image={user.image}
            className="size-9 cursor-pointer ring-2 ring-border hover:ring-primary/50 transition-all"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* User Info */}
        <div className="flex items-start gap-3 p-2">
          <UserAvatar name={user.name} image={user.image} className="size-10" />
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{user.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">
              {user.email}
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push('/dashboard');
            setOpen(false);
          }}
        >
          <LayoutDashboard className="mr-2 size-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push('/dashboard/credits');
            setOpen(false);
          }}
        >
          <Coins className="mr-2 size-4" />
          <span>Credits</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push('/dashboard/settings');
            setOpen(false);
          }}
        >
          <Settings className="mr-2 size-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            handleSignOut();
          }}
        >
          <LogOut className="mr-2 size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

