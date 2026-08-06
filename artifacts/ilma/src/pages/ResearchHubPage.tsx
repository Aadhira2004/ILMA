import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import researchData from '@/data/research.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, FileText, Lightbulb, Mail, ExternalLink, ArrowRight, BrainCircuit } from 'lucide-react';

export default function ResearchHubPage() {
  useDocumentMeta('Undergrad Research Hub', 'A starter guide for biomedical engineering undergraduates getting into research.');
  useScrollTop();

  const { howToReadAPaper, topJournals, preprintServers, projectIdeas, professorOutreach } = researchData;

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Layout>
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Subtle graph background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              Undergrad Survival Guide
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Research Hub</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Research isn't magic—it's a process. Learn how to dissect academic papers, find your first project idea, and land a position in a university lab.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6 max-w-6xl">
          
          {/* Section 1: How to read a paper */}
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">How to Read a Scientific Paper</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
              Nobody reads academic papers from start to finish like a novel. Use this four-pass method to save time and extract what actually matters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {howToReadAPaper.map((step) => (
                <Card key={step.step} className="border-border/60 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black italic -mt-6 -mr-4 group-hover:opacity-10 transition-opacity duration-300 text-primary pointer-events-none">
                    {step.step}
                  </div>
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-muted text-muted-foreground hover:bg-muted font-semibold tracking-wider">
                      PASS {step.step}
                    </Badge>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Section 2: Projects */}
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Starter Project Ideas</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
              Don't wait for permission to build something. These projects are feasible on an undergrad budget and prove you have hands-on skills.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectIdeas.map((project, idx) => (
                <Card key={idx} className="flex flex-col hover:shadow-md transition-shadow border-border/60" data-testid={`card-project-${idx}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="font-normal text-xs uppercase tracking-wider border-border/60 bg-muted/30">
                        {project.domain}
                      </Badge>
                      <Badge variant="secondary" className={`font-medium ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Section 3: Journals & Preprints */}
          <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Top Journals</h2>
              </div>
              <div className="space-y-4">
                {topJournals.map((journal, idx) => (
                  <a key={idx} href={journal.url} target="_blank" rel="noopener noreferrer" className="block group" data-testid={`link-journal-${idx}`}>
                    <Card className="hover:border-primary/50 transition-colors shadow-sm bg-muted/10">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{journal.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{journal.focus}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Preprint Servers</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Where researchers upload papers <em>before</em> peer review. Great for seeing the bleeding edge.
              </p>
              <div className="space-y-4">
                {preprintServers.map((server, idx) => (
                  <a key={idx} href={server.url} target="_blank" rel="noopener noreferrer" className="block group" data-testid={`link-preprint-${idx}`}>
                    <Card className="hover:border-primary/50 transition-colors shadow-sm bg-muted/10">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{server.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{server.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-16" />

          {/* Section 4: Emailing Professors */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">How to Email a Professor</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
              Securing an undergrad research spot comes down to persistence and sending emails that don't sound like spam. Follow these rules.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professorOutreach.map((tip, idx) => (
                <Card key={idx} className="border-l-4 border-l-secondary border-y-border/60 border-r-border/60 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-secondary" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
