import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ILMA – Biomedical Future` : 'ILMA – Biomedical Future';
    
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
}

export function useScrollTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);
}
