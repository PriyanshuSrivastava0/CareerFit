import {
  UserProfile,
  ExtractedResumeData,
  ATSAnalysisResult,
  CareerRecommendation,
  SkillGapItem,
  CareerRoadmap,
  LearningResource,
  RecommendedProject,
  JobReadinessReport,
  ResumeDocument,
  ChatMessage,
  AdminAnalytics
} from '../src/types';
import {
  INITIAL_CAREER_DOMAINS,
  INITIAL_SKILLS_TAXONOMY,
  INITIAL_LEARNING_RESOURCES,
  INITIAL_PROJECT_RECOMMENDATIONS,
  SAMPLE_RESUMES
} from '../src/data/mockDatabase';

interface DatabaseState {
  users: (UserProfile & { passwordHash: string; otpCode?: string; otpExpiresAt?: number })[];
  admins: { id: string; email: string; passwordHash: string; name: string; role: 'admin' }[];
  resumes: ResumeDocument[];
  skills: typeof INITIAL_SKILLS_TAXONOMY;
  careers: {
    id: string;
    roleName: string;
    domain: string;
    requiredSkills: string[];
    skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    averageSalaryRange: string;
    shortDescription: string;
    topCompaniesHiring: string[];
  }[];
  learningResources: LearningResource[];
  projects: RecommendedProject[];
  chatHistory: Record<string, ChatMessage[]>;
  analytics: AdminAnalytics;
}

const INITIAL_CAREERS = [
  {
    id: 'car-1',
    roleName: 'Full Stack Developer',
    domain: 'Full Stack Development',
    requiredSkills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js & Express', 'PostgreSQL & SQL', 'Git & GitHub CI/CD', 'REST APIs'],
    skillLevel: 'Intermediate' as const,
    averageSalaryRange: '₹8,00,000 - ₹18,00,000 / $85k - $140k',
    shortDescription: 'Build end-to-end web applications managing modern reactive frontends, resilient REST/GraphQL APIs, and relational databases.',
    topCompaniesHiring: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Swiggy', 'Razorpay', 'Atlassian']
  },
  {
    id: 'car-2',
    roleName: 'Frontend Engineer (React)',
    domain: 'Frontend Development',
    requiredSkills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'HTML5 & CSS3', 'Tailwind CSS', 'State Management', 'Web Performance'],
    skillLevel: 'Intermediate' as const,
    averageSalaryRange: '₹7,00,000 - ₹16,00,000 / $80k - $130k',
    shortDescription: 'Architect pixel-perfect, accessible, and high-performance interactive interfaces for web applications.',
    topCompaniesHiring: ['Meta', 'Uber', 'Airbnb', 'Zomato', 'Cred', 'Stripe']
  },
  {
    id: 'car-3',
    roleName: 'Backend & Systems Engineer',
    domain: 'Backend Development',
    requiredSkills: ['Node.js & Express', 'PostgreSQL & SQL', 'System Design & REST APIs', 'Docker & Kubernetes', 'AWS Cloud Services', 'Caching (Redis)'],
    skillLevel: 'Advanced' as const,
    averageSalaryRange: '₹9,00,000 - ₹20,00,000 / $95k - $155k',
    shortDescription: 'Design high-throughput distributed microservices, database schemas, secure authentication pipelines, and cloud APIs.',
    topCompaniesHiring: ['Netflix', 'Amazon Web Services', 'Paytm', 'Oracle', 'Salesforce']
  },
  {
    id: 'car-4',
    roleName: 'Data Scientist & AI Specialist',
    domain: 'Data Science & AI',
    requiredSkills: ['Python & Pandas', 'Machine Learning (Scikit-Learn/TensorFlow)', 'PostgreSQL & SQL', 'Statistical Modeling', 'Data Visualization'],
    skillLevel: 'Advanced' as const,
    averageSalaryRange: '₹10,00,000 - ₹22,00,000 / $100k - $160k',
    shortDescription: 'Extract actionable intelligence from large datasets, train predictive ML models, and deploy AI solutions.',
    topCompaniesHiring: ['Google DeepMind', 'Fractal Analytics', 'Microsoft', 'Mu Sigma', 'JPMorgan Chase']
  },
  {
    id: 'car-5',
    roleName: 'Cybersecurity & Security Analyst',
    domain: 'Cybersecurity',
    requiredSkills: ['Cybersecurity Fundamentals & OWASP', 'Network Protocols (TCP/IP)', 'Linux Administration', 'Penetration Testing', 'Incident Response'],
    skillLevel: 'Intermediate' as const,
    averageSalaryRange: '₹8,50,000 - ₹19,00,000 / $90k - $145k',
    shortDescription: 'Safeguard systems, audit code for vulnerabilities, implement defense-in-depth security, and prevent intrusions.',
    topCompaniesHiring: ['Palo Alto Networks', 'CrowdStrike', 'Cisco', 'Deloitte', 'TCS Cyber']
  },
  {
    id: 'car-6',
    roleName: 'DevOps & Cloud Solutions Engineer',
    domain: 'Cloud Computing & DevOps',
    requiredSkills: ['Docker & Kubernetes', 'AWS Cloud Services', 'Git & GitHub CI/CD', 'Linux Administration', 'Terraform & IaC'],
    skillLevel: 'Advanced' as const,
    averageSalaryRange: '₹10,00,000 - ₹22,00,000 / $105k - $165k',
    shortDescription: 'Automate build/release pipelines, manage cloud infrastructure, and guarantee 99.99% system availability.',
    topCompaniesHiring: ['Red Hat', 'AWS', 'HashiCorp', 'Infosys', 'Intuit']
  }
];

