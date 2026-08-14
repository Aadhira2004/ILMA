import React, { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, ClipboardCheck, CalendarClock, Lightbulb, Globe2, Wallet, Sparkles, ExternalLink } from 'lucide-react';
import higherStudiesData from '@/data/higherStudies.json';

interface FundingProgram {
  name: string;
  description: string;
  url: string;
}

interface Country {
  id: string;
  name: string;
  flag: string;
  overview: string;
  admissionNotes: string;
  fundingNotes: FundingProgram[];
  strengths: string[];
}

interface StudyLevel {
  id: string;
  title: string;
  tagline: string;
  description: string;
  typicalRequirements: string[];
  timeline: string;
  tips: string[];
}

export default function HigherStudiesPage() {
  useDocumentMeta(
    'Higher Studies',
    'A global guide to biomedical higher studies—from Bachelor\'s to Postdoc—with country landscapes, admissions, and real scholarship programs.'
  );
  useScrollTop();

  const { studyLevels, countries } = higherStudiesData as {
    studyLevels: StudyLevel[];
    countries: Country[];
  };

  const [activeCountry, setActiveCountry] = useState<string>(countries[0]?.id ?? '');

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === activeCountry) ?? countries[0],
    [activeCountry, countries]
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
              <GraduationCap className="w-4 h-4" />
              Study Anywhere in the World
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Higher Studies</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From your first Bachelor's to a postdoc, planning your path in biomedical fields is easier when you
              understand the levels, the requirements, and where in the world to study. This is a global map—not a
              guide to any single country.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6 max-w-6xl">

          {/* Study Levels */}
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Levels of Study</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-10 max-w-3xl">
              Each stage builds on the last. Understand what a level involves, what it typically asks of you, and how
              to time your applications before you commit.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {studyLevels.map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: (index % 2) * 0.05 }}
                >
                  <Card className="h-full border-border/60 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-level-${level.id}`}>
                    <CardHeader className="pb-3">
                      <Badge variant="outline" className="w-fit mb-2 font-normal text-xs uppercase tracking-wider border-border/60 bg-muted/30">
                        {level.tagline}
                      </Badge>
                      <CardTitle className="text-xl">{level.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <p className="text-muted-foreground leading-relaxed">{level.description}</p>

                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                          <ClipboardCheck className="w-4 h-4 text-primary" />
                          Typical Requirements
                        </h3>
                        <ul className="space-y-1.5">
                          {level.typicalRequirements.map((req, i) => (
                            <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/50" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                          <CalendarClock className="w-4 h-4 text-secondary" />
                          Application Timeline
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{level.timeline}</p>
                      </div>

                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Tips
                        </h3>
                        <ul className="space-y-1.5">
                          {level.tips.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary/50" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Study Destinations */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                <Globe2 className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Study Destinations</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
              Every country has its own strengths, admission routes, and funding. Pick a destination to explore its
              biomedical study landscape and the real scholarship programs that can fund your journey.
            </p>

            {/* Country filter pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => setActiveCountry(country.id)}
                  aria-pressed={activeCountry === country.id}
                  data-testid={`pill-country-${country.id}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeCountry === country.id
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'bg-background border border-border text-foreground hover:bg-accent hover:border-primary/20'
                  }`}
                >
                  <span aria-hidden="true">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            {selectedCountry && (
              <motion.div
                key={selectedCountry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm overflow-hidden" data-testid={`card-country-${selectedCountry.id}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl leading-none" aria-hidden="true">{selectedCountry.flag}</span>
                      <div>
                        <CardTitle className="text-2xl">{selectedCountry.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Biomedical study landscape</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <p className="text-muted-foreground leading-relaxed">{selectedCountry.overview}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
                          <ClipboardCheck className="w-4 h-4 text-primary" />
                          Admission Notes
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{selectedCountry.admissionNotes}</p>
                      </div>

                      <div>
                        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
                          <Sparkles className="w-4 h-4 text-secondary" />
                          Notable Strengths
                        </h3>
                        <ul className="space-y-1.5">
                          {selectedCountry.strengths.map((strength, i) => (
                            <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary/50" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground mb-4">
                        <Wallet className="w-4 h-4 text-emerald-500" />
                        Funding &amp; Scholarships
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCountry.fundingNotes.map((program, i) => (
                          <a
                            key={i}
                            href={program.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                            data-testid={`link-funding-${selectedCountry.id}-${i}`}
                          >
                            <Card className="h-full hover:border-primary/50 transition-colors shadow-sm bg-muted/10">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{program.name}</h4>
                                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{program.description}</p>
                              </CardContent>
                            </Card>
                          </a>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
