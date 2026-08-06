import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import companiesData from '@/data/companies.json';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Briefcase, ExternalLink, Activity, Info, Zap } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  headquarters: string;
  focusAreas: string[];
  whatTheyBuild: string;
  whyItMatters: string;
  typicalRoles: string[];
  careersUrl: string;
}

export default function CompaniesPage() {
  useDocumentMeta('Top MedTech Companies', 'Explore leading medical technology and biomedical companies.');
  useScrollTop();

  const companies = companiesData as Company[];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Layout>
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl rounded-full"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">MedTech Explorer</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Discover the global leaders shaping the future of healthcare. Understand what they build, why their work matters, and where you might fit in.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {companies.map((company) => (
              <Card key={company.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/30" data-testid={`card-company-${company.id}`}>
                <CardHeader className="flex flex-row items-start gap-4 pb-4 bg-muted/10">
                  <Avatar className="w-16 h-16 rounded-xl border border-border/50 shadow-sm bg-background">
                    <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold rounded-xl">
                      {getInitials(company.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl font-bold truncate mb-1" title={company.name}>
                      {company.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm font-medium text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {company.headquarters}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow pt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-primary" /> Focus Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {company.focusAreas.map(area => (
                        <Badge key={area} variant="secondary" className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 font-medium">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-amber-500" /> What They Build
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {company.whatTheyBuild}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-500" /> Why It Matters
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {company.whyItMatters}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider mb-3 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-emerald-500" /> Typical Roles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {company.typicalRoles.map(role => (
                        <Badge key={role} variant="outline" className="font-normal border-border/60">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 pb-6 px-6 border-t border-border/40 mt-auto bg-muted/5">
                  <Button asChild variant="default" className="w-full group shadow-sm">
                    <a 
                      href={company.careersUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-testid={`link-careers-${company.id}`}
                    >
                      View Careers Page
                      <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
