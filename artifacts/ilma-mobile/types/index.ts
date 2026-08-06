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
  careerGrowth: CareerGrowthStage[];
  futureScope: string;
  whoShouldChoose: string[];
  dayInLife: string;
  faqs: FAQ[];
  relatedCareers: string[];
}

export interface CareerGrowthStage {
  stage: string;
  years: string;
  salary: string;
}

export interface FAQ {
  question: string;
  answer: string;
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
  recommendedBooks: DomainBook[];
  certifications: string[];
  relatedDomains: string[];
}

export interface DomainBook {
  title: string;
  author: string;
  description: string;
}

export interface Roadmap {
  id: string;
  title: string;
  icon: string;
  color: string;
  estimatedTimeline: string;
  careerApplications: string[];
  beginner: RoadmapLevel;
  intermediate: RoadmapLevel;
  advanced: RoadmapLevel;
  certifications: string[];
  projects: Project[];
}

export interface RoadmapLevel {
  title: string;
  duration: string;
  topics: string[];
  resources: Resource[];
  project: string;
}

export interface Resource {
  name: string;
  type: string;
  url?: string;
}

export interface Project {
  name: string;
  difficulty: string;
  description: string;
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
  recommendedBooks: ExamBook[];
  careerOpportunities: string[];
}

export interface ExamPattern {
  duration: string;
  totalMarks: number | string;
  sections: ExamSection[];
  questionTypes: string[];
}

export interface ExamSection {
  name: string;
  marks: number | string;
}

export interface SyllabusSection {
  section: string;
  topics: string[];
}

export interface ExamBook {
  title: string;
  author: string;
  subject: string;
}
