import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DomainCard } from '@/components/shared/DomainCard';
import { motion } from 'framer-motion';
import domainsData from '@/data/domains.json';
import { Domain } from '@/types';

export default function DomainsPage() {
  useDocumentMeta('Biomedical Domains', 'Explore specialized fields in biomedical engineering.');
  useScrollTop();

  const domains = domainsData as Domain[];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Biomedical Domains</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Biomedical Engineering is not a single subject—it's a vast collection of specialized fields. 
              Explore these domains to find the exact intersection of biology and engineering that fascinates you.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {domains.map((domain, index) => (
              <DomainCard key={domain.id} domain={domain} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
