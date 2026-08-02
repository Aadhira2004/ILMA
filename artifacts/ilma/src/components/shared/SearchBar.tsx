import React from 'react';
import { Link } from 'wouter';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SearchBar({ className, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative group w-full max-w-md", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <Search className="h-5 w-5" />
      </div>
      <Input
        type="search"
        className="pl-10 h-12 rounded-full border-input bg-background/50 backdrop-blur-sm shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
        {...props}
      />
    </div>
  );
}
