import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { useListResources, getListResourcesQueryKey } from '@workspace/api-client-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, BookOpen, FileText, Database, Code, Youtube, Globe, GraduationCap, Wrench, Star, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = [
  { value: 'all', label: 'All Resources', icon: Globe },
  { value: 'book', label: 'Books', icon: BookOpen },
  { value: 'paper', label: 'Papers', icon: FileText },
  { value: 'dataset', label: 'Datasets', icon: Database },
  { value: 'software', label: 'Software', icon: Code },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'website', label: 'Websites', icon: Globe },
  { value: 'mooc', label: 'MOOCs', icon: GraduationCap },
  { value: 'tool', label: 'Tools', icon: Wrench },
];

const DIFFICULTIES = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function ResourceLibraryPage() {
  useDocumentMeta('Resource Library', 'Curated learning resources for biomedical engineering.');
  useScrollTop();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    ...(category !== 'all' ? { category } : {}),
    ...(difficulty !== 'all' ? { difficulty } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  };

  const { data: resources, isLoading, isError } = useListResources(queryParams, {
    query: {
      queryKey: getListResourcesQueryKey(queryParams)
    }
  });

  const getCategoryIcon = (catValue: string) => {
    const cat = CATEGORIES.find(c => c.value === catValue);
    const Icon = cat?.icon || Globe;
    return <Icon className="w-4 h-4" />;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'intermediate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'advanced': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <Layout>
      <section className="pt-20 pb-12 md:pt-28 md:pb-16 bg-card border-b border-border relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Resource Library</h1>
            <p className="text-lg text-muted-foreground mb-8">
              A curated collection of the best books, papers, datasets, and tools to accelerate your biomedical engineering journey.
            </p>
            
            <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search resources by title, topic, or keyword..." 
                  className="pl-10 h-11 bg-background"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search-resources"
                />
              </div>
              <div className="flex gap-2">
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-[140px] h-11 bg-background" data-testid="select-difficulty">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map(d => (
                      <SelectItem key={d.value} value={d.value} data-testid={`option-difficulty-${d.value}`}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap gap-2 mb-8 justify-center pb-4 border-b border-border">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                data-testid={`button-category-${cat.value}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-semibold mb-2">Failed to load resources</h3>
              <p className="text-muted-foreground">Please check your connection and try again.</p>
            </div>
          ) : resources?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No resources found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              {(search || category !== 'all' || difficulty !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => { setSearch(''); setCategory('all'); setDifficulty('all'); }}
                  data-testid="button-clear-filters"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources?.map((resource) => (
                <Card 
                  key={resource.id} 
                  className={`flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                    resource.featured ? 'border-primary/50 shadow-sm ring-1 ring-primary/10' : ''
                  }`}
                  data-testid={`card-resource-${resource.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {getCategoryIcon(resource.category)}
                        <span className="text-xs font-medium uppercase tracking-wider">{resource.category}</span>
                      </div>
                      {resource.featured && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-tight line-clamp-2" title={resource.title}>
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="font-normal bg-background">
                        {resource.topic}
                      </Badge>
                      {resource.difficulty !== 'all' && (
                        <Badge variant="outline" className={`font-normal capitalize ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {resource.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/40 mt-auto bg-muted/20">
                    <Button asChild variant="outline" className="w-full group bg-background">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center"
                        data-testid={`link-resource-${resource.id}`}
                      >
                        View Resource
                        <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
