import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, ChevronDown, LayoutDashboard, UserCircle, LogOut, ShieldCheck, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/react';
import { useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
import { GlobalSearchTrigger } from '@/components/shared/GlobalSearch';
import { NotificationsBell } from '@/components/shared/NotificationsBell';
import ilmaLogo from '@/assets/images/ilma-logo.png';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Careers', href: '/careers' },
  { name: 'Domains', href: '/domains' },
  { name: 'Roadmaps', href: '/roadmaps' },
  { name: 'Exams', href: '/exams' },
];

const EXPLORE_LINKS = [
  { name: 'Resource Library', href: '/resources' },
  { name: 'Biomedical News', href: '/news' },
  { name: 'Company Explorer', href: '/companies' },
  { name: 'Research Hub', href: '/research' },
];

const MORE_LINKS = [
  { name: 'About ILMA', href: '/about' },
  { name: 'Meet the Founder', href: '/founder' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

function UserMenu() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [location, navigate] = useLocation();
  const { data: me } = useGetMe({
    query: { enabled: !!isSignedIn, queryKey: getGetMeQueryKey() },
  });
  void location;

  if (!isSignedIn) {
    return (
      <Button
        size="sm"
        onClick={() => navigate('/sign-in')}
        className="gap-1.5"
        data-testid="button-nav-sign-in"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Sign in</span>
      </Button>
    );
  }

  const initials =
    (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '') ||
    user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ||
    'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full outline-none ring-primary/40 focus-visible:ring-2"
          aria-label="Account menu"
          data-testid="button-user-menu"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? 'User'} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={() => navigate('/dashboard')} data-testid="link-menu-dashboard">
          <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="link-menu-profile">
          <UserCircle className="h-4 w-4 mr-2" /> Profile
        </DropdownMenuItem>
        {me?.isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/admin')} data-testid="link-menu-admin">
            <ShieldCheck className="h-4 w-4 mr-2" /> Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ redirectUrl: import.meta.env.BASE_URL })}
          data-testid="button-menu-sign-out"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-border shadow-sm py-2'
          : 'bg-background/50 backdrop-blur-sm border-transparent py-3'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          aria-label="ILMA – Biomedical Future Home"
          className="flex items-center gap-3 z-50 relative group"
        >
          <img
            src={ilmaLogo}
            alt="ILMA – Biomedical Future Logo"
            className={cn(
              'object-contain rounded-md dark:bg-white/95 dark:p-1 transition-all duration-300 group-hover:scale-105',
              /* desktop: 52px tall; mobile: 40px */
              'h-10 sm:h-[52px] w-auto'
            )}
            loading="eager"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              location === link.href ||
              (link.href !== '/' && location.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors relative',
                  isActive
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-3"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {[{ label: 'Explore', links: EXPLORE_LINKS }, { label: 'More', links: MORE_LINKS }].map(
            (group) => {
              const groupActive = group.links.some((l) => location.startsWith(l.href));
              return (
                <DropdownMenu key={group.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors outline-none',
                        groupActive
                          ? 'text-primary'
                          : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                      )}
                      data-testid={`button-nav-${group.label.toLowerCase()}`}
                    >
                      {group.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    {group.links.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href} data-testid={`link-nav-${link.href.slice(1)}`}>
                          {link.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 z-50 relative">
          <div className="hidden md:block">
            <GlobalSearchTrigger />
          </div>
          <NotificationsBell />
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-foreground/70 hover:text-foreground rounded-full"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <UserMenu />

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground/70 hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background border-b border-border shadow-lg"
          >
            {/* Logo at top of drawer */}
            <div className="flex items-center px-6 pt-5 pb-3 border-b border-border/60">
              <img
                src={ilmaLogo}
                alt="ILMA – Biomedical Future Logo"
                className="h-10 w-auto object-contain rounded-md dark:bg-white/95 dark:p-1"
                loading="lazy"
              />
            </div>

            <nav className="flex flex-col py-4 px-4 gap-1 container mx-auto">
              {[...NAV_LINKS, ...EXPLORE_LINKS, ...MORE_LINKS].map((link) => {
                const isActive =
                  location === link.href ||
                  (link.href !== '/' && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 text-base font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
