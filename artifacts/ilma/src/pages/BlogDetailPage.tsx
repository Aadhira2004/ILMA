import React from 'react';
import { Link, useParams } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import blogData from '@/data/blog.json';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import NotFound from '@/pages/not-found';

const CATEGORY_COLORS: Record<string, string> = {
  'career-advice':
    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  'exam-prep':
    'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  'research-insight':
    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  skills:
    'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800',
  regulatory:
    'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
};

const CATEGORY_LABELS: Record<string, string> = {
  'career-advice': 'Career Advice',
  'exam-prep': 'Exam Prep',
  'research-insight': 'Research Insights',
  skills: 'Skills',
  regulatory: 'Regulatory',
};

type ContentBlock = { type: string; text: string };

function renderBlock(block: ContentBlock, idx: number) {
  if (block.type === 'heading') {
    return (
      <h2
        key={idx}
        className="text-xl md:text-2xl font-bold tracking-tight mt-10 mb-4 text-foreground"
      >
        {block.text}
      </h2>
    );
  }
  return (
    <p key={idx} className="text-base md:text-lg leading-relaxed text-foreground/80 mb-5">
      {block.text}
    </p>
  );
}

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const article = blogData.articles.find((a) => a.slug === params.slug);

  useDocumentMeta(
    article ? article.title : 'Article Not Found',
    article ? article.excerpt : ''
  );
  useScrollTop();

  if (!article) return <NotFound />;

  const related = blogData.articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 2);

  const allOther = blogData.articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2 - related.length);

  const suggestions = [...related, ...allOther].slice(0, 2);

  const catColor = CATEGORY_COLORS[article.category] ?? '';
  const catLabel = CATEGORY_LABELS[article.category] ?? article.category;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30 pt-[72px]">
        <div className="container px-4 md:px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground/70">{article.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline" className={`text-xs font-medium ${catColor}`}>
              {catLabel}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" /> {article.readTime} min read
            </span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl md:text-6xl select-none" aria-hidden>
              {article.coverEmoji}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {article.title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">{article.excerpt}</p>

          {/* Author card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/60 border border-border">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">{article.author}</p>
              <p className="text-sm text-muted-foreground">{article.authorRole}</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <Calendar className="h-3 w-3" />
                {format(parseISO(article.date), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12 bg-background">
        <div className="container px-4 md:px-6 max-w-3xl">
          {article.content.map((block, i) => renderBlock(block as ContentBlock, i))}

          <Separator className="my-10" />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-10">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Back button */}
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </article>

      {/* Related articles */}
      {suggestions.length > 0 && (
        <section className="py-12 bg-muted/30 border-t border-border">
          <div className="container px-4 md:px-6 max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight mb-6">More to Read</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  data-testid={`link-related-${rel.slug}`}
                >
                  <Card className="h-full group hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl select-none">{rel.coverEmoji}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${CATEGORY_COLORS[rel.category] ?? ''}`}
                        >
                          {CATEGORY_LABELS[rel.category] ?? rel.category}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {rel.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{rel.author}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
