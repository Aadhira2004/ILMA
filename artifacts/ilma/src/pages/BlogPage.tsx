import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import blogData from '@/data/blog.json';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Calendar, Clock, Search, PenSquare, ArrowRight, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CATEGORIES = [
  { value: 'all', label: 'All Articles' },
  { value: 'career-advice', label: 'Career Advice' },
  { value: 'exam-prep', label: 'Exam Prep' },
  { value: 'research-insight', label: 'Research Insights' },
  { value: 'skills', label: 'Skills' },
  { value: 'regulatory', label: 'Regulatory' },
];

type Article = (typeof blogData.articles)[0];

function getCategoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function getCategoryColor(cat: string) {
  switch (cat) {
    case 'career-advice':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    case 'exam-prep':
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    case 'research-insight':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    case 'skills':
      return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800';
    case 'regulatory':
      return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} data-testid={`link-blog-${article.slug}`}>
      <Card className="h-full group hover:border-primary/50 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col">
        {/* Emoji cover strip */}
        <div className="h-2 w-full rounded-t-lg bg-gradient-to-r from-primary/30 to-primary/10" />
        <CardHeader className="pb-3 flex-1">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className={`text-xs font-medium ${getCategoryColor(article.category)}`}
            >
              {getCategoryLabel(article.category)}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </span>
          </div>
          <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-3">
            <span className="mr-2">{article.coverEmoji}</span>
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{article.author}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 shrink-0" />
                {format(parseISO(article.date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardFooter>
      </Card>
    </Link>
  );
}

export default function BlogPage() {
  useDocumentMeta(
    'Blog',
    'Career insights, exam strategies, and research highlights for biomedical engineering students.'
  );
  useScrollTop();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return blogData.articles.filter((a) => {
      const matchCat = category === 'all' || a.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  // featured = most recent
  const featured = blogData.articles[0];
  const rest = filtered.filter((a) => a.slug !== featured.slug || category !== 'all' || search);
  const showFeatured = category === 'all' && !search;

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-20 pb-12 bg-card border-b border-border">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <PenSquare className="w-4 h-4" />
              Student Community Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              ILMA Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Career insights, exam strategies, and research perspectives written by and for
              biomedical engineering students.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {showFeatured && (
        <section className="py-10 bg-muted/30 border-b border-border">
          <div className="container px-4 md:px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Featured Article
            </p>
            <Link href={`/blog/${featured.slug}`} data-testid="link-blog-featured">
              <div className="group rounded-2xl border border-border bg-background p-6 md:p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-5xl select-none">
                  {featured.coverEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${getCategoryColor(featured.category)}`}
                    >
                      {getCategoryLabel(featured.category)}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {featured.readTime} min read
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{featured.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(featured.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary">
                      Read article <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Filters + Grid */}
      <section className="py-12 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-blog-search"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-blog-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No articles match your search.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showFeatured ? rest : filtered).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