class Database {
  private state: DatabaseState;

  constructor() {
    this.state = {
      users: [
        {
          id: 'user-demo-1',
          name: 'Priyanshu Kumar',
          email: 'priyanshukumar09430056@gmail.com',
          phone: '+91 9876543210',
          education: 'B.Tech in Computer Science',
          graduationYear: '2025',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
          status: 'active',
          currentDomain: 'Full Stack Development',
          careerGoal: 'Become a Senior Full Stack Engineer at a top tier tech company',
          experienceLevel: 'Fresher',
          passwordHash: 'careerfit123'
        },
        {
          id: 'user-demo-2',
          name: 'Ananya Sharma',
          email: 'ananya.sharma@example.com',
          phone: '+91 9123456789',
          education: 'B.Sc in Statistics & Data Science',
          graduationYear: '2024',
          role: 'user',
          createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
          status: 'active',
          currentDomain: 'Data Science & AI',
          careerGoal: 'AI Research & Data Scientist',
          experienceLevel: 'Fresher',
          passwordHash: 'password123'
        },
        {
          id: 'user-demo-3',
          name: 'Rohan Mehta',
          email: 'rohan.mehta@example.com',
          phone: '+91 9988776655',
          education: 'B.Tech Information Technology',
          graduationYear: '2025',
          role: 'user',
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          status: 'active',
          currentDomain: 'Cybersecurity',
          careerGoal: 'Cloud Security Architect',
          experienceLevel: 'Student',
          passwordHash: 'password123'
        }
      ],
      admins: [
        {
          id: 'admin-1',
          email: 'admin@careerfit.ai',
          name: 'Chief Admin (CareerFit AI)',
          role: 'admin',
          passwordHash: 'admin123'
        }
      ],
      resumes: [],
      skills: INITIAL_SKILLS_TAXONOMY,
      careers: INITIAL_CAREERS,
      learningResources: INITIAL_LEARNING_RESOURCES,
      projects: INITIAL_PROJECT_RECOMMENDATIONS,
      chatHistory: {},
      analytics: {
        totalUsers: 1420,
        activeUsers: 890,
        resumesUploaded: 2150,
        analysesCompleted: 1980,
        averageAtsScore: 76.4,
        averageReadinessScore: 72.8,
        topDomains: [
          { name: 'Full Stack Development', count: 620, percentage: 43 },
          { name: 'Data Science & AI', count: 340, percentage: 24 },
          { name: 'Frontend Development', count: 210, percentage: 15 },
          { name: 'Cybersecurity', count: 140, percentage: 10 },
          { name: 'Cloud & DevOps', count: 110, percentage: 8 }
        ],
        topRecommendedCareers: [
          { name: 'Full Stack Developer', count: 580 },
          { name: 'Frontend Engineer', count: 420 },
          { name: 'Backend Engineer', count: 390 },
          { name: 'Data Scientist', count: 310 },
          { name: 'Security Analyst', count: 180 }
        ],
        popularSkills: [
          { name: 'React.js', gapFrequency: 78 },
          { name: 'TypeScript', gapFrequency: 72 },
          { name: 'System Design & APIs', gapFrequency: 65 },
          { name: 'Docker & Kubernetes', gapFrequency: 61 },
          { name: 'SQL & Database Indexing', gapFrequency: 54 }
        ],
        resourceClicksCount: 8430
      }
    };

    // Pre-populate Priyanshu's initial resume analysis for instant rich demo state
    this.seedInitialResumeForUser('user-demo-1', SAMPLE_RESUMES[0].rawText, 'Full Stack Development');
  }

