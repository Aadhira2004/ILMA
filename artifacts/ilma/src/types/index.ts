export interface CareerGrowth {
  stage: string;
  years: string;
  salary: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Career {
  id: string;
  name: string;
  category: string;
  icon: string;
  salary: string;
  salaryAbroad: string;
  futureScopeRating: number;
  shortDescription: string;
  overview: string;
  responsibilities: string[];
  skillsRequired: string[];
  toolsUsed: string[];
  industries: string[];
  topRecruiters: string[];
  higherStudies: string[];
  certifications: string[];
  careerGrowth: CareerGrowth[];
  futureScope: string;
  whoShouldChoose: string[];
  dayInLife: string;
  faqs: FAQ[];
  relatedCareers: string[];
  roadmaps?: string[];
}

export interface RecommendedBook {
  title: string;
  author: string;
  description?: string;
  subject?: string;
}

export interface Domain {
  id: string;
  name: string;
  icon: string;
  color: string;
  tagline: string;
  overview: string;
  coreSubjects: string[];
  applications: string[];
  industries: string[];
  skillsRequired: string[];
  careerOpportunities: string[];
  futureScope: string;
  recommendedBooks: RecommendedBook[];
  certifications: string[];
  relatedDomains: string[];
  category?: string;
  roadmaps?: string[];
}

export interface RoadmapResource {
  name: string;
  type: string;
  url?: string;
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  topics: string[];
  resources: RoadmapResource[];
  project: string;
}

export interface RoadmapProject {
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string;
  description: string;
}

export interface Roadmap {
  id: string;
  title: string;
  icon: string;
  color: string;
  estimatedTimeline: string;
  careerApplications: string[];
  beginner: RoadmapPhase;
  intermediate: RoadmapPhase;
  advanced: RoadmapPhase;
  certifications: string[];
  projects: RoadmapProject[];
}

export interface ExamSection {
  name: string;
  marks: number | string;
}

export interface ExamPattern {
  duration: string;
  totalMarks: number | string;
  sections: ExamSection[];
  questionTypes: string[];
}

export interface SyllabusSection {
  section: string;
  topics: string[];
}

export interface Exam {
  id: string;
  name: string;
  icon: string;
  category: string;
  conductedBy: string;
  officialWebsite: string;
  overview: string;
  eligibility: string;
  ageLimit: string;
  examPattern: ExamPattern;
  syllabus: SyllabusSection[];
  preparationTips: string[];
  recommendedBooks: RecommendedBook[];
  careerOpportunities: string[];
  qualificationType?: 'Exam' | 'Certification' | 'Professional Registration' | 'Licensure' | 'Qualification' | 'Government Exam' | 'Biomedical Equipment Certification';
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
}