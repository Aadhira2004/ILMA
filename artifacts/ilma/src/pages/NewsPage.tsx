import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { useListNews, getListNewsQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Newspaper, ExternalLink, TrendingUp, Calendar, ArrowRight, AlertCircle, Radio } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = [
  { value: 'all', label: 'All News' },
  { value: 'ai-healthcare', label: 'AI in Healthcare' },
  { value: 'medical-devices', label: 'Medical Devices' },
  { value: 'research', label: 'Research' },
  { value: 'fda', label: 'FDA / Regulatory' },
  { value: 'who', label: 'Global Health' },
  { value: 'healthtech', label: 'HealthTech' },
];

export default function NewsPage() {
  useDocumentMeta('Biomedical News', 'Latest news and trends in biomedical engineering and healthcare.');
  useScrollTop();

  const [category, setCategory] = useState('all');

  const { data: allNews, isLoading, isError } = useListNews(
    category !== 'all' ? { category } : {}, 
    {
      query: {
        queryKey: getListNewsQueryKey(category !== 'all' ? { category } : {})
      }
    }
  );

  const { data: trendingNews, isLoading: isTrendingLoading } = useListNews(
    { trending: true },
    {
      query: {
        queryKey: getListNewsQueryKey({ trending: true })
      }
    }
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ai-healthcare': return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800';
      case 'medical-devices': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'fda': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'research': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'who': return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800';
      case 'healthtech': return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const formatCategory = (cat: string) => {
    return CATEGORIES.find(c => c.value === cat)?.label || cat;
  };

  return (
    <Layout>
      <section className="pt-20 pb-12 bg-card border-b border-border">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl flex flex-col items-start">
            <div className="flex items-center gap-2 text-primary font-medium mb-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Radio className="w-4 h-4" />
              Live Industry Updates
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Industry News</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Stay ahead of the curve. Read the latest developments in medical devices, healthcare AI, research breakthroughs, and regulatory updates.
            </p>
          </div>
        </div>
      </section>

      {/* Trending News Section */}
      {(!isTrendingLoading && trendingNews && trendingNews.length > 0) && (
        <section className="py-8 bg-muted/30 border-b border-border">
          <div className="container px-4 md:px-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingNews.slice(0, 3).map((article) => (
                <a 
                  key={article.id}
                  href={article.sourceUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  data-testid={`link-trending-${article.id}`}
                >
                  <Card className="h-full bg-background border-border/50 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className={`font-medium ${getCategoryColor(article.category)}`}>
                          {formatCategory(article.category)}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(parseISO(article.publishedAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-3" title={article.title}>
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.summary}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 text-sm font-medium text-muted-foreground flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {article.sourceName && (
                          <span className="truncate max-w-[150px]">{article.sourceName}</span>
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    </CardFooter>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Feed Section */}
      <section className="py-12 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Latest Feed</h2>
            
            <div className="w-full sm:w-[200px]">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-news-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value} data-testid={`option-news-${c.value}`}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-grow space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-6 w-3/4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 border rounded-xl bg-muted/10">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-semibold mb-2">Failed to load news</h3>
              <p className="text-muted-foreground">Please check your connection and try again.</p>
            </div>
          ) : allNews?.length === 0 ? (
            <div className="text-center py-20 border rounded-xl bg-muted/10 text-muted-foreground">
              <Newspaper className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
              <p>Try selecting a different category to see more news.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {allNews?.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow group" data-testid={`card-news-${article.id}`}>
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-grow flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary" className={`font-medium ${getCategoryColor(article.category)}`}>
                          {formatCategory(article.category)}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(parseISO(article.publishedAt), 'MMM d, yyyy')}
                        </span>
                        {article.trending && (
                          <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400">
                            <TrendingUp className="w-3 h-3 mr-1" /> Trending
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors" title={article.title}>
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2 md:line-clamp-none">
                        {article.summary}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                          {article.sourceName || 'Industry Source'}
                        </span>
                        
                        <a 
                          href={article.sourceUrl || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                          data-testid={`link-read-article-${article.id}`}
                        >
                          Read Article <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
