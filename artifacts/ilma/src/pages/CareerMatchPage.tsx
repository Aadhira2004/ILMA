import React, { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { CareerCard } from '@/components/shared/CareerCard';
import { motion, AnimatePresence } from 'framer-motion';
import careersData from '@/data/careers.json';
import domainsData from '@/data/domains.json';
import { Career, Domain } from '@/types';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, CheckCircle2, Compass } from 'lucide-react';

interface QuizOption {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  // weight maps to career ids and domain ids
  careers: string[];
  domains: string[];
}

interface QuizStep {
  key: string;
  title: string;
  subtitle: string;
  multi: boolean;
  options: QuizOption[];
}

const STEPS: QuizStep[] = [
  {
    key: 'enjoy',
    title: 'What do you enjoy?',
    subtitle: 'Pick everything that sounds fun to you.',
    multi: true,
    options: [
      {
        id: 'coding',
        label: 'Coding',
        icon: 'Code',
        careers: [
          'ai-healthcare-engineer', 'healthcare-data-analyst', 'biomedical-data-scientist',
          'computational-biologist', 'bioinformatics-scientist', 'digital-health-engineer',
          'healthcare-informatics-specialist', 'healthcare-iot-engineer', 'biomedical-signal-processing-engineer',
        ],
        domains: [
          'bioinformatics', 'ai-in-healthcare', 'machine-learning-biomedical', 'computational-biology',
          'biomedical-data-science', 'health-informatics', 'digital-health', 'medical-image-processing',
        ],
      },
      {
        id: 'electronics',
        label: 'Electronics',
        icon: 'CircuitBoard',
        careers: [
          'bioinstrumentation-engineer', 'medical-electronics-engineer', 'biosensor-engineer',
          'wearable-technology-engineer', 'biomedical-equipment-engineer', 'medical-device-engineer',
        ],
        domains: [
          'biomedical-instrumentation', 'bioelectronics', 'biosensors', 'wearable-healthcare-technology',
          'biomedical-signal-processing',
        ],
      },
      {
        id: 'biology',
        label: 'Biology',
        icon: 'Dna',
        careers: [
          'biomedical-scientist', 'tissue-engineer', 'biomaterials-scientist', 'stem-cell-researcher',
          'cancer-researcher', 'genomics-researcher', 'regenerative-medicine-researcher',
        ],
        domains: [
          'tissue-engineering', 'biomaterials', 'regenerative-medicine', 'genomics', 'precision-medicine',
          'cancer-engineering',
        ],
      },
      {
        id: 'research',
        label: 'Research',
        icon: 'Microscope',
        careers: [
          'biomedical-research-scientist', 'clinical-research-associate', 'biomedical-scientist',
          'translational-researcher', 'neuroscience-researcher', 'nanomedicine-researcher',
          'biomedical-rd-engineer',
        ],
        domains: [
          'biomedical-research', 'translational-medicine', 'nanomedicine', 'precision-medicine',
        ],
      },
      {
        id: 'design',
        label: 'Design',
        icon: 'PenTool',
        careers: [
          'medical-device-design-engineer', 'biomedical-engineer', 'prosthetics-orthotics-engineer',
          'artificial-organ-engineer', 'medical-device-engineer', 'biomaterials-engineer',
        ],
        domains: [
          'medical-device-design', 'prosthetics-orthotics', 'artificial-organs', 'biomedical-implants',
          'biomedical-3d-printing',
        ],
      },
      {
        id: 'robotics',
        label: 'Robotics',
        icon: 'Bot',
        careers: [
          'medical-robotics-engineer', 'surgical-robotics-engineer', 'biomechatronics-engineer',
          'rehabilitation-engineer', 'neural-engineer',
        ],
        domains: [
          'medical-robotics', 'surgical-robotics', 'healthcare-robotics', 'biomechatronics',
          'brain-computer-interfaces', 'rehabilitation-engineering',
        ],
      },
      {
        id: 'clinical',
        label: 'Clinical work',
        icon: 'Stethoscope',
        careers: [
          'clinical-engineer', 'medical-device-service-engineer', 'healthcare-technology-specialist',
          'medical-equipment-specialist', 'clinical-applications-specialist', 'biomedical-equipment-engineer',
        ],
        domains: [
          'clinical-engineering', 'hospital-technology-management', 'diagnostic-technologies',
          'point-of-care-diagnostics', 'telemedicine',
        ],
      },
      {
        id: 'writing',
        label: 'Writing / communication',
        icon: 'FileText',
        careers: [
          'biomedical-technical-writer', 'medical-writer', 'scientific-writer', 'patent-analyst',
          'science-communicator', 'regulatory-affairs-specialist',
        ],
        domains: [
          'biomedical-research', 'translational-medicine',
        ],
      },
    ],
  },
  {
    key: 'workplace',
    title: 'Where would you love to work?',
    subtitle: 'Select the environments that appeal to you.',
    multi: true,
    options: [
      {
        id: 'laboratory',
        label: 'Laboratory',
        icon: 'FlaskConical',
        careers: [
          'biomedical-scientist', 'biomedical-research-scientist', 'tissue-engineer', 'biomaterials-scientist',
          'stem-cell-researcher', 'genomics-researcher', 'cancer-researcher',
        ],
        domains: [
          'biomaterials', 'tissue-engineering', 'regenerative-medicine', 'genomics', 'biomedical-research',
        ],
      },
      {
        id: 'hospital',
        label: 'Hospital',
        icon: 'Hospital',
        careers: [
          'clinical-engineer', 'medical-device-service-engineer', 'healthcare-technology-specialist',
          'medical-equipment-specialist', 'biomedical-equipment-engineer', 'clinical-applications-specialist',
          'health-information-specialist',
        ],
        domains: [
          'clinical-engineering', 'hospital-technology-management', 'medical-imaging', 'telemedicine',
        ],
      },
      {
        id: 'research-institute',
        label: 'Research institute',
        icon: 'Building',
        careers: [
          'biomedical-research-scientist', 'translational-researcher', 'neuroscience-researcher',
          'nanomedicine-researcher', 'regenerative-medicine-researcher', 'computational-biologist',
          'bioinformatics-scientist',
        ],
        domains: [
          'biomedical-research', 'translational-medicine', 'computational-biology', 'nanomedicine',
        ],
      },
      {
        id: 'industry',
        label: 'Industry',
        icon: 'Factory',
        careers: [
          'medical-device-engineer', 'medical-device-design-engineer', 'quality-assurance-engineer',
          'validation-engineer', 'biomedical-manufacturing-engineer', 'medical-device-quality-engineer',
          'regulatory-affairs-specialist', 'medical-device-product-manager',
        ],
        domains: [
          'biomedical-manufacturing', 'medical-device-design', 'pharmaceutical-engineering', 'drug-delivery-systems',
        ],
      },
      {
        id: 'startup',
        label: 'Startup',
        icon: 'Rocket',
        careers: [
          'medical-device-entrepreneur', 'healthcare-technology-entrepreneur', 'biomedical-sales-engineer',
          'digital-health-engineer', 'wearable-technology-engineer', 'medical-device-application-engineer',
        ],
        domains: [
          'digital-health', 'wearable-healthcare-technology', 'healthcare-iot', 'point-of-care-diagnostics',
        ],
      },
      {
        id: 'university',
        label: 'University',
        icon: 'GraduationCap',
        careers: [
          'biomedical-professor', 'biomedical-research-scientist', 'scientific-writer',
          'science-communicator', 'computational-biologist',
        ],
        domains: [
          'biomedical-research', 'translational-medicine',
        ],
      },
    ],
  },
  {
    key: 'technology',
    title: 'Which technology excites you?',
    subtitle: 'Choose the innovations that spark your curiosity.',
    multi: true,
    options: [
      {
        id: 'ai',
        label: 'AI',
        icon: 'BrainCircuit',
        careers: [
          'ai-healthcare-engineer', 'biomedical-data-scientist', 'healthcare-data-analyst',
          'computational-biologist', 'bioinformatics-scientist', 'digital-health-engineer',
        ],
        domains: [
          'ai-in-healthcare', 'machine-learning-biomedical', 'computer-vision-healthcare',
          'biomedical-data-science', 'computational-biology',
        ],
      },
      {
        id: 'robotics',
        label: 'Robotics',
        icon: 'Bot',
        careers: [
          'medical-robotics-engineer', 'surgical-robotics-engineer', 'biomechatronics-engineer',
          'rehabilitation-engineer',
        ],
        domains: [
          'medical-robotics', 'surgical-robotics', 'healthcare-robotics', 'biomechatronics',
        ],
      },
      {
        id: 'medical-devices',
        label: 'Medical devices',
        icon: 'HeartPulse',
        careers: [
          'medical-device-engineer', 'medical-device-design-engineer', 'bioinstrumentation-engineer',
          'medical-electronics-engineer', 'biomedical-equipment-engineer', 'medical-device-application-engineer',
        ],
        domains: [
          'biomedical-instrumentation', 'medical-device-design', 'diagnostic-technologies', 'biomedical-implants',
        ],
      },
      {
        id: 'biomaterials',
        label: 'Biomaterials',
        icon: 'Layers',
        careers: [
          'biomaterials-engineer', 'biomaterials-scientist', 'tissue-engineer', 'artificial-organ-engineer',
          'regenerative-medicine-researcher',
        ],
        domains: [
          'biomaterials', 'tissue-engineering', 'regenerative-medicine', 'artificial-organs', 'biomedical-implants',
        ],
      },
      {
        id: 'imaging',
        label: 'Imaging',
        icon: 'ScanLine',
        careers: [
          'medical-imaging-engineer', 'biomedical-signal-processing-engineer', 'ai-healthcare-engineer',
        ],
        domains: [
          'medical-imaging', 'medical-image-processing', 'computer-vision-healthcare', 'biomedical-signal-processing',
        ],
      },
      {
        id: 'wearables',
        label: 'Wearables',
        icon: 'Watch',
        careers: [
          'wearable-technology-engineer', 'biosensor-engineer', 'healthcare-iot-engineer',
          'digital-health-engineer',
        ],
        domains: [
          'wearable-healthcare-technology', 'biosensors', 'healthcare-iot', 'digital-health', 'bioelectronics',
        ],
      },
      {
        id: 'biotechnology',
        label: 'Biotechnology',
        icon: 'Dna',
        careers: [
          'genomics-researcher', 'stem-cell-researcher', 'cancer-researcher', 'nanomedicine-researcher',
          'computational-biologist', 'bioinformatics-scientist',
        ],
        domains: [
          'genomics', 'precision-medicine', 'nanobiotechnology', 'nanomedicine', 'microfluidics', 'lab-on-a-chip',
        ],
      },
    ],
  },
];