  // User methods
  getUserByEmail(email: string) {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserByPhone(phone: string) {
    const cleanPhone = phone.replace(/[\s\-\+]/g, '');
    return this.state.users.find((u) => u.phone.replace(/[\s\-\+]/g, '').endsWith(cleanPhone.slice(-10)));
  }

  getUserById(id: string) {
    return this.state.users.find((u) => u.id === id);
  }

  createUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    education: string;
    graduationYear: string;
  }) {
    const newUser: UserProfile & { passwordHash: string } = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      education: userData.education,
      graduationYear: userData.graduationYear,
      role: 'user',
      createdAt: new Date().toISOString(),
      status: 'active',
      experienceLevel: 'Fresher',
      passwordHash: userData.password
    };
    this.state.users.unshift(newUser);
    this.state.analytics.totalUsers += 1;
    this.state.analytics.activeUsers += 1;
    return newUser;
  }

  updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const user = this.getUserById(userId);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  }

  getAdminByEmail(email: string) {
    return this.state.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  }

  getAllUsers() {
    return this.state.users.map(({ passwordHash, otpCode, ...safeUser }) => safeUser);
  }

  deleteUser(userId: string) {
    this.state.users = this.state.users.filter((u) => u.id !== userId);
    this.state.resumes = this.state.resumes.filter((r) => r.userId !== userId);
    delete this.state.chatHistory[userId];
    this.state.analytics.totalUsers = Math.max(0, this.state.analytics.totalUsers - 1);
    return true;
  }

  toggleUserStatus(userId: string) {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.status = user.status === 'active' ? 'suspended' : 'active';
    return user;
  }

  // Resume & Analysis methods
  getResumeByUserId(userId: string) {
    return this.state.resumes.find((r) => r.userId === userId);
  }

  getResumeById(id: string) {
    return this.state.resumes.find((r) => r.id === id);
  }

  getAllResumes() {
    return this.state.resumes;
  }

  saveResume(resumeDoc: ResumeDocument) {
    const existingIndex = this.state.resumes.findIndex((r) => r.id === resumeDoc.id || r.userId === resumeDoc.userId);
    if (existingIndex >= 0) {
      this.state.resumes[existingIndex] = resumeDoc;
    } else {
      this.state.resumes.unshift(resumeDoc);
      this.state.analytics.resumesUploaded += 1;
    }
    return resumeDoc;
  }

  deleteResume(userId: string) {
    this.state.resumes = this.state.resumes.filter((r) => r.userId !== userId);
    return true;
  }

  // Roadmaps & Tasks
  toggleRoadmapTask(userId: string, taskId: string, completed: boolean, notes?: string) {
    const resume = this.getResumeByUserId(userId);
    if (!resume || !resume.roadmap) return null;

    let found = false;
    let totalTasks = 0;
    let completedTasks = 0;

    for (const phase of resume.roadmap.phases) {
      for (const task of phase.tasks) {
        totalTasks++;
        if (task.id === taskId) {
          task.completed = completed;
          if (notes !== undefined) task.notes = notes;
          found = true;
        }
        if (task.completed) {
          completedTasks++;
        }
      }
    }

    if (found && totalTasks > 0) {
      resume.roadmap.overallProgress = Math.round((completedTasks / totalTasks) * 100);
      resume.roadmap.updatedAt = new Date().toISOString();

      // Recalculate job readiness based on roadmap completion
      if (resume.jobReadiness) {
        const bonusFromTasks = Math.round((completedTasks / totalTasks) * 15);
        resume.jobReadiness.breakdown.skills.score = Math.min(98, 75 + bonusFromTasks);
        resume.jobReadiness.breakdown.projects.score = Math.min(95, 70 + Math.round((completedTasks / totalTasks) * 18));
        
        const b = resume.jobReadiness.breakdown;
        const weighted = 
          b.skills.score * 0.25 +
          b.resume.score * 0.20 +
          b.projects.score * 0.20 +
          b.experience.score * 0.15 +
          b.interviewPrep.score * 0.10 +
          b.portfolio.score * 0.10;
        resume.jobReadiness.overallScore = Math.round(weighted);
        if (resume.jobReadiness.overallScore >= 85) {
          resume.jobReadiness.status = 'Job Ready';
        }
      }
    }

    return resume.roadmap;
  }

  // Careers, Skills & Resources
  getAllCareers() {
    return this.state.careers;
  }

  addCareer(career: any) {
    const newCareer = {
      ...career,
      id: `car-${Date.now()}`
    };
    this.state.careers.push(newCareer);
    return newCareer;
  }

  updateCareer(id: string, updates: any) {
    const career = this.state.careers.find((c) => c.id === id);
    if (!career) return null;
    Object.assign(career, updates);
    return career;
  }

  deleteCareer(id: string) {
    this.state.careers = this.state.careers.filter((c) => c.id !== id);
    return true;
  }

  getAllSkills() {
    return this.state.skills;
  }

  addSkill(skill: any) {
    const newSkill = {
      ...skill,
      id: `sk-${Date.now()}`
    };
    this.state.skills.push(newSkill);
    return newSkill;
  }

  deleteSkill(id: string) {
    this.state.skills = this.state.skills.filter((s) => s.id !== id);
    return true;
  }

  getAllLearningResources(filters?: { domain?: string; skill?: string; difficulty?: string }) {
    let resources = [...this.state.learningResources];
    if (filters?.domain) {
      resources = resources.filter((r) => r.careerDomain.toLowerCase().includes(filters.domain!.toLowerCase()) || r.careerDomain === 'All Software Roles');
    }
    if (filters?.skill) {
      resources = resources.filter((r) => r.skill.toLowerCase().includes(filters.skill!.toLowerCase()));
    }
    if (filters?.difficulty && filters.difficulty !== 'All') {
      resources = resources.filter((r) => r.difficulty === filters.difficulty || r.difficulty === 'All Levels');
    }
    return resources;
  }

  addLearningResource(resource: any) {
    const newRes: LearningResource = {
      ...resource,
      id: `res-${Date.now()}`,
      rating: resource.rating || 4.8
    };
    this.state.learningResources.unshift(newRes);
    return newRes;
  }

  updateLearningResource(id: string, updates: Partial<LearningResource>) {
    const res = this.state.learningResources.find((r) => r.id === id);
    if (!res) return null;
    Object.assign(res, updates);
    return res;
  }

  deleteLearningResource(id: string) {
    this.state.learningResources = this.state.learningResources.filter((r) => r.id !== id);
    return true;
  }

  getAllProjects() {
    return this.state.projects;
  }

  addProject(project: any) {
    const newProj = {
      ...project,
      id: `proj-${Date.now()}`
    };
    this.state.projects.push(newProj);
    return newProj;
  }

  // Chat
  getChatHistory(userId: string): ChatMessage[] {
    if (!this.state.chatHistory[userId]) {
      this.state.chatHistory[userId] = [
        {
          id: 'msg-init-1',
          sender: 'copilot',
          text: 'Hello! I am **CareerFit Copilot 🤖**, your AI Career Coach & ATS Strategist. Ask me anything about your resume score, missing skill roadmaps, interview questions, or project recommendations!',
          timestamp: new Date().toISOString(),
          suggestedActions: [
            { label: 'Why did you recommend Full Stack?', actionType: 'query', payload: 'Why did you recommend Full Stack Development for my profile?' },
            { label: 'How to increase my ATS score?', actionType: 'query', payload: 'How can I increase my ATS score to 90+?' },
            { label: 'What skill should I learn next?', actionType: 'query', payload: 'What skill should I prioritize learning this week?' },
            { label: 'Ask 5 Frontend Interview questions', actionType: 'query', payload: 'Ask me 5 essential React & JavaScript interview questions with explanations.' }
          ]
        }
      ];
    }
    return this.state.chatHistory[userId];
  }

  addChatMessage(userId: string, message: ChatMessage) {
    if (!this.state.chatHistory[userId]) {
      this.getChatHistory(userId);
    }
    this.state.chatHistory[userId].push(message);
    return message;
  }

  clearChatHistory(userId: string) {
    delete this.state.chatHistory[userId];
    return this.getChatHistory(userId);
  }

  // Analytics
  getAnalytics(): AdminAnalytics {
    return {
      ...this.state.analytics,
      totalUsers: this.state.users.length + 1420,
      activeUsers: this.state.users.length + 890,
      resumesUploaded: this.state.resumes.length + 2150,
      analysesCompleted: this.state.resumes.filter((r) => r.atsAnalysis).length + 1980
    };
  }

  // Seed method
  private seedInitialResumeForUser(userId: string, rawText: string, domain: string) {
    const extractedData: ExtractedResumeData = {
      personalInfo: {
        fullName: 'Priyanshu Kumar',
        email: 'priyanshukumar09430056@gmail.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, India',
        linkedin: 'linkedin.com/in/priyanshu-dev',
        github: 'github.com/priyanshu-code',
        portfolio: 'priyanshu-portfolio.dev'
      },
      education: [
        {
          degree: 'Bachelor of Technology (B.Tech) in Computer Science',
          institution: 'National Institute of Technology (NIT)',
          graduationYear: '2025',
          cgpaOrPercentage: '8.6/10 CGPA',
          relevantCoursework: ['Data Structures & Algorithms', 'Database Systems', 'Web Technologies', 'Operating Systems', 'Computer Networks']
        }
      ],
      skills: {
        technical: ['REST APIs', 'State Management', 'Full Stack Architecture', 'Responsive Design', 'Agile/Scrum'],
        soft: ['Problem Solving', 'Team Collaboration', 'Technical Writing', 'Time Management'],
        tools: ['Git', 'GitHub', 'VS Code', 'Postman', 'Vite', 'Docker (Basics)'],
        languages: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Python', 'C++'],
        frameworks: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
        databases: ['PostgreSQL', 'MongoDB', 'MySQL']
      },
      experience: [
        {
          id: 'exp-1',
          company: 'TechNova Solutions',
          role: 'Software Engineering Intern',
          duration: 'June 2024 – August 2024',
          responsibilities: [
            'Built reusable React & Tailwind CSS components, reducing team feature turnaround by 20%.',
            'Collaborated with senior engineers to optimize PostgreSQL database queries, improving API latency by 18%.'
          ],
          achievements: [
            'Authored reusable form component library utilized across 4 internal tools',
            'Received "Exemplary Intern" recognition'
          ]
        }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'CareerFit AI - Career Platform',
          technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind', 'AI API'],
          description: 'Engineered full-stack career platform analyzing user resumes against industry ATS criteria with real-time feedback.',
          impact: 'Parsed 10,000+ words with 95% keyword accuracy and sub-500ms response time.'
        },
        {
          id: 'proj-2',
          name: 'ShopFlow - E-Commerce Web App',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
          description: 'Full-featured online store with search, filters, persistent cart, and JWT auth.',
          impact: 'Reduced initial page load latency by 35% through dynamic code splitting.'
        }
      ],
      summary: 'Motivated Computer Science graduate with hands-on experience building full-stack web applications using React.js, Node.js, Express, and PostgreSQL.'
    };

    const atsAnalysis: ATSAnalysisResult = {
      overallScore: 82,
      rating: 'Good',
      categoryBreakdown: {
        keywordOptimization: { name: 'Keyword Optimization', score: 85, maxScore: 100, weight: 15, feedback: 'Strong presence of modern web tech keywords (React, Node, TypeScript, SQL).' },
        skillsRelevance: { name: 'Skills Relevance', score: 88, maxScore: 100, weight: 15, feedback: 'High alignment with Full Stack and Frontend job descriptions.' },
        resumeStructure: { name: 'Resume Structure', score: 80, maxScore: 100, weight: 10, feedback: 'Clear reverse-chronological layout with standard section headers.' },
        experienceImpact: { name: 'Experience & Impact', score: 78, maxScore: 100, weight: 15, feedback: 'Good action verbs; could add more quantitative business revenue/user scale metrics.' },
        educationClarity: { name: 'Education Clarity', score: 95, maxScore: 100, weight: 10, feedback: 'Comprehensive institution, degree, CGPA, and coursework details.' },
        projectsEvaluation: { name: 'Projects Depth', score: 85, maxScore: 100, weight: 15, feedback: 'Projects are full-stack and have live deployment links/architectural clarity.' },
        formattingAndLayout: { name: 'ATS Formatting', score: 82, maxScore: 100, weight: 10, feedback: 'Single column friendly, no complex tables that break standard ATS parsers.' },
        measurableAchievements: { name: 'Measurable Metrics', score: 72, maxScore: 100, weight: 5, feedback: 'Add more percentage numbers or scale figures to project bullet points.' },
        contactCompleteness: { name: 'Contact & Links', score: 95, maxScore: 100, weight: 5, feedback: 'Complete with Email, Phone, LinkedIn, GitHub, and Portfolio.' }
      },
      strengths: [
        'Well-balanced full stack portfolio across React, Node.js, and PostgreSQL',
        'Includes verifiable metrics (e.g., "reduced initial page load by 35%")',
        'Clean contact details with GitHub and LinkedIn profiles present',
        'Relevant computer science coursework listed'
      ],
      improvements: [
        'Add cloud deployment keywords (e.g., AWS EC2/S3, Docker containerization, CI/CD pipelines)',
        'Enhance project descriptions with system architecture & concurrency handling',
        'Include unit testing frameworks like Jest / Vitest / Cypress to prove test discipline',
        'Add 1-2 open-source contributions or competitive programming ratings'
      ],
      actionableTips: [
        'Include Docker and AWS Cloud keywords in the Skills and Experience sections.',
        'Quantify project user traction (e.g., "tested with 100+ concurrent simulated users").',
        'Add a dedicated "Tools & Testing" category featuring Vitest, Postman, and GitHub Actions.'
      ],
      missingCrucialKeywords: ['Docker', 'AWS', 'CI/CD Pipelines', 'Unit Testing (Jest/Vitest)', 'Redis Caching', 'GraphQL']
    };

    const recommendations: CareerRecommendation[] = [
      {
        id: 'rec-1',
        roleName: 'Full Stack Developer',
        matchPercentage: 91,
        readinessLevel: 'High',
        shortDescription: 'Build end-to-end applications with modern React frontends, robust Node/Express backends, and relational SQL databases.',
        whyMatches: [
          'Strong practical knowledge of JavaScript (ES6+), TypeScript, and React',
          'Demonstrated experience building full-stack applications with Node.js and PostgreSQL',
          'Internship experience collaborating on scalable codebase and query optimization',
          'Computer Science foundational degree with high academic standing'
        ],
        requiredSkills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js & Express', 'PostgreSQL & SQL', 'Docker', 'AWS Basics', 'REST APIs'],
        existingSkills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js & Express', 'PostgreSQL', 'HTML5/CSS3', 'Git'],
        missingSkills: ['Docker & Containerization', 'AWS Cloud Fundamentals', 'Redis Caching', 'Advanced System Design'],
        estimatedLearningWeeks: 4,
        averageSalaryRange: '₹8,50,000 - ₹18,00,000 / $90k - $140k',
        topCompaniesHiring: ['Swiggy', 'Razorpay', 'Microsoft', 'Atlassian', 'Flipkart']
      },
      {
        id: 'rec-2',
        roleName: 'Frontend Engineer (React)',
        matchPercentage: 89,
        readinessLevel: 'High',
        shortDescription: 'Specialize in building responsive, accessible, high-performance web user experiences with React and Tailwind CSS.',
        whyMatches: [
          'Excellent React component architecture and Tailwind styling skills',
          'Proven optimization of page speed and state management',
          'Internship focused on reusable UI design system development'
        ],
        requiredSkills: ['React.js', 'TypeScript', 'Tailwind CSS', 'State Management (Zustand/Redux)', 'Web Performance', 'Accessibility (a11y)'],
        existingSkills: ['React.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Git'],
        missingSkills: ['Advanced State Management (Redux Toolkit/Zustand)', 'Web Vitals & Performance Profiling', 'Cypress E2E Testing'],
        estimatedLearningWeeks: 3,
        averageSalaryRange: '₹7,50,000 - ₹16,00,000 / $85k - $130k',
        topCompaniesHiring: ['Meta', 'Uber', 'Zomato', 'Cred', 'Airbnb']
      },
      {
        id: 'rec-3',
        roleName: 'Backend & API Engineer',
        matchPercentage: 81,
        readinessLevel: 'Medium',
        shortDescription: 'Architect resilient server-side microservices, database schemas, authentication systems, and cloud integrations.',
        whyMatches: [
          'Proficient in Node.js, Express, RESTful API design, and PostgreSQL',
          'Experience optimizing SQL queries and response latency'
        ],
        requiredSkills: ['Node.js & Express', 'PostgreSQL & SQL', 'System Design', 'Docker', 'Redis Caching', 'Message Queues (RabbitMQ/Kafka)'],
        existingSkills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST APIs'],
        missingSkills: ['System Design & Scaling', 'Redis Caching', 'Message Brokers (RabbitMQ/Kafka)', 'Docker & Kubernetes'],
        estimatedLearningWeeks: 6,
        averageSalaryRange: '₹9,00,000 - ₹20,00,000 / $95k - $150k',
        topCompaniesHiring: ['Amazon', 'Oracle', 'Paytm', 'Salesforce']
      },
      {
        id: 'rec-4',
        roleName: 'Software Development Engineer (SDE-1)',
        matchPercentage: 78,
        readinessLevel: 'Medium',
        shortDescription: 'Generalist software engineering covering data structures, algorithms, object-oriented design, and product feature development.',
        whyMatches: [
          'B.Tech in Computer Science with 8.6 CGPA',
          '5-Star Problem Solving on HackerRank and strong DSA coursework'
        ],
        requiredSkills: ['Data Structures & Algorithms', 'System Design', 'C++ / Java / Python', 'OOPs', 'Operating Systems & DBMS'],
        existingSkills: ['Data Structures', 'C++', 'Python', 'DBMS', 'Operating Systems', 'Git'],
        missingSkills: ['Advanced Graph & DP Algorithms', 'Low-Level Object Oriented Design (LLD Patterns)', 'Concurrency & Multithreading'],
        estimatedLearningWeeks: 5,
        averageSalaryRange: '₹12,00,000 - ₹24,00,000 / $110k - $160k',
        topCompaniesHiring: ['Google', 'Microsoft', 'Adobe', 'Uber', 'Intuit']
      }
    ];

    const skillGaps: SkillGapItem[] = [
      {
        skill: 'HTML5 & Responsive CSS',
        category: 'Languages',
        currentLevel: 92,
        requiredLevel: 85,
        gapLevel: 'Low',
        status: 'have',
        whyNeeded: 'Fundamental building block for rendering modern web views and responsive layouts.',
        learningTimeHours: 0
      },
      {
        skill: 'JavaScript (ES6+)',
        category: 'Languages',
        currentLevel: 85,
        requiredLevel: 90,
        gapLevel: 'Low',
        status: 'have',
        whyNeeded: 'Core language for modern frontend and backend web development.',
        learningTimeHours: 6,
        recommendedYouTubeQuery: 'Advanced JavaScript Event Loop Closures Prototypes'
      },
      {
        skill: 'React.js & Hooks',
        category: 'Frameworks',
        currentLevel: 75,
        requiredLevel: 90,
        gapLevel: 'Medium',
        status: 'improve',
        whyNeeded: 'Industry-standard frontend library used by 70%+ tech companies for building interactive SPAs.',
        learningTimeHours: 12,
        recommendedYouTubeQuery: 'React 19 Hooks Custom Hooks Performance Optimization'
      },
      {
        skill: 'Node.js & Express.js',
        category: 'Frameworks',
        currentLevel: 68,
        requiredLevel: 85,
        gapLevel: 'Medium',
        status: 'improve',
        whyNeeded: 'Powering server-side runtime, middleware chains, authentication, and REST APIs.',
        learningTimeHours: 15,
        recommendedYouTubeQuery: 'Node.js Express REST API Authentication Masterclass'
      },
      {
        skill: 'PostgreSQL & Relational Data Modeling',
        category: 'Databases',
        currentLevel: 65,
        requiredLevel: 80,
        gapLevel: 'Medium',
        status: 'improve',
        whyNeeded: 'Essential for structured transactional data, ACID compliance, and performant indexes.',
        learningTimeHours: 10,
        recommendedYouTubeQuery: 'PostgreSQL Database Design Indexing Query Optimization'
      },
      {
        skill: 'Docker & Containerization',
        category: 'Tools',
        currentLevel: 35,
        requiredLevel: 75,
        gapLevel: 'High',
        status: 'learn',
        whyNeeded: 'Critical for containerizing apps, consistent local development, and deploying to cloud clusters.',
        learningTimeHours: 14,
        recommendedYouTubeQuery: 'Docker for Developers Crash Course Fireship freeCodeCamp'
      },
      {
        skill: 'System Design & Scalable Architecture',
        category: 'Core Concepts',
        currentLevel: 40,
        requiredLevel: 80,
        gapLevel: 'High',
        status: 'learn',
        whyNeeded: 'Must understand caching (Redis), load balancing, rate limiting, and API design for senior roles.',
        learningTimeHours: 18,
        recommendedYouTubeQuery: 'System Design Interview Fundamentals for Beginners'
      }
    ];

    const roadmap: CareerRoadmap = {
      id: 'road-1',
      careerRoleId: 'rec-1',
      careerRoleName: 'Full Stack Developer',
      targetDomain: 'Full Stack Development',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      overallProgress: 38,
      phases: [
        {
          id: 'ph-1',
          phaseNumber: 1,
          title: 'Phase 1 — Strengthen Core Fundamentals & TypeScript',
          durationText: '2–3 weeks',
          description: 'Solidify JavaScript runtime internals, asynchronous patterns, and static TypeScript typing.',
          tasks: [
            {
              id: 't-1-1',
              title: 'Master JS Asynchronous Execution (Promises, Async/Await, Microtask Queue)',
              description: 'Understand the Event Loop, Call Stack, Task vs Microtask queue, and Promise concurrency (all, race, allSettled).',
              completed: true,
              durationDays: 4,
              notes: 'Reviewed event loop mental models and tested Promise.allSettled with error boundaries.'
            },
            {
              id: 't-1-2',
              title: 'Adopt TypeScript in React & Express',
              description: 'Write generic interfaces, utility types (Partial, Pick, Omit), and typed Express Request/Response handlers.',
              completed: true,
              durationDays: 5,
              resourceLinks: [{ title: 'TypeScript Full Course', url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs', platform: 'YouTube' }]
            },
            {
              id: 't-1-3',
              title: 'Git Workflow & Conventional Commits',
              description: 'Practice feature branching, interactive rebase, pull request reviews, and GitHub Actions basic CI.',
              completed: true,
              durationDays: 3
            }
          ]
        },
        {
          id: 'ph-2',
          phaseNumber: 2,
          title: 'Phase 2 — Advanced React & Frontend Mastery',
          durationText: '3–4 weeks',
          description: 'Build robust client-side architecture, custom hooks, state synchronization, and performance optimization.',
          tasks: [
            {
              id: 't-2-1',
              title: 'Deep Dive into React Hooks & Custom Hook Architecture',
              description: 'Implement reusable useDebounce, useLocalStorage, and useIntersectionObserver custom hooks.',
              completed: true,
              durationDays: 5,
              resourceLinks: [{ title: 'React Hooks Simplified', url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q', platform: 'YouTube' }]
            },
            {
              id: 't-2-2',
              title: 'Frontend State Management (Zustand / TanStack Query)',
              description: 'Handle server state caching, optimistic UI updates, and lightweight global client state.',
              completed: false,
              durationDays: 6
            },
            {
              id: 't-2-3',
              title: 'Web Performance & Core Web Vitals',
              description: 'Audit React render cycles with React Profiler, lazy loading, code-splitting, and memoization techniques.',
              completed: false,
              durationDays: 4
            }
          ]
        },
        {
          id: 'ph-3',
          phaseNumber: 3,
          title: 'Phase 3 — Robust Backend, Databases & Containerization',
          durationText: '4 weeks',
          description: 'Engineer production-ready Express APIs, relational database queries with PostgreSQL, and Docker container builds.',
          tasks: [
            {
              id: 't-3-1',
              title: 'Production Express Architecture & Middleware Security',
              description: 'Implement helmet, cors, express-rate-limit, Joi/Zod input validation, and structured error handlers.',
              completed: false,
              durationDays: 6,
              resourceLinks: [{ title: 'Node.js & Express Full Course', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', platform: 'YouTube' }]
            },
            {
              id: 't-3-2',
              title: 'Advanced PostgreSQL Queries & Indexing',
              description: 'Master foreign keys, B-tree indexes, aggregation queries, transactions, and connection pooling.',
              completed: false,
              durationDays: 7,
              resourceLinks: [{ title: 'SQL Database Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', platform: 'YouTube' }]
            },
            {
              id: 't-3-3',
              title: 'Dockerizing Full Stack Applications',
              description: 'Write multi-stage Dockerfiles for client & server, configure docker-compose for PostgreSQL & App.',
              completed: false,
              durationDays: 7,
              resourceLinks: [{ title: 'Docker in 100 Seconds', url: 'https://www.youtube.com/watch?v=gAkwW2tuIqE', platform: 'YouTube' }]
            }
          ]
        },
        {
          id: 'ph-4',
          phaseNumber: 4,
          title: 'Phase 4 — Capstone Portfolio Projects',
          durationText: '3–4 weeks',
          description: 'Develop and deploy two flagship projects with live URLs, CI/CD, and comprehensive GitHub READMEs.',
          tasks: [
            {
              id: 't-4-1',
              title: 'Build & Deploy Full Stack SaaS Project (AI Career / E-Commerce)',
              description: 'Implement full authentication, database transactions, third-party API integration, and cloud deployment.',
              completed: false,
              durationDays: 14
            },
            {
              id: 't-4-2',
              title: 'Author High-Impact GitHub README with Architecture Diagrams',
              description: 'Include live demo URLs, tech stack badges, system architecture diagram, and setup instructions.',
              completed: false,
              durationDays: 3
            }
          ]
        },
        {
          id: 'ph-5',
          phaseNumber: 5,
          title: 'Phase 5 — Interview Preparation & Job Applications',
          durationText: '2–3 weeks',
          description: 'Ace technical interviews with DSA drills, mock system design discussions, and targeted company outreach.',
          tasks: [
            {
              id: 't-5-1',
              title: 'Top 50 JavaScript & React Technical Interview Questions',
              description: 'Practice closures, prototypes, event delegation, virtual DOM diffing, and hook rules with CareerFit Copilot.',
              completed: false,
              durationDays: 7
            },
            {
              id: 't-5-2',
              title: 'ATS Resume Polish & LinkedIn Optimization',
              description: 'Apply CareerFit AI keyword suggestions, feature top 3 projects, and reach out to 15 tech recruiters.',
              completed: false,
              durationDays: 4
            }
          ]
        }
      ]
    };

    const jobReadiness: JobReadinessReport = {
      overallScore: 78,
      status: 'Growing Competency',
      breakdown: {
        skills: { category: 'Core Technical Skills', score: 82, weight: 25, recommendation: 'Solid frontend and JS foundation; learn Docker & basic AWS.' },
        resume: { category: 'ATS Resume Score', score: 82, weight: 20, recommendation: 'Good structure and keywords; add cloud keywords & test frameworks.' },
        projects: { category: 'Portfolio & Projects', score: 78, weight: 20, recommendation: '2 good web apps; deploy them on Cloud with live demo URLs.' },
        experience: { category: 'Practical Experience', score: 70, weight: 15, recommendation: 'Internship is helpful; highlight concrete business impact metrics.' },
        interviewPrep: { category: 'Interview Readiness', score: 72, weight: 10, recommendation: 'Practice top 30 React/Node technical questions and basic system design.' },
        portfolio: { category: 'GitHub & Portfolio', score: 88, weight: 10, recommendation: 'Clean GitHub presence and portfolio website.' }
      },
      topNextActions: [
        'Complete Phase 3 Docker & Containerization module in your roadmap (+4% Readiness)',
        'Deploy your E-Commerce / SaaS project to Cloud with live HTTPS demo (+3% Readiness)',
        'Practice 10 React & JavaScript interview questions with CareerFit Copilot (+3% Readiness)'
      ],
      estimatedDaysToReady: 24
    };

    const resumeDoc: ResumeDocument = {
      id: 'res-seed-1',
      userId,
      fileName: 'Priyanshu_Kumar_FullStack_Resume.pdf',
      fileSize: 142800,
      fileType: 'application/pdf',
      rawText,
      uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      extractedData,
      atsAnalysis,
      preferredDomain: domain,
      recommendations,
      selectedCareer: recommendations[0],
      skillGaps,
      roadmap,
      jobReadiness
    };

    this.state.resumes.push(resumeDoc);
  }
}

export const db = new Database();
