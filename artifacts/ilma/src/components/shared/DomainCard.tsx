import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Domain } from '@/types';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface DomainCardProps {
  domain: Domain;
  index: number;
}

export function DomainCard({ domain, index }: DomainCardProps) {
  const Icon = (Icons as any)[domain.icon] || Icons.Box;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/domains/${domain.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        <div className="flex flex-col h-full p-6 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
          
          {/* Dynamic background glow based on domain color */}
          <div 
            className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: domain.color }}
          />

          <div className="relative z-10 flex flex-col h-full">
            <div 
              className="p-3 rounded-lg mb-4 w-fit"
              style={{ backgroundColor: `${domain.color}15`, color: domain.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-bold mb-1 text-foreground">
              {domain.name}
            </h3>
            
            <p className="text-sm font-medium mb-3" style={{ color: domain.color }}>
              {domain.tagline}
            </p>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
              {domain.overview}
            </p>
            
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm font-semibold group-hover:text-primary transition-colors">
              <span style={{ color: domain.color }}>Explore Domain</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" style={{ color: domain.color }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
