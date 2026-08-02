import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeader({ title, subtitle, badge, align = 'center', className }: SectionHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12 flex flex-col gap-4",
        {
          "items-start text-left": align === 'left',
          "items-center text-center": align === 'center',
          "items-end text-right": align === 'right',
        },
        className
      )}
    >
      {badge && (
        <Badge variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/80 font-medium px-3 py-1 rounded-full">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-[800px] leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
