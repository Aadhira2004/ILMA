import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { ExamCard } from '@/components/shared/ExamCard';
import { motion } from 'framer-motion';
import examsData from '@/data/exams.json';
import { Exam } from '@/types';

const CATEGORIES = ['All', 'National', 'Defense / Research', 'Healthcare Institutions', 'Railways', 'State Government'];

export default function GovernmentExamsPage() {
  useDocumentMeta('Government Exams', 'Competitive exams for biomedical engineers.');
  useScrollTop();

  const [activeCategory, setActiveCategory] = useState('All');
  const exams = examsData as Exam[];

  const filteredExams = exams.filter(exam => 
    activeCategory === 'All' || exam.category.includes(activeCategory)
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Government & Public Sector Exams</h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Secure a prestigious career in research, defense, or public healthcare. Find syllabi, eligibility criteria, and preparation strategies for every major competitive exam open to Biomedical Engineers.
            </p>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground shadow-md'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredExams.map((exam, index) => (
              <ExamCard key={exam.id} exam={exam} index={index} />
            ))}
          </div>
          {filteredExams.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No exams found in this category.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
