import React, { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { CareerCard } from '@/components/shared/CareerCard';
import { motion, AnimatePresence } from 'framer-motion';
import careersData from '@/data/careers.json';
import domainsData from '@/data/domains.json';
import projectsData from '@/data/projects.json';
import examsData from '@/data/exams.json';
import { Career, Domain, Exam } from '@/types';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Compass,
  Wrench,
  Lightbulb,
  Route as RouteIcon,
  GraduationCap,
  Award,
  ListChecks,
} from 'lucide-react';

/**
 * The exams.json Exam objects may (optionally) carry these extended fields.
 * They are all optional, so we read them defensively and never assume presence.
 */
type ExamWithMeta = Exam & {
  qualificationType?: 'Exam' | 'Certification' | 'Professional Registration' | 'Licensure' | 'Qualification';
  country?: string;
  region?: string;
  purpose?: string;
  educationLevel?: string;
  applicationProcess?: string;
  validity?: string;
  internationalRecognition?: string;
  higherStudyRelevance?: string;
  lastVerified?: string;
  relatedCareers?: string[];
  relatedDomains?: string[];
};

interface ProjectItem {
  id: string;
  title: string;
  category?: string;
  difficulty?: string;
  problem?: string;
  relatedDomains?: string[];
  relatedRoadmaps?: string[];
}

interface SessionOption {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  careers?: string[];
  domains?: string[];
  /** Marks a country selection (matched against higher-studies + exam country). */
  country?: string;
  /** Marks a self-reported skill level. */
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  /** Marks an environment preference used for next actions. */
  environment?: string;
}

interface SessionStep {
  key: string;
  title: string;
  subtitle: string;
  multi: boolean;
  options: SessionOption[];
}

