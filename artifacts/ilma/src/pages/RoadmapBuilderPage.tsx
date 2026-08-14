import React, { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion, AnimatePresence } from 'framer-motion';
import careersData from '@/data/careers.json';
import domainsData from '@/data/domains.json';
import roadmapsData from '@/data/roadmaps.json';
import projectsData from '@/data/projects.json';
import examsData from '@/data/exams.json';
import higherStudiesData from '@/data/higherStudies.json';
import { Career, Domain, Roadmap } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import * as Icons from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Route as RouteIcon,
} from 'lucide-react';

/**
 * Local, defensive extension of the Exam type. exams.json optionally carries
 * these fields on some entries (shared exam schema extension). We never assume
 * they exist and always guard access.
 */
interface ExtendedExam {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  conductedBy?: string;
  officialWebsite?: string;
  qualificationType?: string;
  country?: string;
  region?: string;
  relatedCareers?: string[];
  relatedDomains?: string[];
}

interface ProjectEntry {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  problem: string;
  relatedDomains?: string[];
  requiredSkills?: string[];
}

interface HigherStudyCountry {
  id: string;
  name: string;
  flag?: string;
  overview?: string;
  admissionNotes?: string;
}

const careers = careersData as Career[];
const domains = domainsData as Domain[];
const roadmaps = roadmapsData as Roadmap[];
const projects = projectsData as ProjectEntry[];
const exams = examsData as ExtendedExam[];
const higherStudyCountries = (higherStudiesData as { countries?: HigherStudyCountry[] }).countries ?? [];

// ---------- Static option lists ----------

const EDUCATION_LEVELS = [
  { id: 'high-school', label: 'High school', icon: 'GraduationCap' as const },
  { id: 'diploma', label: 'Diploma', icon: 'BookOpen' as const },
  { id: 'bachelors-student', label: "Bachelor's student", icon: 'School' as const },
  { id: 'bachelors-graduate', label: "Bachelor's graduate", icon: 'Award' as const },
  { id: 'masters', label: "Master's", icon: 'Medal' as const },
  { id: 'phd', label: 'PhD', icon: 'Microscope' as const },
];

const FIELD_OPTIONS = [
  'Biomedical Engineering',
  'Electronics / Electrical Engineering',
  'Computer Science / IT',
  'Mechanical Engineering',
  'Biology / Life Sciences',
  'Biotechnology',
  'Physics',
  'Chemistry',
  'Medicine / Allied Health',
  'Mathematics / Statistics',
  'Other / Not sure',
];

// Global country list (no single country as the main focus). 'Not sure' included.
const COUNTRIES = [
  'Not sure',
  'Global',
  'Australia',
  'Brazil',
  'Canada',
  'China',
  'France',
  'Germany',
  'India',
  'Italy',
  'Japan',
  'Netherlands',
  'Singapore',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Kingdom',
  'United States',
  'Other',
];

const PREFERENCES = [
  { id: 'Research', label: 'Research', icon: 'Microscope' as const },
  { id: 'Industry', label: 'Industry', icon: 'Factory' as const },
  { id: 'Academia', label: 'Academia', icon: 'GraduationCap' as const },
  { id: 'Clinical', label: 'Clinical', icon: 'Stethoscope' as const },
  { id: 'Entrepreneurship', label: 'Entrepreneurship', icon: 'Rocket' as const },
];

const HIGHER_STUDY_OPTIONS = [
  { id: 'yes', label: 'Yes', icon: 'ThumbsUp' as const },
  { id: 'maybe', label: 'Maybe', icon: 'HelpCircle' as const },
  { id: 'no', label: 'No', icon: 'ThumbsDown' as const },
];

