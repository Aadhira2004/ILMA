import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Exam } from '@/types';
import * as Icons from 'lucide-react';
import { ArrowRight, Building2, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExamCardProps {
  exam: Exam;
  index: number;
}

export function ExamCard({ exam, index }: ExamCardProps) {
  const Icon = (Icons as any)[exam.icon] || Icons.FileText;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/exams/${exam.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        <div className="flex flex-col h-full p-6 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
          
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={
                exam.category === 'National' ? 'border-blue-500/30 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' :
                exam.category === 'Defense / Research' ? 'border-green-500/30 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' :
                'border-orange-500/30 text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
              }>
                {exam.category}
              </Badge>
              {exam.qualificationType && (
                <Badge variant="secondary" className="font-normal text-muted-foreground bg-accent">
                  {exam.qualificationType}
                </Badge>
              )}
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
            {exam.name}
          </h3>
          
          <div className="flex items-center text-sm text-muted-foreground mb-2 font-medium">
            <Building2 className="w-4 h-4 mr-2" />
            <span className="truncate">{exam.conductedBy}</span>
          </div>

          {exam.country && (
            <div className="flex items-center text-sm text-muted-foreground mb-4 font-medium">
              <Globe className="w-4 h-4 mr-2" />
              <span className="truncate">{exam.country}</span>
            </div>
          )}

          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
            {exam.overview}
          </p>
          
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-primary">
            Explore Exam
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
