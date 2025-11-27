'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={cn('size-8', className)}>
      <AvatarImage src={image || undefined} alt={name || 'User'} />
      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
        {name ? getInitials(name) : 'U'}
      </AvatarFallback>
    </Avatar>
  );
}