// Common skills derived from roadmaps.json topics + career/domain skill vocabulary.
const COMMON_SKILLS = [
  { id: 'programming', label: 'Programming', icon: 'Code' as const },
  { id: 'python', label: 'Python', icon: 'Terminal' as const },
  { id: 'matlab', label: 'MATLAB', icon: 'Sigma' as const },
  { id: 'electronics', label: 'Electronics', icon: 'CircuitBoard' as const },
  { id: 'embedded', label: 'Embedded systems', icon: 'Cpu' as const },
  { id: 'cad', label: 'CAD / 3D modelling', icon: 'PenTool' as const },
  { id: 'biology', label: 'Biology', icon: 'Dna' as const },
  { id: 'data-analysis', label: 'Data analysis', icon: 'BarChart3' as const },
  { id: 'machine-learning', label: 'Machine learning', icon: 'BrainCircuit' as const },
  { id: 'signal-processing', label: 'Signal processing', icon: 'Activity' as const },
  { id: 'image-processing', label: 'Medical image processing', icon: 'ScanLine' as const },
  { id: 'pcb-design', label: 'PCB design', icon: 'CircuitBoard' as const },
  { id: 'statistics', label: 'Statistics', icon: 'Sigma' as const },
  { id: 'lab-techniques', label: 'Lab techniques', icon: 'FlaskConical' as const },
  { id: 'regulatory', label: 'Regulatory knowledge', icon: 'ShieldCheck' as const },
  { id: 'research-writing', label: 'Research / technical writing', icon: 'FileText' as const },
];

// Keyword mapping so we can compare a selected skill against a career's
// free-text skillsRequired entries (best-effort, defensive).
const SKILL_KEYWORDS: Record<string, string[]> = {
  programming: ['program', 'coding', 'software', 'c++', 'c ', 'java'],
  python: ['python'],
  matlab: ['matlab'],
  electronics: ['electronic', 'circuit', 'analog', 'analogue'],
  embedded: ['embedded', 'microcontroller', 'firmware'],
  cad: ['cad', 'solidworks', '3d model', 'design software', 'modelling', 'modeling'],
  biology: ['biolog', 'anatomy', 'physiology', 'cell', 'molecular'],
  'data-analysis': ['data analysis', 'data analytics', 'analytics', 'data science'],
  'machine-learning': ['machine learning', 'deep learning', 'ai', 'artificial intelligence', 'neural'],
  'signal-processing': ['signal processing', 'signal', 'dsp'],
  'image-processing': ['image processing', 'imaging', 'computer vision'],
  'pcb-design': ['pcb'],
  statistics: ['statistic', 'biostatistic', 'probability'],
  'lab-techniques': ['lab', 'laboratory', 'assay', 'wet lab'],
  regulatory: ['regulatory', 'fda', 'iso', 'compliance', 'quality'],
  'research-writing': ['writing', 'documentation', 'communication', 'publication'],
};

const STEP_KEYS = [
  'education',
  'field',
  'countries',
  'career',
  'domain',
  'skills',
  'preference',
  'higherStudy',
] as const;

const TOTAL_STEPS = STEP_KEYS.length;

interface FormState {
  education: string;
  field: string;
  homeCountry: string;
  targetCountry: string;
  careerId: string; // '' or 'not-sure' or a real career id
  domainId: string; // '' or a real domain id
  skills: string[];
  preference: string;
  higherStudy: string;
}

const INITIAL_STATE: FormState = {
  education: '',
  field: '',
  homeCountry: '',
  targetCountry: '',
  careerId: '',
  domainId: '',
  skills: [],
  preference: '',
  higherStudy: '',
};

const educationLabel = (id: string) => EDUCATION_LEVELS.find((e) => e.id === id)?.label ?? id;
const domainCategories = Array.from(new Set(domains.map((d) => d.category).filter(Boolean))) as string[];

