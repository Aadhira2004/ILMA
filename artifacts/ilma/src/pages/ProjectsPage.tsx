import React, { useEffect, useMemo, useState } from 'react';
import { useSearch, Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { SearchBar } from '@/components/shared/SearchBar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import projectsData from '@/data/projects.json';
import domainsData from '@/data/domains.json';
import roadmapsData from '@/data/roadmaps.json';
import * as Icons from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Research-level';
  problem: string;
  targetUsers: string;
  proposedSolution: string;
  requiredSkills: string[];
  software: string[];
  hardware: string[];
  researchDirection: string;
  futureImprovements: string[];
  relatedDomains: string[];
  relatedRoadmaps: string[];
}

const difficultyStyles: Record<Project['difficulty'], string> = {
  Beginner: 'bg-secondary/10 text-secondary border-secondary/20',
  Intermediate: 'bg-primary/10 text-primary border-primary/20',
  Advanced: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'Research-level': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
};

const difficultyOptions: Array<'All' | Project['difficulty']> = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Research-level',
];

// Lookup maps for internal links to related domains / roadmaps.
const domainNameById: Record<string, string> = Object.fromEntries(
  (domainsData as Array<{ id: string; name: string }>).map((d) => [d.id, d.name])
);
const roadmapTitleById: Record<string, string> = Object.fromEntries(
  (roadmapsData as Array<{ id: string; title: string }>).map((r) => [r.id, r.title])
);

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-1.5">{title}</h4>
      {children}
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Not applicable (software-only).</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-md border border-border bg-accent/50 px-2.5 py-0.5 text-xs font-medium text-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const relatedDomains = project.relatedDomains.filter((id) => domainNameById[id]);
  const relatedRoadmaps = project.relatedRoadmaps.filter((id) => roadmapTitleById[id]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full"
    >
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex flex-col h-full w-full text-left p-6 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                {project.category}
              </span>
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[project.difficulty]}`}
              >
                {project.difficulty}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
              {project.problem}
            </p>

            <div className="mt-auto pt-4 border-t border-border text-sm font-semibold text-primary flex items-center gap-1">
              View project details
              <Icons.ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                {project.category}
              </span>
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[project.difficulty]}`}
              >
                {project.difficulty}
              </span>
            </div>
            <DialogTitle className="text-2xl pr-6">{project.title}</DialogTitle>
            <DialogDescription>{project.proposedSolution}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            <DetailSection title="Problem">
              <p className="text-sm text-muted-foreground leading-relaxed">{project.problem}</p>
            </DetailSection>

            <DetailSection title="Target Users">
              <p className="text-sm text-muted-foreground leading-relaxed">{project.targetUsers}</p>
            </DetailSection>

            <DetailSection title="Required Skills">
              <TagList items={project.requiredSkills} />
            </DetailSection>

            <DetailSection title="Software">
              <TagList items={project.software} />
            </DetailSection>

            <DetailSection title="Hardware">
              <TagList items={project.hardware} />
            </DetailSection>

            <DetailSection title="Research Direction">
              <p className="text-sm text-muted-foreground leading-relaxed">{project.researchDirection}</p>
            </DetailSection>

            <DetailSection title="Future Improvements">
              <ul className="list-disc pl-5 space-y-1">
                {project.futureImprovements.map((improvement) => (
                  <li key={improvement} className="text-sm text-muted-foreground leading-relaxed">
                    {improvement}
                  </li>
                ))}
              </ul>
            </DetailSection>

            {relatedDomains.length > 0 && (
              <DetailSection title="Related Domains">
                <div className="flex flex-wrap gap-2">
                  {relatedDomains.map((id) => (
                    <Link
                      key={id}
                      href={`/domains/${id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      {domainNameById[id]}
                      <Icons.ArrowUpRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </DetailSection>
            )}

            {relatedRoadmaps.length > 0 && (
              <DetailSection title="Related Roadmaps">
                <div className="flex flex-wrap gap-2">
                  {relatedRoadmaps.map((id) => (
                    <Link
                      key={id}
                      href={`/roadmaps/${id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-secondary/20 bg-secondary/5 px-2.5 py-1 text-xs font-medium text-secondary hover:bg-secondary/10 transition-colors"
                    >
                      {roadmapTitleById[id]}
                      <Icons.ArrowUpRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </DetailSection>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default function ProjectsPage() {
  useDocumentMeta(
    'Innovation & Project Hub',
    'Explore real biomedical engineering project ideas across medical devices, AI healthcare, wearables, robotics, and more.'
  );
  useScrollTop();

  const projects = projectsData as Project[];
  const searchString = useSearch();

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category))).sort();
    return ['All', ...unique];
  }, [projects]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState<'All' | Project['difficulty']>('All');

  // Read ?category= from the URL (e.g. links from other pages) and preselect it.
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const requested = params.get('category');
    if (requested && categories.includes(requested)) {
      setActiveCategory(requested);
    }
  }, [searchString, categories]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.problem.toLowerCase().includes(query) ||
        project.proposedSolution.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.requiredSkills.some((skill) => skill.toLowerCase().includes(query));

      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const matchesDifficulty = activeDifficulty === 'All' || project.difficulty === activeDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, activeCategory, activeDifficulty, projects]);

  const isFiltering =
    searchQuery.trim() !== '' || activeCategory !== 'All' || activeDifficulty !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setActiveDifficulty('All');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
              Innovation & Project Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Project Ideas</h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Stuck on what to build? Explore real, buildable biomedical engineering project ideas—from
              beginner devices to research-level challenges. Each one comes with the problem it solves, the
              skills and tools you'll need, and where to take it next.
            </p>

            <SearchBar
              placeholder="Search projects, skills, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl mb-10 shadow-md"
            />

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'bg-background border border-border text-foreground hover:bg-accent hover:border-primary/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-1">Difficulty:</span>
              {difficultyOptions.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setActiveDifficulty(difficulty)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeDifficulty === difficulty
                      ? 'bg-secondary text-secondary-foreground shadow-md scale-105'
                      : 'bg-background border border-border text-foreground hover:bg-accent hover:border-secondary/20'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 md:py-24 bg-background min-h-[50vh]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found
            </h2>
            {isFiltering && (
              <button onClick={clearFilters} className="text-primary font-medium text-sm hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {filteredProjects.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div key={project.id} layout>
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-muted-foreground mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search, category, or difficulty filter.</p>
              <button onClick={clearFilters} className="mt-4 text-primary font-medium hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
