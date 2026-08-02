import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Roadmap } from '@/types';
import * as Icons from 'lucide-react';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoadmapCardProps {
  roadmap: Roadmap;
  index: number;
}

export function RoadmapCard({ roadmap, index }: RoadmapCardProps) {
  const Icon = (Icons as any)[roadmap.icon] || Icons.Map;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/roadmaps/${roadmap.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        <div className="flex flex-col h-full p-6 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
          
          <div className="flex items-start justify-between mb-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${roadmap.color}15`, color: roadmap.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              <Clock className="w-3 h-3 mr-1" />
              {roadmap.estimatedTimeline}
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
            {roadmap.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {roadmap.careerApplications.slice(0, 2).map((app, i) => (
              <Badge key={i} variant="secondary" className="bg-secondary/10 text-secondary-foreground font-normal text-xs">
                {app}
              </Badge>
            ))}
            {roadmap.careerApplications.length > 2 && (
              <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs">
                +{roadmap.careerApplications.length - 2}
              </Badge>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <BookOpen className="w-4 h-4 mr-1.5" />
              <span>3 Phases</span>
            </div>
            <div className="font-semibold text-primary flex items-center">
              View Roadmap
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
