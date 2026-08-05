import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Cpu,
  Award,
  Linkedin,
  Github,
  Mail,
  ExternalLink,
  Quote,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLE = 'Founder · Biomedical Engineer · Researcher · M.E. Biomedical Engineering Student';

const highlights = [
  { icon: GraduationCap, label: 'Biomedical Engineering Graduate', color: 'text-primary' },
  { icon: GraduationCap, label: 'Pursuing M.E. Biomedical Engineering', color: 'text-secondary' },
  { icon: BookOpen,      label: '80+ Professional Courses & Certifications', color: 'text-primary' },
  { icon: FlaskConical,  label: '4+ Research Publications', color: 'text-secondary' },
  { icon: BookOpen,      label: 'Published Amazon Kindle Author', color: 'text-primary' },
  { icon: FlaskConical,  label: 'Biomedical Engineering Researcher', color: 'text-secondary' },
  { icon: Cpu,           label: 'AI in Healthcare Enthusiast', color: 'text-primary' },
  { icon: Award,         label: 'Founder of ILMA – Biomedical Future', color: 'text-secondary' },
];

const researchInterests = [
  'Artificial Intelligence in Healthcare',
  'Medical Devices',
  'Biomedical Instrumentation',
  'Medical Imaging',
  'Wearable Healthcare Technology',
  'Biomedical Signal Processing',
  'Embedded Systems',
  'Internet of Medical Things (IoMT)',
  'Machine Learning',
  'Clinical Engineering',
  'Medical Robotics',
];

const education = [
  {
    degree: 'Bachelor of Engineering (B.E.) – Biomedical Engineering',
    institution: 'Rohini College of Engineering and Technology',
    university: 'Anna University',
    period: 'October 2022 – June 2026',
    note: null,
    done: true,
  },
  {
    degree: 'Master of Engineering (M.E.) – Biomedical Engineering',
    institution: 'Udaya School of Engineering',
    university: 'Anna University',
    period: 'July 2026 – May 2028',
    note: 'Current Research: Smart Wearable Sensor System for Real-Time Biomechanical Analysis',
    done: false,
  },
];

const publications = [
  {
    title: 'Smart Wearable Sensor System for Real-Time Biomechanical Analysis',
    venue: 'IEEE – ICBMESH 2025',
    date: 'October 3, 2025',
    description:
      'An AI-integrated wearable sensor system enabling real-time biomechanical analysis, movement tracking, posture assessment, and intelligent healthcare monitoring.',
    tag: 'IEEE',
  },
  {
    title: 'Neuro-Ocular Parkinson\'s Disease Detection',
    venue: 'IJFMR',
    date: 'September 29, 2025',
    description:
      'An AI-assisted approach for early Parkinson\'s Disease screening using neuro-ocular biomarkers including blink rate and pupillary response.',
    tag: 'Journal',
  },
  {
    title: 'AI Parkinson\'s Screening System',
    venue: 'ICTRILS',
    date: null,
    description:
      'An intelligent screening system using Artificial Intelligence, Machine Learning, and Computer Vision for Parkinson\'s Disease detection.',
    tag: 'Conference',
  },
  {
    title: 'Underrated but Highly Rated',
    venue: 'Amazon Kindle Direct Publishing',
    date: 'September 4, 2025',
    description:
      'A motivational book encouraging students to embrace lifelong learning, confidence, and continuous self-improvement.',
    tag: 'Book',
  },
];

const stats = [
  { value: '80+', label: 'Courses Completed' },
  { value: '4+',  label: 'Publications' },
  { value: 'IEEE', label: 'Conference Author' },
  { value: 'M.E.', label: 'Pursuing PG' },
];

const socials = [
  { icon: Linkedin,     label: 'LinkedIn',      href: 'https://linkedin.com/in/aadhira-suleim',                                     ariaLabel: 'LinkedIn profile' },
  { icon: Github,       label: 'GitHub',        href: 'https://github.com/Aadhira2004',                                             ariaLabel: 'GitHub profile' },
  { icon: ExternalLink, label: 'Google Scholar',href: 'https://scholar.google.com/citations?hl=en&user=4x4DTWMAAAAJ',               ariaLabel: 'Google Scholar profile' },
  { icon: Mail,         label: 'Email',         href: 'mailto:aadhirasuleim@gmail.com',                                             ariaLabel: 'Email Aadhira' },
];

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

// ─── Sub-components ────────────────────────────────────────────────────────────

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-border bg-card/80 backdrop-blur-sm shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
      {label}
    </span>
  );
}

