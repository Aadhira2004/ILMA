import React from 'react';
import { Link } from 'wouter';
import ilmaLogo from '@/assets/images/ilma-logo.png';

interface LogoProps {
  /** Show the "Biomedical Future" subtitle under the logo */
  showTagline?: boolean;
  /** Height of the logo image in pixels (controls visual size) */
  height?: number;
  /** Whether to wrap in a Link to / */
  asLink?: boolean;
  className?: string;
}

/**
 * Full ILMA logo — use in Navbar, Footer, loading screen, etc.
 */
export function Logo({ showTagline = false, height = 48, asLink = true, className = '' }: LogoProps) {
  const content = (
    <span className={`flex items-center gap-2 ${className}`}>
      <img
        src={ilmaLogo}
        alt="ILMA – Biomedical Future Logo"
        height={height}
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain rounded-md"
        loading="lazy"
      />
      {showTagline && (
        <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase hidden sm:block">
          Biomedical Future
        </span>
      )}
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="ILMA – Biomedical Future Home">
        {content}
      </Link>
    );
  }

  return content;
}
