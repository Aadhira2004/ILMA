import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';
import { Career } from '@/types';
import { ArrowRight, Star } from 'lucide-react';

interface CareerCardProps {
  career: Career;
  index: number;
}

export function CareerCard({ career, index }: CareerCardProps) {
  const Icon = (Icons as any)[career.icon] || Icons.Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative h-full flex flex-col"
    >
      <Link href={`/careers/${career.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        <div className="flex flex-col h-full p-6 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
          
          {/* Subtle gradient accent on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-accent rounded-lg text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="font-normal border-primary/20 text-primary/80 bg-primary/5">
                  {career.category}
                </Badge>
                <div className="flex items-center text-amber-500 text-xs">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  <span className="font-medium">{career.futureScopeRating}</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {career.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground font-medium">
              <span>{career.salary}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{career.salaryAbroad}</span>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
              {career.shortDescription}
            </p>
            
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-primary group-hover:text-primary/80">
              Explore Career
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
