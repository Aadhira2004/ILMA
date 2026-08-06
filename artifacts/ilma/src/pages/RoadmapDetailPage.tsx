import React from 'react';
import { Link, useParams } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import roadmapsData from '@/data/roadmaps.json';
import { Roadmap, RoadmapPhase } from '@/types';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRecordView, useListProgress, useToggleProgress, getListProgressQueryKey } from '@workspace/api-client-react';
import { BookmarkButton } from '@/components/shared/BookmarkButton';
import { Checkbox } from '@/components/ui/checkbox';
import * as Icons from 'lucide-react';
import { ArrowLeft, Clock, Code2, Link as LinkIcon, BookOpen, MonitorPlay, Award, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RoadmapDetailPage() {
  const params = useParams();
  const roadmapId = params.id;
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  
  useScrollTop();

  const roadmap = (roadmapsData as Roadmap[]).find(r => r.id === roadmapId);

  useDocumentMeta(roadmap ? `${roadmap.title} Roadmap` : 'Roadmap Not Found');

  const recordViewMutation = useRecordView();
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (isSignedIn && roadmap && !hasRecorded.current) {
      hasRecorded.current = true;
      recordViewMutation.mutate({
        data: {
          itemType: 'roadmap',
          itemId: roadmap.id,
          title: roadmap.title
        }
      });
    }
  }, [isSignedIn, roadmap, recordViewMutation]);

  const { data: progress } = useListProgress({
    query: {
      enabled: !!isSignedIn,
      queryKey: getListProgressQueryKey()
    }
  });

  const toggleProgress = useToggleProgress({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProgressQueryKey() });
      }
    }
  });

  const getPhaseProgress = (phaseName: string, topicsLength: number) => {
    if (!progress || topicsLength === 0) return 0;
    const completedInPhase = progress.filter(p => p.roadmapId === roadmapId && p.phase === phaseName).length;
    return Math.round((completedInPhase / topicsLength) * 100);
  };

  if (!roadmap) {
    return (
      <Layout>
        <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Roadmap Not Found</h1>
          <p className="text-muted-foreground mb-8">The skill roadmap you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/roadmaps">Back to Roadmaps</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const Icon = (Icons as any)[roadmap.icon] || Icons.Map;

  const renderPhase = (phase: RoadmapPhase, phaseNumber: number, phaseName: string) => {
    const phaseProgress = getPhaseProgress(phaseName, phase.topics.length);
    
    return (
    <div className="relative pl-8 md:pl-0">
      {/* Mobile timeline line */}
      <div className="md:hidden absolute left-[11px] top-10 bottom-[-4rem] w-[2px] bg-border z-0" />
      
      <div className="md:grid md:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Phase Header (Left col on Desktop) */}
        <div className="md:col-span-3 md:text-right mb-6 md:mb-0 relative">
          {/* Mobile dot */}
          <div className="md:hidden absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-background border-4 border-primary z-10" />
          
          <h2 className="text-2xl font-bold text-foreground capitalize mb-1">{phaseName}</h2>
          <p className="text-lg font-medium text-primary mb-2">{phase.title}</p>
          <div className="flex flex-col gap-2 md:items-end">
            <div className="inline-flex items-center text-sm font-medium text-muted-foreground bg-accent px-3 py-1 rounded-full w-fit">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {phase.duration}
            </div>
            {isSignedIn && (
              <div className="text-sm font-medium text-primary mt-1" data-testid={`text-progress-${phaseName}`}>
                {phaseProgress}% Complete
              </div>
            )}
          </div>
        </div>

        {/* Desktop timeline node */}
        <div className="hidden md:flex flex-col items-center col-span-2 relative">
          <div className="w-12 h-12 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center z-10 shadow-sm relative">
            {phaseNumber}
          </div>
          {/* Line to next node (hidden on last item via CSS in parent) */}
          <div className="absolute top-12 bottom-[-8rem] w-1 bg-gradient-to-b from-primary via-border to-border phase-line" />
        </div>

        {/* Phase Content (Right col on Desktop) */}
        <div className="md:col-span-7 bg-card border border-border p-6 md:p-8 rounded-3xl shadow-sm mb-12">
          
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Topics to Master
            </h3>
            <ul className="space-y-3">
              {phase.topics.map((topic, i) => {
                const isCompleted = progress?.some(p => p.roadmapId === roadmapId && p.phase === phaseName && p.topicIndex === i) ?? false;
                
                return (
                  <li key={i} className="flex items-start gap-3">
                    {isSignedIn ? (
                      <Checkbox 
                        className="mt-1 shrink-0"
                        checked={isCompleted}
                        disabled={toggleProgress.isPending}
                        onCheckedChange={() => {
                          toggleProgress.mutate({
                            data: {
                              roadmapId: roadmapId as string,
                              phase: phaseName as any,
                              topicIndex: i
                            }
                          });
                        }}
                        data-testid={`checkbox-topic-${phaseName}-${i}`}
                      />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2 shrink-0" />
                    )}
                    <span className={`text-foreground/90 font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>{topic}</span>
                  </li>
                );
              })}
            </ul>
            {!isSignedIn && (
              <p className="text-xs text-muted-foreground mt-4 italic">Sign in to track your progress.</p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-primary" />
              Learning Resources
            </h3>
            <div className="flex flex-col gap-3">
              {phase.resources.map((res, i) => (
                <a key={i} href={res.url || '#'} {...(res.url ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`flex items-center gap-3 p-3 rounded-xl border ${res.url ? 'border-border hover:border-primary/50 hover:bg-accent transition-colors' : 'border-dashed border-border opacity-70 cursor-default'}`}>
                  {res.type === 'free' ? <MonitorPlay className="w-4 h-4 text-primary" /> : <BookOpen className="w-4 h-4 text-amber-500" />}
                  <span className="font-medium text-sm flex-1">{res.name}</span>
                  {res.url && <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />}
                </a>
              ))}
            </div>
          </div>

          <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Capstone Project
            </h3>
            <p className="font-medium text-foreground">{phase.project}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-card border-b border-border overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <Link href="/roadmaps" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roadmaps
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="p-4 rounded-2xl shrink-0"
                  style={{ backgroundColor: `${roadmap.color}15`, color: roadmap.color }}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground" data-testid={`text-title-${roadmap.id}`}>{roadmap.title}</h1>
                  <BookmarkButton itemType="roadmap" itemId={roadmap.id} title={roadmap.title} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {roadmap.careerApplications.map((app, i) => (
                  <Badge key={i} variant="secondary" className="bg-background border border-border text-foreground font-medium py-1.5 px-3">
                    {app}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="shrink-0 bg-background border border-border p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Time</p>
                <p className="font-bold text-foreground text-lg">{roadmap.estimatedTimeline}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          
          {/* Timeline CSS hiding last line */}
          <style>{`
            .roadmap-timeline > div:last-child .phase-line { display: none; }
            .roadmap-timeline > div:last-child .md\\:hidden.absolute.left-\\[11px\\] { display: none; }
          `}</style>

          <div className="max-w-5xl mx-auto roadmap-timeline">
            {renderPhase(roadmap.beginner, 1, 'beginner')}
            {renderPhase(roadmap.intermediate, 2, 'intermediate')}
            {renderPhase(roadmap.advanced, 3, 'advanced')}
          </div>
          
        </div>
      </section>

      {/* Extra Info Section */}
      <section className="py-16 border-t border-border bg-card">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Advanced Projects */}
            <div className="p-8 rounded-3xl bg-background border border-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-primary" />
                Portfolio Projects
              </h2>
              <div className="space-y-6">
                {roadmap.projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold">{proj.name}</h3>
                      <Badge variant="outline" className={
                        proj.difficulty === 'advanced' ? 'text-red-500 border-red-200 bg-red-50' : 
                        proj.difficulty === 'intermediate' ? 'text-amber-500 border-amber-200 bg-amber-50' : 
                        'text-green-500 border-green-200 bg-green-50'
                      }>
                        {proj.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="p-8 rounded-3xl bg-background border border-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Industry Certifications
              </h2>
              <p className="text-muted-foreground mb-6">
                Once you complete this roadmap, you'll be well-prepared to tackle these recognized certifications to prove your skills to employers.
              </p>
              <ul className="space-y-4">
                {roadmap.certifications.map((cert, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 rounded-xl bg-accent border border-primary/10">
                    <Award className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-semibold text-foreground/90">{cert}</span>
                  </li>
                ))}
                {roadmap.certifications.length === 0 && (
                  <li className="text-sm text-muted-foreground italic">No specific certifications required for this domain—focus on building a strong project portfolio.</li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </section>

    </Layout>
  );
}
