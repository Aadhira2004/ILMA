import React from 'react';
import { useRoute, Link, useParams } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import domainsData from '@/data/domains.json';
import careersData from '@/data/careers.json';
import { Domain, Career } from '@/types';
import * as Icons from 'lucide-react';
import { ArrowLeft, BookOpen, Layers, Lightbulb, Target, BookMarked, Award, Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DomainDetailPage() {
  const params = useParams();
  const domainId = params.id;
  
  useScrollTop();

  const domain = (domainsData as Domain[]).find(d => d.id === domainId);
  const careers = careersData as Career[];

  useDocumentMeta(domain ? domain.name : 'Domain Not Found');

  if (!domain) {
    return (
      <Layout>
        <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Domain Not Found</h1>
          <p className="text-muted-foreground mb-8">The biomedical domain you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/domains">Back to Domains</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const Icon = (Icons as any)[domain.icon] || Icons.Box;

  // Find related domains
  const relatedDomainsList = (domainsData as Domain[]).filter(d => domain.relatedDomains.includes(d.id));

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="py-16 md:py-24 relative overflow-hidden text-white"
        style={{ backgroundColor: domain.color }}
      >
        <div className="absolute inset-0 bg-black/20" /> {/* Darken overlay for better text contrast */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <Link href="/domains" className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Domains
          </Link>
          
          <div className="max-w-4xl">
            <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{domain.name}</h1>
            <p className="text-xl md:text-2xl font-medium text-white/90 mb-8">{domain.tagline}</p>
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
              {domain.overview}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Applications */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Real-World Applications
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {domain.applications.map((app, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card flex items-center gap-3 shadow-sm">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: domain.color }} />
                      <span className="font-medium">{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Subjects & Skills */}
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Core Subjects
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {domain.coreSubjects.map((subject, i) => (
                      <Badge key={i} variant="outline" className="text-sm py-1.5 px-3 bg-background">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Essential Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {domain.skillsRequired.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Opportunities */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Network className="w-6 h-6 text-primary" />
                  Career Pathways
                </h2>
                <div className="space-y-4">
                  {domain.careerOpportunities.map((careerId) => {
                    const linkedCareer = careers.find(c => c.id === careerId);
                    if (!linkedCareer) return null;
                    return (
                      <Link key={careerId} href={`/careers/${careerId}`} className="block group">
                        <div className="flex items-center justify-between p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all">
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{linkedCareer.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{linkedCareer.shortDescription}</p>
                          </div>
                          <ArrowLeft className="w-5 h-5 rotate-180 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Future Scope */}
              <div className="p-8 rounded-3xl bg-accent border border-primary/10 relative">
                <div className="absolute top-4 right-4 text-primary/10">
                  <Icons.Rocket className="w-24 h-24" />
                </div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 relative z-10">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  Future Scope
                </h2>
                <p className="text-lg leading-relaxed text-foreground/90 relative z-10">
                  {domain.futureScope}
                </p>
              </div>

            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              
              {/* Industries */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icons.Factory className="w-5 h-5 text-primary" />
                  Primary Industries
                </h3>
                <ul className="space-y-3">
                  {domain.industries.map((ind, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                      <span className="font-medium text-foreground/80">{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Books */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-primary" />
                  Recommended Reading
                </h3>
                <div className="space-y-4">
                  {domain.recommendedBooks.map((book, i) => (
                    <div key={i} className="pt-4 border-t border-border first:pt-0 first:border-0">
                      <h4 className="font-bold text-sm leading-tight mb-1">{book.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium mb-2">by {book.author}</p>
                      <p className="text-xs text-foreground/70 leading-relaxed">{book.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Relevant Certifications
                </h3>
                <ul className="space-y-3">
                  {domain.certifications.map((cert, i) => (
                    <li key={i} className="text-sm font-medium flex items-start gap-2 text-foreground/80">
                      <Icons.Check className="w-4 h-4 shrink-0 text-green-500 mt-0.5" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Domains */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold mb-4">Related Domains</h3>
                <div className="flex flex-col gap-3">
                  {relatedDomainsList.map((relDomain) => {
                    const RelIcon = (Icons as any)[relDomain.icon] || Icons.Box;
                    return (
                      <Link key={relDomain.id} href={`/domains/${relDomain.id}`} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors border border-transparent hover:border-border">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${relDomain.color}20`, color: relDomain.color }}>
                          <RelIcon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">{relDomain.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
