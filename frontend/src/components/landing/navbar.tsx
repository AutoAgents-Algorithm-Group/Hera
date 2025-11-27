'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';
import { UserButton } from '@/components/layout/user-button';
import { CreditsBalanceButton } from '@/components/layout/credits-balance-button';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-background/50 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Logo className="group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold">Hera</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {!mounted || isPending ? (
              <Skeleton className="size-9 rounded-full" />
            ) : session?.user ? (
              <>
                <CreditsBalanceButton />
                <UserButton user={session.user} />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="gap-2">
                  <a 
                    href="https://chrome.google.com/webstore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Sparkles className="size-4" />
                    Install Extension
                  </a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col space-y-4">
              {/* Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Auth Section */}
              <div className="pt-4 border-t border-border space-y-2">
                {!mounted || isPending ? (
                  <Skeleton className="h-10 w-full" />
                ) : session?.user ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-2">
                      <UserButton user={session.user} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full gap-2">
                      <a 
                        href="https://chrome.google.com/webstore" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Sparkles className="size-4" />
                        Install Extension
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

