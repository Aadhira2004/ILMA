import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'wouter';
import { Mail, ArrowRight, Loader2, CheckCircle, AlertCircle, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ilmaLogo from '@/assets/images/ilma-logo.png';

// ─── EmailJS config ────────────────────────────────────────────────────────────
const EJS_PUBLIC_KEY    = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;
const EJS_SERVICE_ID    = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EJS_NEWSLETTER_ID = import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID as string;

// Initialise once at module load
if (EJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EJS_PUBLIC_KEY });
} else if (import.meta.env.DEV) {
  console.warn('[EmailJS] VITE_EMAILJS_PUBLIC_KEY is not set – emails will fail.');
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Newsletter sub-component ──────────────────────────────────────────────────
function NewsletterSignup() {
  const [email, setSub]         = useState('');
  const [error, setError]       = useState('');
  const [sending, setSending]   = useState(false);
  const [success, setSuccess]   = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSending(true);
    try {
      await emailjs.send(
        EJS_SERVICE_ID,
        EJS_NEWSLETTER_ID,
        {
          subscriber_email: email.trim(),
          reply_to:         email.trim(),
          to_email:         'ilmabiomedical@gmail.com',
          subject:          'New ILMA Newsletter Subscriber',
        },
        { publicKey: EJS_PUBLIC_KEY },
      );
      setSuccess(true);
      setSub('');
    } catch (err) {
      console.error('[EmailJS] Newsletter send failed:', err);
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'text' in err
          ? String((err as { text: unknown }).text)
          : 'Failed to subscribe. Please try again.';
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/30">
        <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
        <p className="text-sm font-medium text-foreground">Thank you for subscribing!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-1" noValidate>
      <Input
        type="email"
        value={email}
        onChange={(e) => { setSub(e.target.value); setError(''); }}
        placeholder="Enter your email"
        className={`bg-background border-input ${error ? 'border-destructive' : ''}`}
        disabled={sending}
        aria-label="Newsletter email address"
      />
      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <Button type="submit" className="w-full group" disabled={sending}>
        {sending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Subscribing…
          </>
        ) : (
          <>
            Subscribe
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" aria-label="ILMA – Biomedical Future Home" className="w-fit">
              <img
                src={ilmaLogo}
                alt="ILMA – Biomedical Future Logo"
                className="h-12 w-auto object-contain rounded-md dark:bg-white/95 dark:p-1"
                loading="lazy"
              />
            </Link>

            <div className="mt-1 flex flex-col gap-1">
              <p className="font-heading font-semibold text-foreground text-sm tracking-wide">
                ILMA – Biomedical Future
              </p>
              <p className="text-xs text-muted-foreground tracking-wider">
                Innovation • Learning • Medical Technology • Advancement
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Founded by <span className="text-primary font-medium">Aadhira Suleim A. R.</span>
              </p>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering Biomedical Engineering students with structured learning,
              career guidance, skill roadmaps, and exam preparation.
            </p>

            <a
              href="mailto:ilmabiomedical@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group w-fit mt-1"
              aria-label="Email ILMA at ilmabiomedical@gmail.com"
            >
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="group-hover:underline underline-offset-2">ilmabiomedical@gmail.com</span>
            </a>

            <a
              href="https://www.instagram.com/ilma.biomedical?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group w-fit"
              aria-label="Follow ILMA on Instagram"
            >
              <Instagram className="h-4 w-4 text-primary shrink-0" />
              <span className="group-hover:underline underline-offset-2">@ilma.biomedical</span>
            </a>

            <a
              href="https://www.linkedin.com/company/ilma-biomedical/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group w-fit"
              aria-label="Follow ILMA on LinkedIn"
            >
              <Linkedin className="h-4 w-4 text-primary shrink-0" />
              <span className="group-hover:underline underline-offset-2">ILMA Biomedical</span>
            </a>

            <a
              href="https://www.youtube.com/@ILMA-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group w-fit"
              aria-label="Subscribe to ILMA on YouTube"
            >
              <Youtube className="h-4 w-4 text-primary shrink-0" />
              <span className="group-hover:underline underline-offset-2">@ILMA-2026</span>
            </a>

          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Explore</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/about"    className="text-sm text-muted-foreground hover:text-primary transition-colors">About ILMA</Link></li>
              <li><Link href="/careers"  className="text-sm text-muted-foreground hover:text-primary transition-colors">Career Explorer</Link></li>
              <li><Link href="/domains"  className="text-sm text-muted-foreground hover:text-primary transition-colors">Biomedical Domains</Link></li>
              <li><Link href="/roadmaps" className="text-sm text-muted-foreground hover:text-primary transition-colors">Skill Roadmaps</Link></li>
              <li><Link href="/exams"    className="text-sm text-muted-foreground hover:text-primary transition-colors">Government Exams</Link></li>
              <li><Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Project Hub</Link></li>
              <li><Link href="/higher-studies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Higher Studies</Link></li>
              <li><Link href="/opportunities"  className="text-sm text-muted-foreground hover:text-primary transition-colors">Global Opportunities</Link></li>
              <li><Link href="/founder"  className="text-sm text-muted-foreground hover:text-primary transition-colors">Meet the Founder</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Resources</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/contact"        className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms"          className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer"     className="text-sm text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link href="/cookie-policy"  className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/partnerships"   className="text-sm text-muted-foreground hover:text-primary transition-colors">Partner with ILMA</Link></li>
              <li><Link href="/faq"            className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest biomedical trends and career opportunities.
            </p>
            <NewsletterSignup />
          </div>

        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ILMA – Biomedical Future. All rights reserved.</p>
          <p className="italic text-muted-foreground/70">
            Designed and Developed by{' '}
            <span className="not-italic font-medium text-primary">Aadhira Suleim A. R.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
