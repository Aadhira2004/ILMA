import type { Career, Domain, Roadmap, Exam } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const careersData = require('../../ilma/src/data/careers.json') as Career[];
// eslint-disable-next-line @typescript-eslint/no-require-imports
const domainsData = require('../../ilma/src/data/domains.json') as Domain[];
// eslint-disable-next-line @typescript-eslint/no-require-imports
const roadmapsData = require('../../ilma/src/data/roadmaps.json') as Roadmap[];
// eslint-disable-next-line @typescript-eslint/no-require-imports
const examsData = require('../../ilma/src/data/exams.json') as Exam[];

export const careers: Career[] = careersData;
export const domains: Domain[] = domainsData;
export const roadmaps: Roadmap[] = roadmapsData;
export const exams: Exam[] = examsData;

export const CAREER_CATEGORIES = [
  'All',
  'Hospital',
  'Medical Devices',
  'Government',
  'Research',
  'AI',
  'Healthcare IT',
];

export const CATEGORY_COLORS: Record<string, string> = {
  Hospital: '#0F4C81',
  'Medical Devices': '#1AB7B0',
  Government: '#8B5CF6',
  Research: '#EC4899',
  AI: '#F43F5E',
  'Healthcare IT': '#10B981',
};

export function getCareerById(id: string): Career | undefined {
  return careers.find((c) => c.id === id);
}

export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}

export function getRoadmapById(id: string): Roadmap | undefined {
  return roadmaps.find((r) => r.id === id);
}

export function getExamById(id: string): Exam | undefined {
  return exams.find((e) => e.id === id);
}
