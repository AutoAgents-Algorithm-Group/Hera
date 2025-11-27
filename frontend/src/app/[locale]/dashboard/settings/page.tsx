'use client';

import { Header } from '@/components/dashboard/header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth/client';
import { User, Mail, Calendar, LogOut, Shield, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const user = session?.user;

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
    <div className="flex flex-col h-full">
      <Header title="Settings" description="Manage your account" />
      <div className="flex-1 overflow-auto p-6">
        <div className="w-full space-y-6">
          {/* Profile Card - Modern Design */}
          <Card className="bg-card border-border overflow-hidden">
            {/* Profile Header with Gradient */}
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            
            <CardContent className="p-6 -mt-12">
              {/* Avatar & Basic Info */}
              <div className="flex items-end gap-4 mb-8">
                <Avatar className="size-20 ring-4 ring-background shadow-lg">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                    {getInitials(user?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <div className="pb-1">
                  <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Display Name</p>
                    <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Mail className="size-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="text-sm font-medium text-foreground truncate">{user?.email || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Calendar className="size-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.createdAt 
                        ? format(new Date(user.createdAt), 'MMM d, yyyy')
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Account Actions</h3>
                <div className="space-y-2">
                  {/* Security Info */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Shield className="size-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Connected via GitHub</p>
                        <p className="text-xs text-muted-foreground">OAuth authentication active</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                      Secured
                    </span>
                  </div>

                  {/* Sign Out Button */}
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                        <LogOut className="size-4 text-destructive" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-destructive">Sign out</p>
                        <p className="text-xs text-destructive/70">End your current session</p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-destructive/50 group-hover:text-destructive group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