const STEPS: SessionStep[] = [
  {
    key: 'study',
    title: 'What are you studying right now?',
    subtitle: 'This helps us pitch suggestions at the right level.',
    multi: false,
    options: [
      { id: 'school', label: 'School / Pre-University', icon: 'BookOpen' },
      { id: 'diploma', label: 'Diploma', icon: 'ScrollText' },
      { id: 'undergrad', label: 'Undergraduate', icon: 'GraduationCap' },
      { id: 'postgrad', label: 'Postgraduate', icon: 'Library' },
      { id: 'working', label: 'Working / Career switch', icon: 'Briefcase' },
    ],
  },
  {
    key: 'interest',
    title: 'Which area interests you most?',
    subtitle: 'Pick the broad space that excites you.',
    multi: true,
    options: [
      {
        id: 'devices',
        label: 'Medical devices',
        icon: 'HeartPulse',
        careers: ['medical-device-engineer', 'medical-device-design-engineer', 'bioinstrumentation-engineer', 'medical-electronics-engineer', 'biomedical-equipment-engineer'],
        domains: ['biomedical-instrumentation', 'medical-device-design', 'diagnostic-technologies', 'biomedical-implants'],
      },
      {
        id: 'data',
        label: 'Data & AI',
        icon: 'BrainCircuit',
        careers: ['ai-healthcare-engineer', 'biomedical-data-scientist', 'healthcare-data-analyst', 'computational-biologist', 'bioinformatics-scientist'],
        domains: ['ai-in-healthcare', 'machine-learning-biomedical', 'biomedical-data-science', 'computational-biology', 'bioinformatics'],
      },
      {
        id: 'lifesciences',
        label: 'Life sciences',
        icon: 'Dna',
        careers: ['biomedical-scientist', 'tissue-engineer', 'biomaterials-scientist', 'stem-cell-researcher', 'genomics-researcher', 'cancer-researcher'],
        domains: ['tissue-engineering', 'biomaterials', 'regenerative-medicine', 'genomics', 'precision-medicine'],
      },
      {
        id: 'imaging',
        label: 'Imaging & signals',
        icon: 'ScanLine',
        careers: ['medical-imaging-engineer', 'biomedical-signal-processing-engineer'],
        domains: ['medical-imaging', 'medical-image-processing', 'biomedical-signal-processing', 'computer-vision-healthcare'],
      },
      {
        id: 'clinicaltech',
        label: 'Clinical technology',
        icon: 'Stethoscope',
        careers: ['clinical-engineer', 'medical-device-service-engineer', 'healthcare-technology-specialist', 'clinical-applications-specialist'],
        domains: ['clinical-engineering', 'hospital-technology-management', 'point-of-care-diagnostics', 'telemedicine'],
      },
    ],
  },
  {
    key: 'preference',
    title: 'Where do you naturally gravitate?',
    subtitle: 'Choose the kinds of work that feel like you.',
    multi: true,
    options: [
      {
        id: 'hardware',
        label: 'Hardware',
        icon: 'CircuitBoard',
        careers: ['bioinstrumentation-engineer', 'medical-electronics-engineer', 'biosensor-engineer', 'wearable-technology-engineer', 'biomedical-equipment-engineer'],
        domains: ['biomedical-instrumentation', 'bioelectronics', 'biosensors', 'wearable-healthcare-technology'],
      },
      {
        id: 'software',
        label: 'Software',
        icon: 'Code',
        careers: ['digital-health-engineer', 'healthcare-informatics-specialist', 'healthcare-iot-engineer', 'biomedical-data-scientist'],
        domains: ['digital-health', 'health-informatics', 'healthcare-iot', 'biomedical-data-science'],
      },
      {
        id: 'biology',
        label: 'Biology & wet lab',
        icon: 'FlaskConical',
        careers: ['biomedical-scientist', 'stem-cell-researcher', 'tissue-engineer', 'genomics-researcher', 'cancer-researcher'],
        domains: ['tissue-engineering', 'regenerative-medicine', 'genomics', 'biomaterials'],
      },
      {
        id: 'research',
        label: 'Research',
        icon: 'Microscope',
        careers: ['biomedical-research-scientist', 'translational-researcher', 'neuroscience-researcher', 'nanomedicine-researcher', 'biomedical-rd-engineer'],
        domains: ['biomedical-research', 'translational-medicine', 'nanomedicine'],
      },
      {
        id: 'clinical',
        label: 'Clinical / hospital',
        icon: 'Hospital',
        careers: ['clinical-engineer', 'medical-device-service-engineer', 'medical-equipment-specialist', 'clinical-applications-specialist'],
        domains: ['clinical-engineering', 'hospital-technology-management', 'diagnostic-technologies'],
      },
    ],
  },
  {
    key: 'programming',
    title: 'Do you enjoy programming?',
    subtitle: 'Be honest — there are great paths either way.',
    multi: false,
    options: [
      {
        id: 'love-coding',
        label: 'Love it',
        icon: 'Terminal',
        careers: ['ai-healthcare-engineer', 'biomedical-data-scientist', 'bioinformatics-scientist', 'computational-biologist', 'digital-health-engineer'],
        domains: ['ai-in-healthcare', 'machine-learning-biomedical', 'bioinformatics', 'biomedical-data-science', 'computational-biology'],
      },
      {
        id: 'some-coding',
        label: 'A little',
        icon: 'CodeXml',
        careers: ['biomedical-signal-processing-engineer', 'healthcare-iot-engineer', 'healthcare-data-analyst'],
        domains: ['biomedical-signal-processing', 'healthcare-iot', 'health-informatics'],
      },
      {
        id: 'no-coding',
        label: 'Not really',
        icon: 'Wrench',
        careers: ['clinical-engineer', 'medical-device-service-engineer', 'regulatory-affairs-specialist', 'biomedical-scientist'],
        domains: ['clinical-engineering', 'hospital-technology-management', 'biomaterials'],
      },
    ],
  },
  {
    key: 'design',
    title: 'Do you enjoy designing devices?',
    subtitle: 'Think prototyping, CAD, and building things.',
    multi: false,
    options: [
      {
        id: 'love-design',
        label: 'Yes, I love building',
        icon: 'PenTool',
        careers: ['medical-device-design-engineer', 'biomedical-engineer', 'prosthetics-orthotics-engineer', 'artificial-organ-engineer', 'medical-device-engineer'],
        domains: ['medical-device-design', 'prosthetics-orthotics', 'artificial-organs', 'biomedical-implants', 'biomedical-3d-printing'],
      },
      {
        id: 'maybe-design',
        label: 'Sometimes',
        icon: 'Ruler',
        careers: ['biomedical-rd-engineer', 'validation-engineer', 'biomedical-manufacturing-engineer'],
        domains: ['biomedical-manufacturing', 'medical-device-design'],
      },
      {
        id: 'no-design',
        label: 'Prefer other things',
        icon: 'SlidersHorizontal',
        careers: ['healthcare-data-analyst', 'clinical-research-associate', 'biomedical-scientist'],
        domains: ['biomedical-data-science', 'biomedical-research'],
      },
    ],
  },
  {
    key: 'ai-health',
    title: 'How interested are you in AI + healthcare?',
    subtitle: 'From diagnostics to decision support.',
    multi: false,
    options: [
      {
        id: 'ai-high',
        label: 'Very interested',
        icon: 'Bot',
        careers: ['ai-healthcare-engineer', 'biomedical-data-scientist', 'computational-biologist', 'bioinformatics-scientist'],
        domains: ['ai-in-healthcare', 'machine-learning-biomedical', 'computer-vision-healthcare', 'biomedical-data-science'],
      },
      {
        id: 'ai-mid',
        label: 'Somewhat',
        icon: 'LineChart',
        careers: ['healthcare-data-analyst', 'digital-health-engineer'],
        domains: ['health-informatics', 'digital-health'],
      },
      { id: 'ai-low', label: 'Not for me', icon: 'X' },
    ],
  },
  {
    key: 'research-interest',
    title: 'How interested are you in research?',
    subtitle: 'Discovering, publishing, pushing boundaries.',
    multi: false,
    options: [
      {
        id: 'research-high',
        label: 'Very interested',
        icon: 'Microscope',
        careers: ['biomedical-research-scientist', 'translational-researcher', 'neuroscience-researcher', 'nanomedicine-researcher', 'regenerative-medicine-researcher'],
        domains: ['biomedical-research', 'translational-medicine', 'nanomedicine', 'precision-medicine'],
      },
      {
        id: 'research-mid',
        label: 'Applied research',
        icon: 'FlaskConical',
        careers: ['biomedical-rd-engineer', 'clinical-research-associate'],
        domains: ['biomedical-research'],
      },
      { id: 'research-low', label: 'Prefer building / applying', icon: 'Hammer' },
    ],
  },
  {
    key: 'robotics',
    title: 'How interested are you in medical robotics?',
    subtitle: 'Surgical robots, exoskeletons, automation.',
    multi: false,
    options: [
      {
        id: 'robotics-high',
        label: 'Very interested',
        icon: 'Bot',
        careers: ['medical-robotics-engineer', 'surgical-robotics-engineer', 'biomechatronics-engineer', 'rehabilitation-engineer', 'neural-engineer'],
        domains: ['medical-robotics', 'surgical-robotics', 'healthcare-robotics', 'biomechatronics', 'rehabilitation-engineering'],
      },
      {
        id: 'robotics-mid',
        label: 'A little',
        icon: 'Cog',
        careers: ['biomechanical-engineer', 'rehabilitation-engineer'],
        domains: ['biomechanics', 'rehabilitation-engineering'],
      },
      { id: 'robotics-low', label: 'Not really', icon: 'X' },
    ],
  },
  {
    key: 'tissue',
    title: 'Interested in artificial organs & tissue engineering?',
    subtitle: 'Growing tissue, engineering replacement organs.',
    multi: false,
    options: [
      {
        id: 'tissue-high',
        label: 'Very interested',
        icon: 'Heart',
        careers: ['tissue-engineer', 'artificial-organ-engineer', 'regenerative-medicine-researcher', 'biomaterials-scientist', 'stem-cell-researcher'],
        domains: ['tissue-engineering', 'artificial-organs', 'regenerative-medicine', 'biomaterials', 'biomedical-implants'],
      },
      {
        id: 'tissue-mid',
        label: 'A little',
        icon: 'Layers',
        careers: ['biomaterials-engineer'],
        domains: ['biomaterials', 'biomedical-3d-printing'],
      },
      { id: 'tissue-low', label: 'Not really', icon: 'X' },
    ],
  },
  {
    key: 'environment',
    title: 'Where would you love to work?',
    subtitle: 'Pick the setting that suits you best.',
    multi: true,
    options: [
      {
        id: 'industry',
        label: 'Industry',
        icon: 'Factory',
        environment: 'industry',
        careers: ['medical-device-engineer', 'medical-device-design-engineer', 'quality-assurance-engineer', 'validation-engineer', 'biomedical-manufacturing-engineer', 'medical-device-quality-engineer', 'regulatory-affairs-specialist'],
        domains: ['biomedical-manufacturing', 'medical-device-design', 'pharmaceutical-engineering', 'drug-delivery-systems'],
      },
      {
        id: 'research',
        label: 'Research institute',
        icon: 'Building',
        environment: 'research',
        careers: ['biomedical-research-scientist', 'translational-researcher', 'neuroscience-researcher', 'nanomedicine-researcher', 'computational-biologist'],
        domains: ['biomedical-research', 'translational-medicine', 'nanomedicine'],
      },
      {
        id: 'academia',
        label: 'Academia',
        icon: 'GraduationCap',
        environment: 'academia',
        careers: ['biomedical-professor', 'scientific-writer', 'science-communicator', 'biomedical-research-scientist'],
        domains: ['biomedical-research', 'translational-medicine'],
      },
      {
        id: 'entrepreneurship',
        label: 'Entrepreneurship',
        icon: 'Rocket',
        environment: 'entrepreneurship',
        careers: ['medical-device-entrepreneur', 'healthcare-technology-entrepreneur', 'digital-health-engineer', 'medical-device-product-manager'],
        domains: ['digital-health', 'wearable-healthcare-technology', 'healthcare-iot', 'point-of-care-diagnostics'],
      },
      {
        id: 'clinical',
        label: 'Clinical / hospital',
        icon: 'Hospital',
        environment: 'clinical',
        careers: ['clinical-engineer', 'medical-device-service-engineer', 'healthcare-technology-specialist', 'medical-equipment-specialist', 'clinical-applications-specialist'],
        domains: ['clinical-engineering', 'hospital-technology-management', 'telemedicine', 'diagnostic-technologies'],
      },
    ],
  },
  {
    key: 'country',
    title: 'Which region are you interested in?',
    subtitle: 'We\'ll surface region-relevant study and qualification info.',
    multi: false,
    options: [
      { id: 'c-global', label: 'Open / Global', icon: 'Globe', country: 'Global' },
      { id: 'c-india', label: 'India', icon: 'MapPin', country: 'India' },
      { id: 'c-usa', label: 'USA', icon: 'MapPin', country: 'USA' },
      { id: 'c-uk', label: 'UK', icon: 'MapPin', country: 'UK' },
      { id: 'c-germany', label: 'Germany', icon: 'MapPin', country: 'Germany' },
      { id: 'c-canada', label: 'Canada', icon: 'MapPin', country: 'Canada' },
      { id: 'c-australia', label: 'Australia', icon: 'MapPin', country: 'Australia' },
      { id: 'c-singapore', label: 'Singapore', icon: 'MapPin', country: 'Singapore' },
    ],
  },
  {
    key: 'skill',
    title: 'What\'s your current skill level?',
    subtitle: 'So the next steps feel achievable.',
    multi: false,
    options: [
      { id: 'lvl-beginner', label: 'Beginner', icon: 'Sprout', skillLevel: 'beginner' },
      { id: 'lvl-intermediate', label: 'Intermediate', icon: 'TrendingUp', skillLevel: 'intermediate' },
      { id: 'lvl-advanced', label: 'Advanced', icon: 'Award', skillLevel: 'advanced' },
    ],
  },
];

