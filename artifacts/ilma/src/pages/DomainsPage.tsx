import React, { useEffect, useMemo, useState } from 'react';
import { useSearch } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { DomainCard } from '@/components/shared/DomainCard';
import { SearchBar } from '@/components/shared/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import domainsData from '@/data/domains.json';
import { Domain } from '@/types';

export default function DomainsPage() {
  useDocumentMeta('Biomedical Domains', 'Explore specialized fields in biomedical engineering.');
  useScrollTop();

  const domains = domainsData as Domain[];

  const searchString = useSearch();

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(domains.map((domain) => domain.category).filter((c): c is string => Boolean(c)))
    ).sort();
    return ['All', ...unique];
  }, [domains]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Read ?category= from the URL (e.g. links from the homepage) and preselect it.
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const requested = params.get('category');
    if (requested && categories.includes(requested)) {
      setActiveCategory(requested);
    }
  }, [searchString, categories]);

  const filteredDomains = useMemo(() => {
    return domains.filter((domain) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        domain.name.toLowerCase().includes(query) ||
        domain.tagline.toLowerCase().includes(query) ||
        domain.overview.toLowerCase().includes(query);

      const matchesCategory = activeCategory === 'All' || domain.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, domains]);

  const isFiltering = searchQuery.trim() !== '' || activeCategory !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Biomedical Domains</h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Biomedical Engineering is not a single subject—it's a vast collection of specialized fields.
              Explore these domains to find the exact intersection of biology and engineering that fascinates you.
            </p>

            <SearchBar
              placeholder="Search domains, fields, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl mb-12 shadow-md"
            />

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'bg-background border border-border text-foreground hover:bg-accent hover:border-primary/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 md:py-24 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6">

          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredDomains.length} {filteredDomains.length === 1 ? 'Domain' : 'Domains'} Found
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

          {filteredDomains.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredDomains.map((domain, index) => (
                  <motion.div key={domain.id} layout>
                    <DomainCard domain={domain} index={index} />
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
              <h3 className="text-xl font-bold mb-2">No domains found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
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