function PubTagBadge({ tag }: { tag: string }) {
  const map: Record<string, string> = {
    IEEE:       'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    Journal:    'bg-secondary/10 text-secondary border-secondary/20',
    Conference: 'bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400',
    Book:       'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${map[tag] ?? ''}`}>
      {tag}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FounderPage() {
  useDocumentMeta(
    'Meet the Founder – Aadhira Suleim A. R.',
    'The vision and story behind ILMA – Biomedical Future.',
  );
  useScrollTop();

  return (
    <Layout>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-card border-b border-border">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-secondary/5 blur-3xl" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20 mb-6">
                Meet the Founder
              </span>
            </motion.div>

            {/* Name monogram instead of photo */}
            <motion.div {...fadeUp(0.08)} className="flex justify-center mb-8">
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center rounded-3xl shadow-xl overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
                <span className="relative z-10 font-heading font-bold text-4xl md:text-5xl text-white tracking-tight select-none">
                  AS
                </span>
                {/* Subtle grid overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg,transparent,transparent 10px,rgba(255,255,255,.3) 10px,rgba(255,255,255,.3) 11px),repeating-linear-gradient(90deg,transparent,transparent 10px,rgba(255,255,255,.3) 10px,rgba(255,255,255,.3) 11px)',
                  }}
                />
              </div>
            </motion.div>

            <motion.h1 {...fadeUp(0.14)} className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
              Aadhira Suleim A. R.
            </motion.h1>
            <motion.p {...fadeUp(0.2)} className="text-base md:text-lg text-muted-foreground font-medium mb-8 max-w-2xl mx-auto">
              {ROLE}
            </motion.p>

            {/* Social icons */}
            <motion.div {...fadeUp(0.26)} className="flex flex-wrap justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.ariaLabel}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 hover:text-primary text-muted-foreground transition-all text-sm font-medium"
                >
                  <s.icon className="w-4 h-4 shrink-0" />
                  {s.label}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <section className="py-10 bg-background border-b border-border">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.08)}
                className="flex flex-col items-center justify-center gap-1 py-8 px-4 bg-background text-center"
              >
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {s.value}
                </span>
                <span className="text-sm text-muted-foreground font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Biography & Quote ──────────────────────────────────────────────── */}
      <section className="py-20 bg-card">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

            {/* Bio */}
            <motion.div {...fadeUp(0)} className="lg:col-span-3 space-y-5">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">About Aadhira</h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Aadhira Suleim A. R. is the Founder of <span className="text-foreground font-semibold">ILMA – Biomedical Future</span>, an educational platform dedicated exclusively to Biomedical Engineering students.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                She completed her <span className="text-foreground font-medium">Bachelor of Engineering (B.E.) in Biomedical Engineering</span> from Rohini College of Engineering and Technology, Anna University, and is currently pursuing a <span className="text-foreground font-medium">Master of Engineering (M.E.) in Biomedical Engineering</span> at Udaya School of Engineering, Anna University.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                She founded ILMA with the vision of making Biomedical Engineering education more structured, accessible, and career-focused — providing career guidance, biomedical domains, skill roadmaps, government exam preparation, and learning resources.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Her interests span Artificial Intelligence in Healthcare, Medical Devices, Wearable Healthcare Technology, Biomedical Signal Processing, Medical Imaging, Embedded Systems, and Biomedical Research.
              </p>
            </motion.div>

            {/* Quote card */}
            <motion.div {...fadeUp(0.15)} className="lg:col-span-2">
              <GlassCard className="p-7 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full pointer-events-none" />
                <Quote className="w-8 h-8 text-secondary mb-5 opacity-80" />
                <blockquote className="text-foreground/90 leading-relaxed text-base font-medium italic">
                  "I believe every Biomedical Engineering student deserves quality learning resources, practical guidance, and opportunities to innovate. ILMA was created to help students learn, grow, and build meaningful careers in healthcare technology."
                </blockquote>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-gradient-to-r from-primary to-secondary" />
                  <cite className="not-italic text-sm font-semibold text-primary">
                    Aadhira Suleim A. R.
                  </cite>
                </footer>
              </GlassCard>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Education Timeline ─────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <SectionHeader title="Education" subtitle="Academic journey in Biomedical Engineering." align="left" />

          <div className="relative mt-10">
            {/* Vertical line */}
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent hidden sm:block" />

            <div className="space-y-8">
              {education.map((edu, i) => (
                <motion.div key={i} {...fadeUp(i * 0.12)} className="flex gap-6 sm:gap-8 items-start">
                  {/* Dot */}
                  <div className="relative shrink-0 mt-1 hidden sm:flex">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background shadow-md z-10 ${edu.done ? 'bg-primary text-primary-foreground' : 'bg-secondary text-white'}`}>
                      <GraduationCap className="w-4 h-4" />
                    </span>
                  </div>

                  <GlassCard className="flex-1 p-6 md:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {edu.period}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${edu.done ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                        {edu.done ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{edu.degree}</h3>
                    <p className="text-muted-foreground font-medium">{edu.institution}</p>
                    <p className="text-muted-foreground/70 text-sm">{edu.university}</p>
                    {edu.note && (
                      <p className="mt-4 text-sm text-secondary font-medium border-l-2 border-secondary pl-3 leading-relaxed">
                        {edu.note}
                      </p>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Professional Highlights ────────────────────────────────────────── */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <SectionHeader title="Professional Highlights" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.06)}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-background border border-border hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className={`p-2.5 rounded-xl bg-primary/5 shrink-0 group-hover:bg-primary/10 transition-colors ${h.color}`}>
                  <h.icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-foreground leading-snug pt-0.5">{h.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research Interests ─────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <SectionHeader title="Research Interests" subtitle="Areas of focus and exploration in biomedical engineering." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {researchInterests.map((tag, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
              >
                <TagBadge label={tag} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Publications ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container px-4 md:px-6">
          <SectionHeader title="Featured Publications" subtitle="Research, conferences, and authored works." />
          <div className="grid md:grid-cols-2 gap-6 mt-4 max-w-6xl mx-auto">
            {publications.map((pub, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}>
                <GlassCard className="h-full p-6 md:p-7 flex flex-col gap-4 hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-3">
                    <PubTagBadge tag={pub.tag} />
                    {pub.date && (
                      <span className="text-xs text-muted-foreground shrink-0">{pub.date}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-secondary font-semibold">{pub.venue}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{pub.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)} className="relative rounded-3xl overflow-hidden p-10 md:p-14 border border-border bg-card">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 relative z-10">
              Want to connect or collaborate?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 relative z-10">
              Whether you're a student, researcher, or professional — we'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <a
                href="mailto:ilmabiomedical@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              >
                <Mail className="w-4 h-4" />
                Send a Message
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background text-foreground font-semibold hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                Contact Page
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
}