const STUDY_LABELS: Record<string, string> = {
  school: 'a school / pre-university student',
  diploma: 'a diploma student',
  undergrad: 'an undergraduate',
  postgrad: 'a postgraduate',
  working: 'a working professional',
};

export default function StudentSessionPage() {
  useDocumentMeta(
    'Student Interactive Session',
    'An interactive guided session that explores your interests and builds a personalised ILMA Career Profile with careers, domains, skills, projects, roadmaps, qualifications and next steps.',
  );
  useScrollTop();

  const careers = careersData as Career[];
  const domains = domainsData as Domain[];
  const projects = projectsData as ProjectItem[];
  const exams = examsData as ExamWithMeta[];

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
    if (showResults) {
      setShowResults(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
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

  const chosenCountry = useMemo(() => {
    const sel = (answers['country'] ?? [])[0];
    const opt = STEPS.find((s) => s.key === 'country')?.options.find((o) => o.id === sel);
    return opt?.country ?? 'Global';
  }, [answers]);

  const skillLevel = useMemo<'beginner' | 'intermediate' | 'advanced'>(() => {
    const sel = (answers['skill'] ?? [])[0];
    const opt = STEPS.find((s) => s.key === 'skill')?.options.find((o) => o.id === sel);
    return opt?.skillLevel ?? 'beginner';
  }, [answers]);

  const studyStage = useMemo(() => (answers['study'] ?? [])[0] ?? '', [answers]);

  const chosenEnvironments = useMemo(() => {
    const sel = answers['environment'] ?? [];
    return STEPS.find((s) => s.key === 'environment')!
      .options.filter((o) => sel.includes(o.id))
      .map((o) => o.environment!)
      .filter(Boolean);
  }, [answers]);

  const results = useMemo(() => {
    const careerScores: Record<string, number> = {};
    const domainScores: Record<string, number> = {};
    const careerReasons: Record<string, Set<string>> = {};

    STEPS.forEach((step) => {
      const selected = answers[step.key] ?? [];
      selected.forEach((optId) => {
        const opt = step.options.find((o) => o.id === optId);
        if (!opt) return;
        (opt.careers ?? []).forEach((cid) => {
          careerScores[cid] = (careerScores[cid] ?? 0) + 1;
          if (!careerReasons[cid]) careerReasons[cid] = new Set();
          careerReasons[cid].add(opt.label);
        });
        (opt.domains ?? []).forEach((did) => {
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

    // Recommended skills: union of top careers' skillsRequired, deduped, top ~8
    const skillSet: string[] = [];
    rankedCareers.forEach(({ career }) => {
      (career.skillsRequired ?? []).forEach((s) => {
        if (!skillSet.includes(s)) skillSet.push(s);
      });
    });
    const recommendedSkills = skillSet.slice(0, 8);

    // Roadmap links from top careers
    const roadmapIds: string[] = [];
    rankedCareers.forEach(({ career }) => {
      (career.roadmaps ?? []).forEach((r) => {
        if (!roadmapIds.includes(r)) roadmapIds.push(r);
      });
    });
    const recommendedRoadmaps = roadmapIds.slice(0, 6);

    // Recommended projects: matched by top domain ids (2-3)
    const topDomainIds = new Set(rankedDomains.map((d) => d.id));
    const matchedProjects = projects
      .map((p) => {
        const overlap = (p.relatedDomains ?? []).filter((d) => topDomainIds.has(d)).length;
        return { project: p, overlap };
      })
      .filter((p) => p.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 3)
      .map((p) => p.project);

    // Relevant exams/qualifications: match via optional relatedCareers/relatedDomains
    // + chosen country (or 'Global'). All fields optional, so read defensively.
    const topCareerIds = new Set(rankedCareers.map((r) => r.career.id));
    const matchedExams = exams
      .map((exam) => {
        const rc = Array.isArray(exam.relatedCareers) ? exam.relatedCareers : [];
        const rd = Array.isArray(exam.relatedDomains) ? exam.relatedDomains : [];
        const careerOverlap = rc.filter((c) => topCareerIds.has(c)).length;
        const domainOverlap = rd.filter((d) => topDomainIds.has(d)).length;
        const relevance = careerOverlap + domainOverlap;

        // Country match: keep if exam is Global, matches the chosen country,
        // or if the chosen country is Global (show all relevant).
        const examCountry = typeof exam.country === 'string' ? exam.country : '';
        const countryOk =
          chosenCountry === 'Global' ||
          examCountry === '' ||
          examCountry === 'Global' ||
          examCountry === chosenCountry;

        return { exam, relevance, countryOk };
      })
      .filter((e) => e.relevance > 0 && e.countryOk)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 4)
      .map((e) => e.exam);

    return {
      careerResults: rankedCareers,
      domainResults: rankedDomains,
      recommendedSkills,
      recommendedRoadmaps,
      matchedProjects,
      matchedExams,
    };
  }, [answers, careers, domains, projects, exams, chosenCountry]);

  const buildReason = (reasons: string[]) => {
    if (reasons.length === 0) return 'Aligns with the interests you shared.';
    const list = reasons.slice(0, 3).map((r) => r.toLowerCase());
    return `Reflects your interest in ${list.join(', ')}.`;
  };

  const roadmapTitle = (id: string) =>
    id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const higherStudyNote = useMemo(() => {
    switch (studyStage) {
      case 'school':
      case 'diploma':
        return 'Start by targeting a strong bachelor\'s programme in a biomedical or allied engineering field, then explore specialisations later.';
      case 'undergrad':
        return 'A master\'s degree can deepen a specialisation and open research or advanced industry roles — explore programmes and funding options.';
      case 'postgrad':
        return 'A PhD, research assistantship, or fellowship could suit you if you want to lead research or move into academia.';
      case 'working':
        return 'Part-time master\'s programmes, professional certifications, or targeted upskilling can support a career switch.';
      default:
        return 'Explore study levels and country options to plan your next academic step.';
    }
  }, [studyStage]);

  const nextActions = useMemo(() => {
    const actions: string[] = [];
    const topCareer = results.careerResults[0]?.career;
    const topSkill = results.recommendedSkills[0];
    const topRoadmap = results.recommendedRoadmaps[0];
    const topProject = results.matchedProjects[0];

    if (topCareer) {
      actions.push(`Read the full "${topCareer.name}" career page to understand day-to-day work, skills and progression.`);
    }
    if (skillLevel === 'beginner' && (topRoadmap || topSkill)) {
      actions.push(
        topRoadmap
          ? `Begin the ${roadmapTitle(topRoadmap)} roadmap and complete its first beginner phase.`
          : `Start building a foundation in ${topSkill}.`,
      );
    } else if (skillLevel === 'intermediate' && topProject) {
      actions.push(`Build the "${topProject.title}" project to turn your knowledge into a portfolio piece.`);
    } else if (skillLevel === 'advanced') {
      actions.push(
        chosenEnvironments.includes('research') || chosenEnvironments.includes('academia')
          ? 'Reach out to a research group or professor about a project, thesis, or assistantship.'
          : 'Target an internship or entry-level role and tailor your portfolio to it.',
      );
    } else if (topSkill) {
      actions.push(`Start strengthening ${topSkill}, one of the core skills for your top matches.`);
    }

    // Third action based on stage / environment.
    if (studyStage === 'working' || chosenEnvironments.includes('entrepreneurship')) {
      actions.push('Map the certifications or qualifications relevant to your region and target role, then plan a timeline.');
    } else if (results.recommendedRoadmaps[1]) {
      actions.push(`Explore the ${roadmapTitle(results.recommendedRoadmaps[1])} roadmap to broaden your toolkit.`);
    } else {
      actions.push('Explore your suggested domains to confirm which direction excites you most.');
    }

    return actions.slice(0, 3);
  }, [results, skillLevel, studyStage, chosenEnvironments]);

  const hasResults = results.careerResults.length > 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-28 md:pb-14 bg-card border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Student Interactive Session
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Discover Your Biomedical Path</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Answer twelve short questions about how you study, what excites you, and where you want to go. We'll build a personalised ILMA Career Profile to guide your next steps — not a fixed prediction, but a starting point for exploration.
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
                    Question {stepIndex + 1} of {STEPS.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(((stepIndex + 1) / STEPS.length) * 100)}% complete
                  </span>
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
                  <p className="text-muted-foreground mb-8">
                    {currentStep.subtitle}
                    {currentStep.multi && <span className="ml-1 text-primary/70">(choose one or more)</span>}
                  </p>

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
                          data-testid={`option-${currentStep.key}-${option.id}`}
                        >
                          {selected && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-primary" />}
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
                  data-testid="button-session-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={goNext}
                  disabled={currentSelection.length === 0}
                  className="gap-2"
                  data-testid="button-session-next"
                >
                  {stepIndex === STEPS.length - 1 ? 'See My Profile' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                  <Compass className="w-4 h-4" />
                  Your ILMA Career Profile
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Your ILMA Career Profile</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Suggested career paths based on your responses. These are exploratory suggestions to guide your journey as {STUDY_LABELS[studyStage] ?? 'a learner'} — not a guaranteed prediction of your future.
                </p>
              </div>

              {/* Suggested career paths */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Suggested career paths
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Ranked by how well they match the interests you shared.
                </p>
                {hasResults ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.careerResults.map(({ career, reasons }, index) => (
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
                  <div className="text-center py-12 rounded-2xl bg-accent border border-primary/10">
                    <p className="text-muted-foreground mb-4">
                      We couldn't find a strong match yet. Try selecting a few more interests.
                    </p>
                    <Button onClick={retake} variant="outline" className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Retake the session
                    </Button>
                  </div>
                )}
              </div>

              {/* Suggested domains */}
              {results.domainResults.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-primary" />
                    Suggested domains
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {results.domainResults.map((domain) => {
                      const DomIcon = (Icons as any)[domain.icon] || Icons.Box;
                      return (
                        <Link
                          key={domain.id}
                          href={`/domains/${domain.id}`}
                          className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all"
                          data-testid={`link-domain-${domain.id}`}
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

              {/* Recommended skills */}
              {results.recommendedSkills.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" />
                    Recommended skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {results.recommendedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full bg-accent border border-border text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended projects */}
              {results.matchedProjects.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Recommended projects
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.matchedProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects#${project.id}`}
                        className="group flex flex-col gap-2 p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all"
                        data-testid={`link-project-${project.id}`}
                      >
                        <div className="flex items-center gap-2">
                          {project.difficulty && (
                            <span className="text-[11px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {project.difficulty}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold group-hover:text-primary transition-colors leading-tight">
                          {project.title}
                        </h4>
                        {project.problem && (
                          <p className="text-xs text-muted-foreground line-clamp-3">{project.problem}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended roadmaps */}
              {results.recommendedRoadmaps.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <RouteIcon className="w-5 h-5 text-primary" />
                    Recommended learning roadmaps
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {results.recommendedRoadmaps.map((rid) => (
                      <Link
                        key={rid}
                        href={`/roadmaps/${rid}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 hover:shadow-sm transition-all text-sm font-medium"
                        data-testid={`link-roadmap-${rid}`}
                      >
                        <RouteIcon className="w-4 h-4 text-primary" />
                        {roadmapTitle(rid)}
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Relevant exams / qualifications */}
              {results.matchedExams.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Relevant exams & qualifications
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Matched to your suggested careers and region ({chosenCountry}). Always verify current details on the official source.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.matchedExams.map((exam) => (
                      <Link
                        key={exam.id}
                        href={`/exams/${exam.id}`}
                        className="group flex flex-col gap-2 p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all"
                        data-testid={`link-exam-${exam.id}`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          {exam.qualificationType && (
                            <span className="text-[11px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {exam.qualificationType}
                            </span>
                          )}
                          {exam.country && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground">
                              {exam.country}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold group-hover:text-primary transition-colors leading-tight">
                          {exam.name}
                        </h4>
                        {(exam.purpose || exam.overview) && (
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {exam.purpose ?? exam.overview}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Higher-study pathway */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Suggested higher-study pathway
                </h3>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <p className="text-muted-foreground mb-4">{higherStudyNote}</p>
                  <Link
                    href="/higher-studies"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                    data-testid="link-higher-studies"
                  >
                    Explore higher-study options
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Next 3 actions */}
              {nextActions.length > 0 && (
                <div className="mb-16 p-6 md:p-8 rounded-3xl bg-accent border border-primary/10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-primary" />
                    Your next 3 actions
                  </h3>
                  <ol className="space-y-4">
                    {nextActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="text-sm md:text-base text-foreground leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="outline" onClick={goBack} className="gap-2" data-testid="button-session-edit">
                  <ArrowLeft className="w-4 h-4" />
                  Edit answers
                </Button>
                <Button onClick={retake} variant="outline" size="lg" className="gap-2" data-testid="button-retake-session">
                  <RotateCcw className="w-4 h-4" />
                  Retake session
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
