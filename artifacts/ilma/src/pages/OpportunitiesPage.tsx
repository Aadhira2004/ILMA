import React, { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { SearchBar } from '@/components/shared/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink, MapPin, CalendarClock, Users, ShieldCheck } from 'lucide-react';
import opportunitiesData from '@/data/opportunities.json';

// Schema is intentionally broad so future filters (country, domain, deadline) can be added
// without changing the data shape or this component's contract.
export interface Opportunity {
  id: string;
  title: string;
  type:
    | 'Internship'
    | 'Job Platform'
    | 'Research'
    | 'Scholarship'
    | 'Fellowship'
    | 'Competition'
    | 'Hackathon'
    | 'Conference'
    | 'Workshop'
    | 'Mentorship';
  organization: string;
  description: string;
  region: string;
  mode: 'Remote' | 'On-site' | 'Hybrid' | 'Varies';
  typicalTiming: string;
  eligibility: string;
  officialUrl: string;
  relatedDomains: string[];
  // Optional fields reserved for future filters — safe to omit today.
  country?: string;
  deadline?: string;
}

export default function OpportunitiesPage() {
  useDocumentMeta(
    'Global Opportunities',
    'Discover real internships, scholarships, fellowships, competitions, and conferences for biomedical students worldwide.'
  );
  useScrollTop();

  const opportunities = opportunitiesData as Opportunity[];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeMode, setActiveMode] = useState('All');

  const types = useMemo(() => {
    const unique = Array.from(new Set(opportunities.map((o) => o.type))).sort();
    return ['All', ...unique];
  }, [opportunities]);

  const modes = useMemo(() => {
    const unique = Array.from(new Set(opportunities.map((o) => o.mode))).sort();
    return ['All', ...unique];
  }, [opportunities]);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        o.title.toLowerCase().includes(query) ||
        o.organization.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query) ||
        o.region.toLowerCase().includes(query);

      const matchesType = activeType === 'All' || o.type === activeType;
      const matchesMode = activeMode === 'All' || o.mode === activeMode;

      return matchesSearch && matchesType && matchesMode;
    });
  }, [searchQuery, activeType, activeMode, opportunities]);

  const isFiltering = searchQuery.trim() !== '' || activeType !== 'All' || activeMode !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveType('All');
    setActiveMode('All');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Subtle dot background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        ></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
              <Globe className="w-4 h-4" />
              Worldwide, All Career Stages
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Global Opportunities</h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Real internships, scholarships, fellowships, competitions, and conferences for biomedical
              students around the world. Every listing links straight to its official source—use the
              timing guidance to plan ahead, then confirm current dates on the organizer's site.
            </p>

            <SearchBar
              placeholder="Search opportunities, organizations, or regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl mb-10 shadow-md"
            />

            {/* Type Filter Pills */}
            <div className="w-full mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Filter by type
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeType === type
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-background border border-border text-foreground hover:bg-accent hover:border-primary/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Filter Pills */}
            <div className="w-full">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Filter by mode
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {modes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeMode === mode
                        ? 'bg-secondary text-secondary-foreground shadow-md scale-105'
                        : 'bg-background border border-border text-foreground hover:bg-accent hover:border-secondary/20'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 md:py-24 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6 max-w-6xl">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filtered.length} {filtered.length === 1 ? 'Opportunity' : 'Opportunities'} Found
            </h2>
            {isFiltering && (
              <button onClick={clearFilters} className="text-primary font-medium text-sm hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((opportunity) => (
                  <motion.div
                    key={opportunity.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                  >
                    <a
                      href={opportunity.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full group"
                      data-testid={`link-opportunity-${opportunity.id}`}
                    >
                      <Card className="h-full flex flex-col border-border/60 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 font-medium">
                              {opportunity.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="font-normal text-xs border-border/60 bg-muted/30 text-muted-foreground"
                            >
                              {opportunity.mode}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors">
                            {opportunity.title}
                          </CardTitle>
                          <CardDescription className="font-medium text-foreground/70">
                            {opportunity.organization}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-grow space-y-4">
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                            {opportunity.description}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                              <span>{opportunity.region}</span>
                            </div>
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <CalendarClock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                              <span>{opportunity.typicalTiming}</span>
                            </div>
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <Users className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                              <span>{opportunity.eligibility}</span>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-2">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline">
                            Visit official site
                            <ExternalLink className="w-4 h-4" />
                          </span>
                        </CardFooter>
                      </Card>
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-muted-foreground mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No opportunities found</h3>
              <p className="text-muted-foreground">Try adjusting your search, type, or mode filter.</p>
              <button onClick={clearFilters} className="mt-4 text-primary font-medium hover:underline">
                Clear all filters
              </button>
            </div>
          )}

          {/* Official-source note */}
          <div className="mt-12 flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-5 text-sm text-muted-foreground max-w-3xl">
            <ShieldCheck className="w-5 h-5 mt-0.5 flex-shrink-0 text-secondary" />
            <p className="leading-relaxed">
              Every listing links directly to the organization's official website. ILMA does not process
              applications or collect fees. Dates, eligibility, and funding change over time—always confirm
              the latest details on the official source before applying.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
