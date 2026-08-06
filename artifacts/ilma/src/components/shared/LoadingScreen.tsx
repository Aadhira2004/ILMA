import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ilmaLogo from '@/assets/images/ilma-logo.png';

const SPLASH_KEY = 'ilma-splash-shown';

export function LoadingScreen() {
  const [visible, setVisible] = useState(
    () => sessionStorage.getItem(SPLASH_KEY) !== '1'
  );

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, '1');
      setVisible(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Glow ring */}
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute rounded-full bg-primary/10"
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.5, 0.15, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 160, height: 160 }}
            />
            <motion.div
              className="absolute rounded-full bg-secondary/10"
              animate={{
                scale: [1, 1.55, 1],
                opacity: [0.3, 0.05, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              style={{ width: 160, height: 160 }}
            />

            {/* Logo */}
            <motion.img
              src={ilmaLogo}
              alt="ILMA – Biomedical Future Logo"
              className="relative z-10 rounded-xl object-contain"
              style={{ width: 120, height: 120 }}
              animate={{
                scale: [1, 1.04, 1],
                filter: [
                  'drop-shadow(0 0 0px rgba(15,76,129,0))',
                  'drop-shadow(0 0 18px rgba(26,183,176,0.55))',
                  'drop-shadow(0 0 0px rgba(15,76,129,0))',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Text */}
          <motion.p
            className="mt-6 text-sm font-medium text-muted-foreground tracking-widest uppercase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Loading ILMA...
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="mt-4 h-0.5 rounded-full bg-primary/20 overflow-hidden"
            style={{ width: 140 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