const PATH_STEPS = [
  { label: 'Student', icon: 'GraduationCap' as const },
  { label: 'Foundation Skills', icon: 'BookOpen' as const },
  { label: 'Projects', icon: 'FolderGit2' as const },
  { label: 'Internship', icon: 'Briefcase' as const },
  { label: 'Entry-Level Role', icon: 'UserCheck' as const },
  { label: 'Specialization', icon: 'Target' as const },
  { label: 'Advanced Career / Research', icon: 'Rocket' as const },
];

export default function CareerMatchPage() {
  useDocumentMeta('Find Your Biomedical Career', 'Take a short quiz to discover the biomedical engineering careers and domains that match your interests.');
  useScrollTop();

  const careers = careersData as Career[];
  const domains = domainsData as Domain[];

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const currentStep = STEPS[stepIndex];
  const currentSelection = answers[currentStep?.key] ?? [];

  const toggleOption = (optionId: string) => {
    setAnswers((prev) => {
      const existing = prev[currentStep.key] ?? [];
      if (currentStep.multi) {
        const next = existing.includes(optionId)
          ? existing.filter((id) => id !== optionId)
          : [...existing, optionId];
        return { ...prev, [currentStep.key]: next };
      }
      return { ...prev, [currentStep.key]: [optionId] };
    });
  };

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setDirection(1);
      setStepIndex((i) => i + 1);
    } else {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setDirection(-1);
      setStepIndex((i) => i - 1);
    }
  };

  const retake = () => {
    setAnswers({});
    setStepIndex(0);
    setShowResults(false);
    setDirection(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scoring against the FULL id list, then filtered to what exists.
  const { careerResults, domainResults } = useMemo(() => {
    const careerScores: Record<string, number> = {};
    const domainScores: Record<string, number> = {};
    const careerReasons: Record<string, Set<string>> = {};

    STEPS.forEach((step) => {
      const selected = answers[step.key] ?? [];
      selected.forEach((optId) => {
        const opt = step.options.find((o) => o.id === optId);
        if (!opt) return;
        opt.careers.forEach((cid) => {
          careerScores[cid] = (careerScores[cid] ?? 0) + 1;
          if (!careerReasons[cid]) careerReasons[cid] = new Set();
          careerReasons[cid].add(opt.label);
        });
        opt.domains.forEach((did) => {
          domainScores[did] = (domainScores[did] ?? 0) + 1;
        });
      });
    });

    const existingCareerIds = new Set(careers.map((c) => c.id));
    const existingDomainIds = new Set(domains.map((d) => d.id));

    const rankedCareers = Object.entries(careerScores)
      .filter(([id]) => existingCareerIds.has(id))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => {
        const career = careers.find((c) => c.id === id)!;
        const reasons = Array.from(careerReasons[id] ?? []);
        return { career, reasons };
      });

    const rankedDomains = Object.entries(domainScores)
      .filter(([id]) => existingDomainIds.has(id))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => domains.find((d) => d.id === id)!);

    return { careerResults: rankedCareers, domainResults: rankedDomains };
  }, [answers, careers, domains]);

  const buildReason = (reasons: string[]) => {
    if (reasons.length === 0) return 'Aligns with the interests you selected.';
    const list = reasons.slice(0, 3).map((r) => r.toLowerCase());
    return `Matches your interest in ${list.join(', ')}.`;
  };

  const progress = ((showResults ? STEPS.length : stepIndex) / STEPS.length) * 100;
  const hasAnswers = Object.values(answers).some((a) => a.length > 0);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-28 md:pb-14 bg-card border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Interactive Quiz
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Find Your Biomedical Career</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Answer three quick questions about what you enjoy, where you want to work, and the technology that excites you. We'll match you to biomedical careers and domains.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background min-h-[60vh]">
        <div className="container px-4 md:px-6 max-w-4xl">
          {!showResults ? (
            <>
              {/* Progress */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-primary">
                    Step {stepIndex + 1} of {STEPS.length}
                  </span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={false}
                    animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep.key}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentStep.title}</h2>
                  <p className="text-muted-foreground mb-8">{currentStep.subtitle}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentStep.options.map((option) => {
                      const OptIcon = (Icons as any)[option.icon] || Icons.Sparkles;
                      const selected = currentSelection.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleOption(option.id)}
                          className={`relative flex flex-col items-center justify-center text-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
                            selected
                              ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                              : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
                          }`}
                        >
                          {selected && (
                            <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-primary" />
                          )}
                          <div
                            className={`p-3 rounded-xl transition-colors ${
                              selected ? 'bg-primary text-primary-foreground' : 'bg-accent text-primary'
                            }`}
                          >
                            <OptIcon className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-semibold leading-tight">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Nav */}
              <div className="flex items-center justify-between mt-12">
                <Button
                  variant="outline"
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className="gap-2"
                  data-testid="button-quiz-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={goNext}
                  disabled={currentSelection.length === 0}
                  className="gap-2"
                  data-testid="button-quiz-next"
                >
                  {stepIndex === STEPS.length - 1 ? 'See Results' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                  <Compass className="w-4 h-4" />
                  Your Results
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Recommended Careers</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Based on your answers, here are the biomedical careers and domains that best fit your interests.
                </p>
              </div>

              {careerResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                  {careerResults.map(({ career, reasons }, index) => (
                    <div key={career.id} className="flex flex-col">
                      <CareerCard career={career} index={index} />
                      <div className="mt-3 flex items-start gap-2 px-2 text-sm text-muted-foreground">
                        <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{buildReason(reasons)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 mb-8">
                  <p className="text-muted-foreground mb-4">
                    We couldn't find a strong match yet. Try selecting a few more interests.
                  </p>
                </div>
              )}

              {domainResults.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 text-center">Domains to Explore</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {domainResults.map((domain) => {
                      const DomIcon = (Icons as any)[domain.icon] || Icons.Box;
                      return (
                        <Link
                          key={domain.id}
                          href={`/domains/${domain.id}`}
                          className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div
                            className="p-3 rounded-xl shrink-0"
                            style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                          >
                            <DomIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold group-hover:text-primary transition-colors leading-tight">
                              {domain.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{domain.tagline}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-center">
                <Button onClick={retake} variant="outline" size="lg" className="gap-2" data-testid="button-retake-quiz">
                  <RotateCcw className="w-4 h-4" />
                  Retake quiz
                </Button>
              </div>

              {/* Path to career (also useful summary) */}
              {hasAnswers && (
                <div className="mt-16 p-6 md:p-8 rounded-3xl bg-accent border border-primary/10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Icons.Route className="w-5 h-5 text-primary" />
                    Your Path Ahead
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    {PATH_STEPS.map((ps, i) => {
                      const PsIcon = (Icons as any)[ps.icon] || Icons.Circle;
                      return (
                        <React.Fragment key={ps.label}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border text-sm font-medium">
                            <PsIcon className="w-4 h-4 text-primary" />
                            {ps.label}
                          </div>
                          {i < PATH_STEPS.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