export default function RoadmapBuilderPage() {
  useDocumentMeta(
    'Build My Roadmap',
    'Answer a few questions about your education, goals, and skills to generate a personalized biomedical engineering roadmap built from real careers, domains, projects, and qualifications.'
  );
  useScrollTop();

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [showResults, setShowResults] = useState(false);
  const [careerSearch, setCareerSearch] = useState('');

  const currentKey = STEP_KEYS[stepIndex];

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSkill = (skillId: string) =>
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((s) => s !== skillId)
        : [...prev.skills, skillId],
    }));

  // Whether the current step allows advancing.
  const canAdvance = useMemo(() => {
    switch (currentKey) {
      case 'education':
        return !!form.education;
      case 'field':
        return !!form.field;
      case 'countries':
        return !!form.homeCountry && !!form.targetCountry;
      case 'career':
        return !!form.careerId; // includes 'not-sure'
      case 'domain':
        return !!form.domainId; // includes 'not-sure'
      case 'skills':
        return true; // skills optional
      case 'preference':
        return !!form.preference;
      case 'higherStudy':
        return !!form.higherStudy;
      default:
        return false;
    }
  }, [currentKey, form]);

  const goNext = () => {
    if (stepIndex < TOTAL_STEPS - 1) {
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

  const rebuild = () => {
    setForm(INITIAL_STATE);
    setStepIndex(0);
    setShowResults(false);
    setDirection(1);
    setCareerSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editAnswers = () => {
    setShowResults(false);
    setStepIndex(0);
    setDirection(-1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = ((showResults ? TOTAL_STEPS : stepIndex + 1) / TOTAL_STEPS) * 100;

  const filteredCareers = useMemo(() => {
    const q = careerSearch.trim().toLowerCase();
    if (!q) return careers;
    return careers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [careerSearch]);

  // ---------- Derived roadmap ----------
  const roadmap = useMemo(() => {
    const selectedCareer = careers.find((c) => c.id === form.careerId) ?? null;
    const selectedDomain = domains.find((d) => d.id === form.domainId) ?? null;

    // WHAT TO LEARN — core subjects from domain, plus responsibilities framing from career.
    const coreSubjects: string[] = [];
    if (selectedDomain?.coreSubjects?.length) coreSubjects.push(...selectedDomain.coreSubjects);
    if (!coreSubjects.length && selectedCareer) {
      // Fall back to a related domain of the career if any.
      const relDomain = domains.find((d) => selectedCareer.relatedCareers?.includes?.(d.id));
      if (relDomain?.coreSubjects?.length) coreSubjects.push(...relDomain.coreSubjects);
    }

    // SKILLS TO DEVELOP — career skillsRequired the student hasn't ticked yet.
    const selectedSkillKeywords = form.skills.flatMap((s) => SKILL_KEYWORDS[s] ?? []);
    const alreadyHas = (skill: string) => {
      const lower = skill.toLowerCase();
      return selectedSkillKeywords.some((kw) => lower.includes(kw));
    };
    const careerSkills = selectedCareer?.skillsRequired ?? [];
    const domainSkills = selectedDomain?.skillsRequired ?? [];
    const allTargetSkills = Array.from(new Set([...careerSkills, ...domainSkills]));
    const skillGap = allTargetSkills.filter((s) => !alreadyHas(s));

    // PROJECTS — match by relatedDomains, then optionally by difficulty vs education level.
    const domainIdsForMatch = new Set<string>();
    if (selectedDomain) domainIdsForMatch.add(selectedDomain.id);
    if (selectedDomain?.relatedDomains) selectedDomain.relatedDomains.forEach((d) => domainIdsForMatch.add(d));

    const beginnerLevels = new Set(['high-school', 'diploma', 'bachelors-student']);
    const preferBeginner = beginnerLevels.has(form.education);

    let matchedProjects = projects.filter((p) =>
      (p.relatedDomains ?? []).some((d) => domainIdsForMatch.has(d))
    );
    if (!matchedProjects.length && selectedDomain) {
      // no direct match — fall back to same category projects
      matchedProjects = projects.filter((p) => p.category === selectedDomain.category);
    }
    // Sort so appropriate difficulty comes first.
    matchedProjects = [...matchedProjects].sort((a, b) => {
      const rank = (d: string) => {
        const order = preferBeginner
          ? ['Beginner', 'Intermediate', 'Advanced', 'Research-level']
          : ['Advanced', 'Research-level', 'Intermediate', 'Beginner'];
        const idx = order.indexOf(d);
        return idx === -1 ? order.length : idx;
      };
      return rank(a.difficulty) - rank(b.difficulty);
    });
    matchedProjects = matchedProjects.slice(0, 4);

    // EXAMS / QUALIFICATIONS — filter by relatedCareers/relatedDomains and country membership.
    const countryFilter = new Set(
      [form.homeCountry, form.targetCountry, 'Global'].filter(
        (c) => c && c !== 'Not sure' && c !== 'Other'
      )
    );
    const matchedExams = exams.filter((exam) => {
      const relCareerMatch =
        selectedCareer && (exam.relatedCareers ?? []).includes(selectedCareer.id);
      const relDomainMatch =
        selectedDomain && (exam.relatedDomains ?? []).includes(selectedDomain.id);
      if (!relCareerMatch && !relDomainMatch) return false;
      // Country is optional; if present, it must be in the filter (or filter empty).
      if (exam.country && countryFilter.size > 0) {
        return countryFilter.has(exam.country);
      }
      return true;
    });

    // CERTIFICATIONS — from career (and domain fallback).
    const certifications = Array.from(
      new Set([...(selectedCareer?.certifications ?? []), ...(selectedDomain?.certifications ?? [])])
    );

    // ROADMAPS to follow — from career/domain roadmaps if present.
    const roadmapIds = Array.from(
      new Set([...(selectedCareer?.roadmaps ?? []), ...(selectedDomain?.roadmaps ?? [])])
    );
    const linkedRoadmaps = roadmapIds
      .map((id) => roadmaps.find((r) => r.id === id))
      .filter((r): r is Roadmap => !!r)
      .slice(0, 4);

    // HIGHER STUDIES — target country note if we have it.
    const targetStudyCountry =
      higherStudyCountries.find(
        (c) => c.name?.toLowerCase() === form.targetCountry?.toLowerCase()
      ) ?? null;
    const higherStudies = selectedCareer?.higherStudies ?? selectedDomain?.certifications ?? [];

    // CAREER — entry-level stage from career growth.
    const entryStage = selectedCareer?.careerGrowth?.[0] ?? null;

    return {
      selectedCareer,
      selectedDomain,
      coreSubjects: coreSubjects.slice(0, 10),
      skillGap: skillGap.slice(0, 10),
      matchedProjects,
      matchedExams,
      certifications: certifications.slice(0, 8),
      linkedRoadmaps,
      targetStudyCountry,
      higherStudies: (higherStudies ?? []).slice(0, 6),
      entryStage,
    };
  }, [form]);

  // ---------- Render helpers ----------

  const OptionGrid = ({
    options,
    selected,
    onSelect,
    multi = false,
  }: {
    options: Array<{ id: string; label: string; icon: keyof typeof Icons }>;
    selected: string[];
    onSelect: (id: string) => void;
    multi?: boolean;
  }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {options.map((option) => {
        const OptIcon = (Icons as any)[option.icon] || Icons.Sparkles;
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`relative flex flex-col items-center justify-center text-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
            }`}
            data-testid={`option-${option.id}`}
          >
            {isSelected && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-primary" />}
            <div
              className={`p-3 rounded-xl transition-colors ${
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-accent text-primary'
              }`}
            >
              <OptIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold leading-tight">{option.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderStep = () => {
    switch (currentKey) {
      case 'education':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What's your current education level?</h2>
            <p className="text-muted-foreground mb-8">Pick the option that best describes where you are now.</p>
            <OptionGrid
              options={EDUCATION_LEVELS}
              selected={[form.education]}
              onSelect={(id) => setField('education', id)}
            />
          </>
        );
      case 'field':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What's your current field?</h2>
            <p className="text-muted-foreground mb-8">Your background helps us frame the suggestions.</p>
            <div className="max-w-md">
              <Select value={form.field} onValueChange={(v) => setField('field', v)}>
                <SelectTrigger data-testid="select-field">
                  <SelectValue placeholder="Select your field" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'countries':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Where are you, and where do you want to go?</h2>
            <p className="text-muted-foreground mb-8">
              Choose your home country and a target country for study or work. Pick "Not sure" if you're still deciding.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold mb-2">Home country</label>
                <Select value={form.homeCountry} onValueChange={(v) => setField('homeCountry', v)}>
                  <SelectTrigger data-testid="select-home-country">
                    <SelectValue placeholder="Select home country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Target country</label>
                <Select value={form.targetCountry} onValueChange={(v) => setField('targetCountry', v)}>
                  <SelectTrigger data-testid="select-target-country">
                    <SelectValue placeholder="Select target country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 'career': {
        const selectedCareer = careers.find((c) => c.id === form.careerId);
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What's your career goal?</h2>
            <p className="text-muted-foreground mb-8">
              Search and select a biomedical career, or choose "Not sure yet" if you're still exploring.
            </p>
            <button
              type="button"
              onClick={() => setField('careerId', 'not-sure')}
              className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                form.careerId === 'not-sure'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
              data-testid="option-career-not-sure"
            >
              {form.careerId === 'not-sure' && <CheckCircle2 className="w-4 h-4" />}
              Not sure yet
            </button>
            <div className="max-w-xl rounded-2xl border border-border bg-card overflow-hidden">
              <Command shouldFilter={false}>
                <CommandInput
                  value={careerSearch}
                  onValueChange={setCareerSearch}
                  placeholder="Search careers..."
                  data-testid="input-career-search"
                />
                <CommandList>
                  <CommandEmpty>No matching careers.</CommandEmpty>
                  <CommandGroup>
                    {filteredCareers.slice(0, 40).map((c) => (
                      <CommandItem
                        key={c.id}
                        value={c.id}
                        onSelect={() => setField('careerId', c.id)}
                        className="flex items-center justify-between"
                      >
                        <span>
                          <span className="font-medium">{c.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{c.category}</span>
                        </span>
                        {form.careerId === c.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            {selectedCareer && (
              <p className="mt-4 text-sm text-primary font-medium">Selected: {selectedCareer.name}</p>
            )}
          </>
        );
      }
      case 'domain': {
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Which biomedical domain interests you?</h2>
            <p className="text-muted-foreground mb-8">Choose a domain area, or "Not sure" to keep it open.</p>
            <button
              type="button"
              onClick={() => setField('domainId', 'not-sure')}
              className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                form.domainId === 'not-sure'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
              data-testid="option-domain-not-sure"
            >
              {form.domainId === 'not-sure' && <CheckCircle2 className="w-4 h-4" />}
              Not sure
            </button>
            <div className="space-y-6">
              {domainCategories.map((cat) => {
                const catDomains = domains.filter((d) => d.category === cat);
                if (!catDomains.length) return null;
                return (
                  <div key={cat}>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {catDomains.map((d) => {
                        const isSelected = form.domainId === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setField('domainId', d.id)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border bg-card hover:border-primary/40'
                            }`}
                            data-testid={`option-domain-${d.id}`}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                            {d.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      }
      case 'skills':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Which skills do you already have?</h2>
            <p className="text-muted-foreground mb-8">
              Select all that apply. We'll use this to show what's left to develop. (Optional)
            </p>
            <OptionGrid options={COMMON_SKILLS} selected={form.skills} onSelect={toggleSkill} multi />
          </>
        );
      case 'preference':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What kind of path appeals to you?</h2>
            <p className="text-muted-foreground mb-8">Pick the direction you'd most like to head towards.</p>
            <OptionGrid
              options={PREFERENCES}
              selected={[form.preference]}
              onSelect={(id) => setField('preference', id)}
            />
          </>
        );
      case 'higherStudy':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Are you interested in higher studies?</h2>
            <p className="text-muted-foreground mb-8">Master's, PhD, or advanced programs abroad or at home.</p>
            <OptionGrid
              options={HIGHER_STUDY_OPTIONS}
              selected={[form.higherStudy]}
              onSelect={(id) => setField('higherStudy', id)}
            />
          </>
        );
      default:
        return null;
    }
  };

  // ---------- Results (vertical stepper) ----------

  const StepperNode = ({
    icon,
    title,
    accent = false,
    children,
  }: {
    icon: keyof typeof Icons;
    title: string;
    accent?: boolean;
    children: React.ReactNode;
  }) => {
    const NodeIcon = (Icons as any)[icon] || Icons.Circle;
    return (
      <li className="relative flex gap-4 pb-8 last:pb-0">
        <div
          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
            accent
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-primary/10 text-primary border-primary/20'
          }`}
        >
          <NodeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-lg font-bold mb-3">{title}</h3>
          {children}
        </div>
      </li>
    );
  };

  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent border border-border text-sm text-foreground/80">
      {children}
    </span>
  );

  const renderResults = () => {
    const {
      selectedCareer,
      selectedDomain,
      coreSubjects,
      skillGap,
      matchedProjects,
      matchedExams,
      certifications,
      linkedRoadmaps,
      targetStudyCountry,
      higherStudies,
      entryStage,
    } = roadmap;

    return (
      <div>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <RouteIcon className="w-4 h-4" />
            Your Personalized Roadmap
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Personalized Roadmap</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every step below is suggested based on your selections and drawn from ILMA's real career,
            domain, project, and qualification data.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Chip>{educationLabel(form.education)}</Chip>
            {form.field && <Chip>{form.field}</Chip>}
            {selectedCareer ? <Chip>{selectedCareer.name}</Chip> : <Chip>Career: exploring</Chip>}
            {selectedDomain ? <Chip>{selectedDomain.name}</Chip> : <Chip>Domain: open</Chip>}
            {form.preference && <Chip>{form.preference}</Chip>}
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-3 bottom-3 w-px bg-border" />
          <ol className="relative">
            {/* CURRENT LEVEL */}
            <StepperNode icon="MapPin" title="Current Level" accent>
              <p className="text-sm text-muted-foreground">
                You're at <span className="font-semibold text-foreground">{educationLabel(form.education)}</span>
                {form.field ? (
                  <>
                    {' '}with a background in <span className="font-semibold text-foreground">{form.field}</span>
                  </>
                ) : null}
                . {form.homeCountry && form.homeCountry !== 'Not sure' ? `Based in ${form.homeCountry}. ` : ''}
                {form.targetCountry && form.targetCountry !== 'Not sure'
                  ? `Aiming towards ${form.targetCountry}.`
                  : ''}
              </p>
            </StepperNode>

            {/* WHAT TO LEARN */}
            <StepperNode icon="BookOpen" title="What to Learn">
              {coreSubjects.length ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Core subjects suggested based on your selections
                    {selectedDomain ? (
                      <>
                        {' '}(from{' '}
                        <Link href={`/domains/${selectedDomain.id}`} className="text-primary font-medium hover:underline">
                          {selectedDomain.name}
                        </Link>
                        )
                      </>
                    ) : null}
                    :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {coreSubjects.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Choose a domain to see the core subjects to focus on. Meanwhile, explore all{' '}
                  <Link href="/domains" className="text-primary font-medium hover:underline">
                    domains
                  </Link>
                  .
                </p>
              )}
            </StepperNode>

            {/* SKILLS TO DEVELOP */}
            <StepperNode icon="Target" title="Skills to Develop">
              {skillGap.length ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Skills suggested based on your selections that aren't yet in your toolkit:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedCareer || selectedDomain
                    ? 'Great — the selected skills already cover the key requirements we can map. Keep deepening them with projects below.'
                    : 'Select a career or domain to see the skills to develop.'}
                </p>
              )}
              {linkedRoadmaps.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Follow these skill roadmaps:</p>
                  <div className="flex flex-col gap-2">
                    {linkedRoadmaps.map((r) => {
                      const RmIcon = (Icons as any)[r.icon] || Icons.Map;
                      return (
                        <Link
                          key={r.id}
                          href={`/roadmaps/${r.id}`}
                          className="group inline-flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                        >
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${r.color}20`, color: r.color }}
                          >
                            <RmIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                            {r.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </StepperNode>

            {/* PROJECTS TO BUILD */}
            <StepperNode icon="FolderGit2" title="Projects to Build">
              {matchedProjects.length ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Hands-on projects suggested based on your selections:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedProjects.map((p) => (
                      <Link
                        key={p.id}
                        href="/projects"
                        className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {p.title}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent border border-border shrink-0">
                            {p.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{p.problem}</p>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Browse the full{' '}
                  <Link href="/projects" className="text-primary font-medium hover:underline">
                    project library
                  </Link>{' '}
                  to find something that fits your interests.
                </p>
              )}
            </StepperNode>

            {/* EXAMS / QUALIFICATIONS */}
            <StepperNode icon="ClipboardCheck" title="Exams & Qualifications">
              {matchedExams.length ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Qualifications suggested based on your selections and chosen locations:
                  </p>
                  <div className="flex flex-col gap-2">
                    {matchedExams.map((exam) => {
                      const ExamIcon = (Icons as any)[exam.icon || ''] || Icons.Award;
                      return (
                        <Link
                          key={exam.id}
                          href={`/exams/${exam.id}`}
                          className="group flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-accent text-primary shrink-0">
                            <ExamIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-sm group-hover:text-primary transition-colors block truncate">
                              {exam.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {[exam.qualificationType, exam.country].filter(Boolean).join(' · ')}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  We couldn't map a specific exam to these selections. Requirements vary widely by country —
                  explore what's available and always confirm details on the official body's website.
                </p>
              )}
            </StepperNode>

            {/* CERTIFICATIONS */}
            <StepperNode icon="BadgeCheck" title="Certifications">
              {certifications.length ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Certifications suggested based on your selections:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((c) => (
                      <Chip key={c}>{c}</Chip>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a career or domain to see relevant certifications.
                </p>
              )}
            </StepperNode>

            {/* INTERNSHIPS */}
            <StepperNode icon="Briefcase" title="Internships">
              <p className="text-sm text-muted-foreground mb-3">
                Gain real experience through internships, research assistantships, and industry
                placements. Target the recruiters and industries linked to your chosen career, and
                start applying early in your program.
              </p>
              {selectedCareer?.topRecruiters?.length ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCareer.topRecruiters.slice(0, 6).map((r) => (
                    <Chip key={r}>{r}</Chip>
                  ))}
                </div>
              ) : null}
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
              >
                Browse opportunities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </StepperNode>

            {/* HIGHER STUDIES */}
            <StepperNode icon="GraduationCap" title="Higher Studies">
              {form.higherStudy === 'no' ? (
                <p className="text-sm text-muted-foreground mb-3">
                  You indicated higher studies aren't a priority right now — but options stay open as your
                  goals evolve.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mb-3">
                  {form.higherStudy === 'maybe'
                    ? 'If you decide to pursue advanced study, here are suggestions based on your selections.'
                    : 'Advanced study options suggested based on your selections:'}
                </p>
              )}
              {higherStudies.length ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {higherStudies.map((h) => (
                    <Chip key={h}>{h}</Chip>
                  ))}
                </div>
              ) : null}
              {targetStudyCountry && (
                <div className="p-4 rounded-xl bg-accent border border-primary/10 mb-3">
                  <p className="text-sm font-semibold mb-1">
                    {targetStudyCountry.flag ? `${targetStudyCountry.flag} ` : ''}
                    Studying in {targetStudyCountry.name}
                  </p>
                  {targetStudyCountry.admissionNotes && (
                    <p className="text-sm text-muted-foreground">{targetStudyCountry.admissionNotes}</p>
                  )}
                </div>
              )}
              <Link
                href="/higher-studies"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
              >
                Explore higher studies
                <ArrowRight className="w-4 h-4" />
              </Link>
            </StepperNode>

            {/* CAREER */}
            <StepperNode icon="Rocket" title="Career" accent>
              {selectedCareer ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your entry-level target, suggested based on your selections:
                  </p>
                  {entryStage ? (
                    <div className="p-4 rounded-xl bg-card border border-border mb-3">
                      <p className="font-semibold">{entryStage.stage}</p>
                      <p className="text-sm text-muted-foreground">
                        {entryStage.years}
                        {entryStage.salary ? ` · ${entryStage.salary}` : ''}
                      </p>
                    </div>
                  ) : null}
                  <Link
                    href={`/careers/${selectedCareer.id}`}
                    className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
                  >
                    View full career: {selectedCareer.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Explore{' '}
                  <Link href="/careers" className="text-primary font-medium hover:underline">
                    all careers
                  </Link>{' '}
                  or take the{' '}
                  <Link href="/career-match" className="text-primary font-medium hover:underline">
                    career match quiz
                  </Link>{' '}
                  to find a direction.
                </p>
              )}
            </StepperNode>
          </ol>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <Button onClick={editAnswers} variant="outline" size="lg" className="gap-2" data-testid="button-edit-answers">
            <ArrowLeft className="w-4 h-4" />
            Edit answers
          </Button>
          <Button onClick={rebuild} size="lg" className="gap-2" data-testid="button-rebuild">
            <RotateCcw className="w-4 h-4" />
            Rebuild roadmap
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-28 md:pb-14 bg-card border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Build My Roadmap
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Build My Roadmap</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Answer a few questions about where you are, where you want to go, and what you already
              know. We'll assemble a personalized, step-by-step biomedical roadmap from real careers,
              domains, projects, and qualifications.
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
                    Step {stepIndex + 1} of {TOTAL_STEPS}
                  </span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={false}
                    animate={{ width: `${((stepIndex + 1) / TOTAL_STEPS) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentKey}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              {/* Nav */}
              <div className="flex items-center justify-between mt-12">
                <Button
                  variant="outline"
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className="gap-2"
                  data-testid="button-builder-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={goNext}
                  disabled={!canAdvance}
                  className="gap-2"
                  data-testid="button-builder-next"
                >
                  {stepIndex === TOTAL_STEPS - 1 ? 'Build Roadmap' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            renderResults()
          )}
        </div>
      </section>
    </Layout>
  );
}
