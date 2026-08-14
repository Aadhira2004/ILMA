import React, { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { ExamCard } from '@/components/shared/ExamCard';
import { SearchBar } from '@/components/shared/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import examsData from '@/data/exams.json';
import { Exam } from '@/types';

export default function GovernmentExamsPage() {
  useDocumentMeta(
    'Global Exams & Qualifications',
    'Explore entrance exams, professional licensure, registrations, and certifications for biomedical careers worldwide.'
  );
  useScrollTop();

  const exams = examsData as Exam[];

  const countries = useMemo(() => {
    const unique = Array.from(
      new Set(exams.map((exam) => exam.country).filter((c): c is string => Boolean(c)))
    ).sort();
    return ['All', ...unique];
  }, [exams]);

  const qualificationTypes = useMemo(() => {
    const unique = Array.from(
      new Set(
        exams
          .map((exam) => exam.qualificationType)
          .filter((q): q is NonNullable<Exam['qualificationType']> => Boolean(q))
      )
    ).sort() as string[];
    return ['All', ...unique];
  }, [exams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCountry, setActiveCountry] = useState('All');
  const [activeType, setActiveType] = useState('All');

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        exam.name.toLowerCase().includes(query) ||
        exam.conductedBy.toLowerCase().includes(query) ||
        exam.overview.toLowerCase().includes(query) ||
        (exam.country ?? '').toLowerCase().includes(query) ||
        (exam.qualificationType ?? '').toLowerCase().includes(query);

      const matchesCountry = activeCountry === 'All' || exam.country === activeCountry;
      const matchesType = activeType === 'All' || exam.qualificationType === activeType;

      return matchesSearch && matchesCountry && matchesType;
    });
  }, [searchQuery, activeCountry, activeType, exams]);

  const isFiltering = searchQuery.trim() !== '' || activeCountry !== 'All' || activeType !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCountry('All');
    setActiveType('All');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Global Exams & Qualifications</h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              From university entrance and graduate admission to professional licensure, registration, and certifications—discover the exams and qualifications that shape biomedical careers around the world. Find syllabi, eligibility, and preparation strategies for each.
            </p>

            <SearchBar
              placeholder="Search exams, organizations, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl mb-8 shadow-md"
            />

            {/* Country Filter Pills */}
            <div className="w-full mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Country / Region</p>
              <div className="flex flex-wrap justify-center gap-2">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setActiveCountry(country)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeCountry === country
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-background border border-border text-foreground hover:bg-accent hover:border-primary/20'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* Qualification Type Filter Pills */}
            <div className="w-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Qualification Type</p>
              <div className="flex flex-wrap justify-center gap-2">
                {qualificationTypes.map((type) => (
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
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 md:py-24 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6">

          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredExams.length} {filteredExams.length === 1 ? 'Result' : 'Results'} Found
            </h2>
            {isFiltering && (
              <button
                onClick={clearFilters}
                className="text-primary font-medium text-sm hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredExams.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredExams.map((exam, index) => (
                  <motion.div key={exam.id} layout>
                    <ExamCard exam={exam} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-muted-foreground mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No exams found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
