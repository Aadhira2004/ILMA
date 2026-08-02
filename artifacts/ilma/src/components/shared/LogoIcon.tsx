import React from 'react';
import ilmaLogo from '@/assets/images/ilma-logo.png';

interface LogoIconProps {
  /** Size in pixels (square bounding box) */
  size?: number;
  className?: string;
}

/**
 * Compact ILMA logo icon — use where only the mark is needed (favicon display,
 * loading spinner replacement, small badges, etc.)
 */
export function LogoIcon({ size = 40, className = '' }: LogoIconProps) {
  return (
    <img
      src={ilmaLogo}
      alt="ILMA – Biomedical Future Logo"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`object-contain rounded-md ${className}`}
      loading="lazy"
    />
  );
}
