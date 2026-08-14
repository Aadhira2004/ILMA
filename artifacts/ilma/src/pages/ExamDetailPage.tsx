import React from 'react';
import { useRoute, Link, useParams } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import examsData from '@/data/exams.json';
import careersData from '@/data/careers.json';
import domainsData from '@/data/domains.json';
import { Exam, Career, Domain } from '@/types';
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/react';
import { useRecordView } from '@workspace/api-client-react';
import { BookmarkButton } from '@/components/shared/BookmarkButton';
import * as Icons from 'lucide-react';
import { ArrowLeft, Building2, Globe, FileText, Clock, Target, AlertCircle, BookOpen, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.id;
  const { isSignedIn } = useAuth();
  
  useScrollTop();

  const exam = (examsData as Exam[]).find(e => e.id === examId);

  useDocumentMeta(exam ? exam.name : 'Exam Not Found');

  const recordViewMutation = useRecordView();
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (isSignedIn && exam && !hasRecorded.current) {
      hasRecorded.current = true;
      recordViewMutation.mutate({
        data: {
          itemType: 'exam',
          itemId: exam.id,
          title: exam.name
        }
      });
    }
  }, [isSignedIn, exam, recordViewMutation]);

  if (!exam) {
    return (
      <Layout>
        <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Exam Not Found</h1>
          <p className="text-muted-foreground mb-8">The exam details you're looking for don't exist.</p>
          <Button asChild>
            <Link href="/exams">Back to Exams</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const Icon = (Icons as any)[exam.icon] || Icons.FileText;

  const careers = careersData as Career[];
  const domains = domainsData as Domain[];

  const relatedCareers = (exam.relatedCareers ?? [])
    .map((id) => careers.find((c) => c.id === id))
    .filter((c): c is Career => Boolean(c));
  const relatedDomains = (exam.relatedDomains ?? [])
    .map((id) => domains.find((d) => d.id === id))
    .filter((d): d is Domain => Boolean(d));

  const detailItems: { label: string; value?: string }[] = [
    { label: 'Purpose', value: exam.purpose },
    { label: 'Education Level', value: exam.educationLevel },
    { label: 'Application Process', value: exam.applicationProcess },
    { label: 'Validity', value: exam.validity },
    { label: 'International Recognition', value: exam.internationalRecognition },
    { label: 'Higher-Study Relevance', value: exam.higherStudyRelevance },
  ].filter((item) => Boolean(item.value));

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-card border-b border-border py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <Link href="/exams" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exams
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground" data-testid={`text-title-${exam.id}`}>{exam.name}</h1>
                    <BookmarkButton itemType="exam" itemId={exam.id} title={exam.name} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={
                      exam.category === 'National' ? 'border-blue-500/30 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' :
                      exam.category === 'Defense / Research' ? 'border-green-500/30 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' :
                      'border-orange-500/30 text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                    }>
                      {exam.category}
                    </Badge>
                    {exam.country && (
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                        <Globe className="w-3 h-3 mr-1" />
                        {exam.country}
                      </Badge>
                    )}
                    {exam.qualificationType && (
                      <Badge variant="secondary" className="font-normal text-muted-foreground bg-accent">
                        {exam.qualificationType}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mt-6">
                {exam.overview}
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col gap-4 bg-background p-6 rounded-2xl border border-border shadow-sm shrink-0 min-w-[280px]">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Conducted By
                </p>
                <p className="font-bold text-foreground">{exam.conductedBy}</p>
              </div>
              <div className="w-full h-px bg-border" />
              <div>
                <Button asChild className="w-full">
                  <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" /> Official Website
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-12">

              {/* Qualification Details */}
              {detailItems.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Icons.Info className="w-6 h-6 text-primary" />
                    About This Qualification
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {detailItems.map((item, i) => (
                      <div key={i} className="p-5 rounded-xl border border-border bg-card">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">{item.label}</p>
                        <p className="text-foreground/90 leading-relaxed text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Pattern */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Exam Pattern
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                    <div className="p-2 bg-accent rounded-lg text-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Duration</p>
                      <p className="font-bold">{exam.examPattern.duration}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                    <div className="p-2 bg-accent rounded-lg text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Marks</p>
                      <p className="font-bold">{exam.examPattern.totalMarks}</p>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4 rounded-tl-xl">Section</th>
                        <th className="px-6 py-4 rounded-tr-xl text-right">Marks / Weightage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {exam.examPattern.sections.map((sec, i) => (
                        <tr key={i} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{sec.name}</td>
                          <td className="px-6 py-4 text-right font-bold text-primary">{sec.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {exam.examPattern.questionTypes.map((type, i) => (
                    <Badge key={i} variant="secondary" className="font-normal text-muted-foreground bg-accent py-1">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Syllabus Accordion */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Detailed Syllabus
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {exam.syllabus.map((sec, i) => (
                    <AccordionItem key={i} value={`sec-${i}`} className="bg-card border border-border mb-3 rounded-xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline font-bold text-lg border-0 py-4">
                        {sec.section}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {sec.topics.map((topic, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                              <span className="leading-snug">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Preparation Tips */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Icons.Lightbulb className="w-6 h-6 text-primary" />
                  Preparation Strategies
                </h2>
                <div className="space-y-4">
                  {exam.preparationTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                        {i + 1}
                      </div>
                      <p className="text-foreground/90 leading-relaxed pt-1">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Eligibility & Age */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Eligibility Criteria
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {exam.eligibility}
                  </p>
                </div>
                <div className="w-full h-px bg-border" />
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Age Limit
                  </h3>
                  <p className="text-foreground font-medium bg-accent px-3 py-2 rounded-lg border border-primary/10">
                    {exam.ageLimit}
                  </p>
                </div>
              </div>

              {/* Career Opportunities */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Career Opportunities
                </h3>
                <ul className="space-y-3">
                  {exam.careerOpportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                      <span className="font-medium text-sm text-foreground/80 leading-snug">{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Books */}
              <div className="p-6 rounded-2xl bg-accent border border-primary/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Recommended Books
                </h3>
                <div className="space-y-4">
                  {exam.recommendedBooks.map((book, i) => (
                    <div key={i} className="pt-3 border-t border-primary/10 first:pt-0 first:border-0">
                      <h4 className="font-bold text-sm leading-tight text-foreground">{book.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium mt-1">by {book.author}</p>
                      {book.subject && <span className="inline-block mt-2 px-2 py-0.5 bg-background text-xs font-medium rounded-md border border-border">{book.subject}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Careers */}
              {relatedCareers.length > 0 && (
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Related Careers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedCareers.map((career) => (
                      <Link
                        key={career.id}
                        href={`/careers/${career.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-accent border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                      >
                        {career.name}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Domains */}
              {relatedDomains.length > 0 && (
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Related Domains
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedDomains.map((domain) => (
                      <Link
                        key={domain.id}
                        href={`/domains/${domain.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-accent border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                      >
                        {domain.name}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Last Verified Note */}
              {exam.lastVerified && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Last verified: Aug 2026 — always confirm the latest details on the official website.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}