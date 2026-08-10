import React from 'react';
import { useRoute, Link, useParams } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import careersData from '@/data/careers.json';
import { Career } from '@/types';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/react';
import { useRecordView } from '@workspace/api-client-react';
import { BookmarkButton } from '@/components/shared/BookmarkButton';
import * as Icons from 'lucide-react';
import { ArrowLeft, CheckCircle2, ChevronRight, Briefcase, Building2, GraduationCap, Award, ExternalLink, CalendarDays, TrendingUp, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CareerDetailPage() {
  const params = useParams();
  const careerId = params.id;
  const { isSignedIn } = useAuth();
  
  useScrollTop();

  const career = (careersData as Career[]).find(c => c.id === careerId);

  useDocumentMeta(career ? career.name : 'Career Not Found');

  const recordViewMutation = useRecordView();
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (isSignedIn && career && !hasRecorded.current) {
      hasRecorded.current = true;
      recordViewMutation.mutate({
        data: {
          itemType: 'career',
          itemId: career.id,
          title: career.name
        }
      });
    }
  }, [isSignedIn, career, recordViewMutation]);

  if (!career) {
    return (
      <Layout>
        <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Career Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find the career path you're looking for.</p>
          <Button asChild>
            <Link href="/careers">Back to Careers</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const Icon = (Icons as any)[career.icon] || Icons.Briefcase;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-card border-b border-border py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <Link href="/careers" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-accent text-primary rounded-2xl">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground" data-testid={`text-title-${career.id}`}>{career.name}</h1>
                    <BookmarkButton itemType="career" itemId={career.id} title={career.name} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-sm">
                      {career.category}
                    </Badge>
                    <div className="flex items-center px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium border border-amber-500/20">
                      <Icons.Star className="w-3.5 h-3.5 fill-current mr-1.5" />
                      {career.futureScopeRating} / 5 Future Scope
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mt-6">
                {career.shortDescription}
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-row md:flex-col gap-4 bg-background p-6 rounded-2xl border border-border shadow-sm shrink-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Average Salary (India)</p>
                <p className="text-2xl font-bold text-foreground">{career.salary}</p>
              </div>
              <div className="hidden md:block w-full h-px bg-border" />
              <div className="hidden md:block w-px h-full bg-border" />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Average Salary (Abroad)</p>
                <p className="text-2xl font-bold text-foreground">{career.salaryAbroad}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column (Main Info) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Overview
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {career.overview}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Key Responsibilities
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {career.responsibilities.map((req, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90 font-medium leading-snug">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Tools */}
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {career.skillsRequired.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-sm py-1.5 px-3 bg-background font-medium text-foreground/80">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4">Tools & Tech</h2>
                  <div className="flex flex-wrap gap-2">
                    {career.toolsUsed.map((tool, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3 bg-accent text-accent-foreground font-medium">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Growth Timeline */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Career Progression
                </h2>
                <div className="space-y-4">
                  {career.careerGrowth.map((stage, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-card border border-border relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20" />
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{stage.stage}</h3>
                        <p className="text-sm text-muted-foreground">{stage.years}</p>
                      </div>
                      <div className="text-right sm:text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-semibold text-sm">
                          {stage.salary}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day in the Life */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-primary" />
                  A Day in the Life
                </h2>
                <div className="p-6 md:p-8 rounded-3xl bg-accent border border-primary/10 text-foreground/90 leading-relaxed italic relative">
                  <span className="text-6xl text-primary/20 absolute top-4 left-4 font-serif leading-none">"</span>
                  <p className="relative z-10">{career.dayInLife}</p>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {career.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-left font-semibold text-lg">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

            </div>

            {/* Right Column (Sidebar Info) */}
            <div className="space-y-8">
              
              {/* Top Recruiters */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Top Recruiters
                </h3>
                <ul className="space-y-3">
                  {career.topRecruiters.map((recruiter, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="font-medium text-foreground/80">{recruiter}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industries */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icons.Factory className="w-5 h-5 text-primary" />
                  Industries
                </h3>
                <div className="flex flex-col gap-2">
                  {career.industries.map((ind, i) => (
                    <div key={i} className="px-3 py-2 rounded-lg bg-background border border-border text-sm font-medium">
                      {ind}
                    </div>
                  ))}
                </div>
              </div>

              {/* Higher Studies */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Higher Studies Path
                </h3>
                <ul className="space-y-3 text-sm font-medium text-foreground/80">
                  {career.higherStudies.map((study, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{study}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Valuable Certifications
                </h3>
                <ul className="space-y-3">
                  {career.certifications.map((cert, i) => (
                    <li key={i} className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                      <Icons.Check className="w-4 h-4 shrink-0 text-green-500" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Future Scope Box */}
              <div className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                <h3 className="text-lg font-bold mb-3 relative z-10 flex items-center gap-2">
                  <Icons.Rocket className="w-5 h-5" />
                  Future Scope
                </h3>
                <p className="text-primary-foreground/90 text-sm leading-relaxed relative z-10">
                  {career.futureScope}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
