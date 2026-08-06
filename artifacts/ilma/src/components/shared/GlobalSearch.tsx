import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

import careersData from '@/data/careers.json';
import domainsData from '@/data/domains.json';
import roadmapsData from '@/data/roadmaps.json';
import examsData from '@/data/exams.json';

export function GlobalSearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        data-testid="button-global-search"
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search ILMA...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <GlobalSearchDialog open={open} setOpen={setOpen} />
    </>
  );
}

export function GlobalSearchDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const [, setLocation] = useLocation();

  const handleSelect = (path: string) => {
    setOpen(false);
    setLocation(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Careers">
          {careersData.map((career) => (
            <CommandItem
              key={career.id}
              onSelect={() => handleSelect(`/careers/${career.id}`)}
              data-testid={`search-item-career-${career.id}`}
            >
              {career.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Domains">
          {domainsData.map((domain) => (
            <CommandItem
              key={domain.id}
              onSelect={() => handleSelect(`/domains/${domain.id}`)}
              data-testid={`search-item-domain-${domain.id}`}
            >
              {domain.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Roadmaps">
          {roadmapsData.map((roadmap) => (
            <CommandItem
              key={roadmap.id}
              onSelect={() => handleSelect(`/roadmaps/${roadmap.id}`)}
              data-testid={`search-item-roadmap-${roadmap.id}`}
            >
              {roadmap.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Exams">
          {examsData.map((exam) => (
            <CommandItem
              key={exam.id}
              onSelect={() => handleSelect(`/exams/${exam.id}`)}
              data-testid={`search-item-exam-${exam.id}`}
            >
              {exam.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Pages">
          <CommandItem
            onSelect={() => handleSelect('/resources')}
            data-testid="search-item-page-resources"
          >
            Resource Library
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect('/news')}
            data-testid="search-item-page-news"
          >
            News & Trends
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect('/companies')}
            data-testid="search-item-page-companies"
          >
            Top Companies
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect('/research')}
            data-testid="search-item-page-research"
          >
            Research Hub
          </CommandItem>
          <CommandItem
            onSelect={() => handleSelect('/dashboard')}
            data-testid="search-item-page-dashboard"
          >
            Dashboard
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
