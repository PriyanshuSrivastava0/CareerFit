export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  graduationYear: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'suspended';
  currentDomain?: string;
  careerGoal?: string;
  experienceLevel?: 'Student' | 'Fresher' | 'Junior (1-3 yrs)' | 'Mid (3-5 yrs)' | 'Senior (5+ yrs)';
}

export interface ExtractedPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ExtractedEducation {
  degree: string;
  institution: string;
  graduationYear: string;
  cgpaOrPercentage?: string;
  relevantCoursework: string[];
}

export interface ExtractedSkills {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
  frameworks: string[];
  databases: string[];
}

export interface ExtractedExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  achievements: string[];
}

export interface ExtractedProject {
  id: string;
  name: string;
  technologies: string[];
  description: string;
  impact: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface ExtractedResumeData {
  personalInfo: ExtractedPersonalInfo;
  education: ExtractedEducation[];
  skills: ExtractedSkills;
  experience: ExtractedExperience[];
  projects: ExtractedProject[];
  summary: string;
}

export interface ATSCategoryScore {
  name: string;
  score: number; // 0-100
  maxScore: number;
  weight: number;
  feedback: string;
}

export interface ATSAnalysisResult {
  overallScore: number; // 0-100
  rating: 'Needs Work' | 'Fair' | 'Good' | 'Strong' | 'Exceptional';
  categoryBreakdown: {
    keywordOptimization: ATSCategoryScore;
    skillsRelevance: ATSCategoryScore;
    resumeStructure: ATSCategoryScore;
    experienceImpact: ATSCategoryScore;
    educationClarity: ATSCategoryScore;
    projectsEvaluation: ATSCategoryScore;
    formattingAndLayout: ATSCategoryScore;
    measurableAchievements: ATSCategoryScore;
    contactCompleteness: ATSCategoryScore;
  };
  strengths: string[];
  improvements: string[];
  actionableTips: string[];
  missingCrucialKeywords: string[];
}

export interface CareerRecommendation {
  id: string;
  roleName: string;
  matchPercentage: number;
  readinessLevel: 'High' | 'Medium' | 'Foundational';
  shortDescription: string;
  whyMatches: string[];
  requiredSkills: string[];
  existingSkills: string[];
  missingSkills: string[];
  estimatedLearningWeeks: number;
  averageSalaryRange: string;
  topCompaniesHiring: string[];
}

export interface SkillGapItem {
  skill: string;
  category: 'Languages' | 'Frameworks' | 'Databases' | 'Tools' | 'Core Concepts' | 'Soft Skills';
  currentLevel: number; // 0-100%
  requiredLevel: number; // 0-100%
  gapLevel: 'Low' | 'Medium' | 'High';
  status: 'have' | 'improve' | 'learn';
  whyNeeded: string;
  learningTimeHours: number;
  recommendedYouTubeQuery?: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  notes?: string;
  resourceLinks?: { title: string; url: string; platform: string }[];
  durationDays: number;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  durationText: string;
  description: string;
  tasks: RoadmapTask[];
}

export interface CareerRoadmap {
  id: string;
  careerRoleId: string;
  careerRoleName: string;
  targetDomain: string;
  createdAt: string;
  updatedAt: string;
  overallProgress: number; // 0-100%
  phases: RoadmapPhase[];
}

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  platform: 'YouTube' | 'Documentation' | 'Course' | 'Article' | 'Project';
  channelOrAuthor: string;
  skill: string;
  careerDomain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  description: string;
  thumbnailUrl?: string;
  tags: string[];
  rating: number;
}

export interface RecommendedProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  skillsGained: string[];
  estimatedHours: number;
  architectureSteps: string[];
  portfolioHighlights: string[];
}

export interface JobReadinessMetric {
  category: string;
  score: number; // 0-100%
  weight: number;
  recommendation: string;
}

export interface JobReadinessReport {
  overallScore: number; // 0-100%
  status: 'Needs Preparation' | 'Growing Competency' | 'Job Ready' | 'Industry Benchmark';
  breakdown: {
    skills: JobReadinessMetric;
    resume: JobReadinessMetric;
    projects: JobReadinessMetric;
    experience: JobReadinessMetric;
    interviewPrep: JobReadinessMetric;
    portfolio: JobReadinessMetric;
  };
  topNextActions: string[];
  estimatedDaysToReady: number;
}

export interface ResumeDocument {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  rawText: string;
  uploadedAt: string;
  extractedData?: ExtractedResumeData;
  atsAnalysis?: ATSAnalysisResult;
  preferredDomain?: string;
  recommendations?: CareerRecommendation[];
  selectedCareer?: CareerRecommendation;
  skillGaps?: SkillGapItem[];
  roadmap?: CareerRoadmap;
  jobReadiness?: JobReadinessReport;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionType: string; payload?: string }[];
}

export interface AdminAnalytics {
  totalUsers: number;
  activeUsers: number;
  resumesUploaded: number;
  analysesCompleted: number;
  averageAtsScore: number;
  averageReadinessScore: number;
  topDomains: { name: string; count: number; percentage: number }[];
  topRecommendedCareers: { name: string; count: number }[];
  popularSkills: { name: string; gapFrequency: number }[];
  resourceClicksCount: number;
}
