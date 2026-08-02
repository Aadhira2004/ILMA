import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, ActivitySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About ILMA', href: '/about' },
  { name: 'Career Explorer', href: '/careers' },
  { name: 'Biomedical Domains', href: '/domains' },
  { name: 'Skill Roadmaps', href: '/roadmaps' },
  { name: 'Government Exams', href: '/exams' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-3" 
          : "bg-background/50 backdrop-blur-sm border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50 relative group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-105 transition-transform">
            <ActivitySquare className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl leading-none tracking-tight">ILMA</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">Biomedical Future</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors relative",
                  isActive ? "text-primary" : "text-foreground/70 hover:text-foreground hover:bg-accent"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-3"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 z-50 relative">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-foreground/70 hover:text-foreground rounded-full"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-foreground/70 hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            <nav className="flex flex-col py-4 px-4 gap-2 container mx-auto">
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={cn(
                      "px-4 py-3 text-base font-medium rounded-lg transition-colors flex items-center justify-between",
                      isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-accent hover:text-foreground"
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
