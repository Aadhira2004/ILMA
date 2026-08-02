import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useCounter } from '@/hooks/use-counter';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '', className = '' }: AnimatedCounterProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [started, setStarted] = React.useState(false);
  
  React.useEffect(() => {
    if (isInView && !started) {
      setStarted(true);
    }
  }, [isInView, started]);

  const count = useCounter(started ? end : 0, duration);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
