import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { RoadmapCard } from '@/components/shared/RoadmapCard';
import { motion } from 'framer-motion';
import roadmapsData from '@/data/roadmaps.json';
import { Roadmap } from '@/types';

export default function RoadmapsPage() {
  useDocumentMeta('Skill Roadmaps', 'Step-by-step learning paths for biomedical skills.');
  useScrollTop();

  const roadmaps = roadmapsData as Roadmap[];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[1px]" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
              Curated Learning Paths
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Skill Roadmaps</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Don't know where to start? We've broken down complex skills into clear, actionable phases from beginner to advanced. Stop searching for tutorials and start building.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {roadmaps.map((roadmap, index) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
