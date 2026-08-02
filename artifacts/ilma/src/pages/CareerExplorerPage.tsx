import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { CareerCard } from '@/components/shared/CareerCard';
import { SearchBar } from '@/components/shared/SearchBar';
import { motion } from 'framer-motion';
import careersData from '@/data/careers.json';
import { Career } from '@/types';

const CATEGORIES = ['All', 'Hospital', 'Medical Devices', 'Research', 'Healthcare IT', 'AI', 'Government'];

export default function CareerExplorerPage() {
  useDocumentMeta('Career Explorer', 'Explore detailed career paths in Biomedical Engineering.');
  useScrollTop();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const careers = careersData as Career[];

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const matchesSearch = 
        career.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || career.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, careers]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Career Explorer</h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Discover the diverse roles available to biomedical engineers. Compare salaries, required skills, and daily responsibilities to find your perfect fit.
            </p>
            
            <SearchBar 
              placeholder="Search careers, skills, or roles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl mb-12 shadow-md"
            />

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((category) => (
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

      {/* Results Section */}
      <section className="py-16 md:py-24 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredCareers.length} {filteredCareers.length === 1 ? 'Career' : 'Careers'} Found
            </h2>
          </div>

          {filteredCareers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCareers.map((career, index) => (
                <CareerCard key={career.id} career={career} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-muted-foreground mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No careers found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
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
