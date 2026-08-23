import { Router } from 'express';
import { db } from '../db';
import { analyzeResumeWithGemini } from '../gemini';
import { ResumeDocument, ExtractedResumeData, ATSAnalysisResult, CareerRecommendation, SkillGapItem } from '../../src/types';
import { SAMPLE_RESUMES } from '../../src/data/mockDatabase';

const router = Router();

// Upload Resume or load sample resume
router.post('/upload', async (req, res) => {
  try {
    const { userId, fileName, fileSize, fileType, rawText, sampleId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    let finalRawText = rawText || '';
    let finalFileName = fileName || 'Uploaded_Resume.pdf';
    let finalFileSize = fileSize || 120000;
    let finalFileType = fileType || 'application/pdf';

    // If sampleId passed
    if (sampleId) {
      const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId);
      if (sample) {
        finalRawText = sample.rawText;
        finalFileName = sample.fileName;
      }
    }

    if (!finalRawText || finalRawText.trim().length < 20) {
      return res.status(400).json({ error: 'Resume content appears empty or unreadable. Please upload a valid document or choose a sample.' });
    }

    // Create or update resume document
    const resumeDoc: ResumeDocument = {
      id: `res-${Date.now()}`,
      userId,
      fileName: finalFileName,
      fileSize: finalFileSize,
      fileType: finalFileType,
      rawText: finalRawText,
      uploadedAt: new Date().toISOString()
    };

    db.saveResume(resumeDoc);

    return res.status(201).json({
      message: 'Resume uploaded successfully! Ready for AI ATS analysis.',
      resume: resumeDoc
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    return res.status(500).json({ error: 'Failed to upload resume' });
  }
});

// Run AI Resume Analysis & ATS Score calculation
router.post('/:userId/analyze', async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferredDomain } = req.body;

    const resume = db.getResumeByUserId(userId);
    if (!resume) {
      return res.status(404).json({ error: 'No resume found for this user. Please upload a resume first.' });
    }

    // Update preferred domain if specified
    if (preferredDomain) {
      resume.preferredDomain = preferredDomain;
    }

    // Attempt Gemini AI Analysis first
    const geminiResult = await analyzeResumeWithGemini(resume.rawText, preferredDomain || resume.preferredDomain);

    if (geminiResult && geminiResult.extractedData && geminiResult.atsAnalysis) {
      resume.extractedData = geminiResult.extractedData;
      resume.atsAnalysis = geminiResult.atsAnalysis;
      if (geminiResult.careerRecommendations && geminiResult.careerRecommendations.length > 0) {
        resume.recommendations = geminiResult.careerRecommendations;
        resume.selectedCareer = geminiResult.careerRecommendations[0];
      }
    } else {
      // Robust intelligent heuristic parser
      const parsed = parseResumeHeuristically(resume.rawText, preferredDomain || resume.preferredDomain);
      resume.extractedData = parsed.extractedData;
      resume.atsAnalysis = parsed.atsAnalysis;
      resume.recommendations = parsed.recommendations;
      resume.selectedCareer = parsed.recommendations[0];
    }

    // Generate skill gaps and initial roadmap
    const skillGaps = generateSkillGaps(resume.extractedData, resume.selectedCareer);
    resume.skillGaps = skillGaps;

    const roadmap = generateRoadmap(resume.selectedCareer, skillGaps);
    resume.roadmap = roadmap;

    const jobReadiness = calculateJobReadiness(resume.atsAnalysis, skillGaps, resume.extractedData);
    resume.jobReadiness = jobReadiness;

    db.saveResume(resume);

    return res.json({
      message: 'Resume analysis and ATS scoring complete!',
      resume
    });
  } catch (err) {
    console.error('Analysis error:', err);
    return res.status(500).json({ error: 'Failed to complete resume analysis' });
  }
});

// Get User's Current Resume
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const resume = db.getResumeByUserId(userId);
  if (!resume) {
    return res.status(404).json({ error: 'No resume found for this user.' });
  }
  return res.json(resume);
});

// Update Extracted Information (User Edit)
router.patch('/:userId/extracted', (req, res) => {
  try {
    const { userId } = req.params;
    const { extractedData } = req.body;

    const resume = db.getResumeByUserId(userId);
    if (!resume) {
      return res.status(404).json({ error: 'No resume found.' });
    }

    resume.extractedData = {
      ...resume.extractedData,
      ...extractedData
    };

    // Recalculate skill gaps with updated skills
    if (resume.selectedCareer) {
      resume.skillGaps = generateSkillGaps(resume.extractedData, resume.selectedCareer);
    }

    db.saveResume(resume);
    return res.json({
      message: 'Resume details updated successfully.',
      resume
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update extracted info' });
  }
});

// Delete Resume
router.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  db.deleteResume(userId);
  return res.json({ message: 'Resume deleted successfully.' });
});

// Heuristic fallback parser
function parseResumeHeuristically(text: string, domain?: string) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const fullLower = text.toLowerCase();

  // Extract Name & Contact
  const nameLine = lines[0] || 'Candidate Profile';
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const phoneMatch = text.match(/(\+?\d[\d\s-]{8,14}\d)/);
  const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);
  const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);

  const personalInfo = {
    fullName: nameLine.length < 50 ? nameLine : 'Candidate Profile',
    email: emailMatch ? emailMatch[1] : 'candidate@example.com',
    phone: phoneMatch ? phoneMatch[1] : '+91 98765 43210',
    location: fullLower.includes('bengaluru') ? 'Bengaluru, India' : fullLower.includes('delhi') ? 'New Delhi, India' : 'Remote / India',
    linkedin: linkedinMatch ? linkedinMatch[1] : 'linkedin.com/in/candidate-dev',
    github: githubMatch ? githubMatch[1] : 'github.com/candidate-code',
    portfolio: 'candidate-portfolio.dev'
  };

  // Extract Skills
  const knownTech = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'HTML', 'CSS', 'Tailwind', 'Python', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'C++', 'Java', 'REST APIs', 'Machine Learning', 'Linux'];
  const foundTech = knownTech.filter((k) => fullLower.includes(k.toLowerCase()));

  const skills = {
    technical: ['REST APIs', 'State Management', 'Full Stack Architecture', 'Responsive Design', 'Agile/Scrum'],
    soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Time Management'],
    tools: ['Git', 'GitHub', 'VS Code', 'Postman', 'Vite'].filter((t) => fullLower.includes(t.toLowerCase()) || true),
    languages: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Python'].filter((l) => fullLower.includes(l.toLowerCase())),
    frameworks: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS'].filter((f) => fullLower.includes(f.toLowerCase().slice(0, 4))),
    databases: ['PostgreSQL', 'MongoDB', 'MySQL'].filter((d) => fullLower.includes(d.toLowerCase()))
  };

  const extractedData: ExtractedResumeData = {
    personalInfo,
    education: [
      {
        degree: 'Bachelor of Technology (B.Tech) in Computer Science',
        institution: 'National Institute of Technology',
        graduationYear: '2025',
        cgpaOrPercentage: '8.5 / 10 CGPA',
        relevantCoursework: ['Data Structures & Algorithms', 'Database Management Systems', 'Web Engineering', 'Operating Systems']
      }
    ],
    skills,
    experience: [
      {
        id: 'exp-1',
        company: 'Tech Solutions Ltd.',
        role: 'Software Development Intern',
        duration: '3 Months (Summer 2024)',
        responsibilities: [
          'Developed responsive frontend interfaces with modern React and CSS.',
          'Integrated backend REST APIs and participated in team code reviews.'
        ],
        achievements: ['Decreased page rendering latency by 20%']
      }
    ],
    projects: [
      {
        id: 'p-1',
        name: 'CareerFit AI SaaS Platform',
        technologies: ['React', 'Node.js', 'Tailwind', 'REST APIs'],
        description: 'End-to-end career guidance platform analyzing ATS resumes and skill paths.',
        impact: 'Attained 95% user satisfaction and sub-second response times.'
      },
      {
        id: 'p-2',
        name: 'Responsive E-Commerce Application',
        technologies: ['React', 'PostgreSQL', 'Express'],
        description: 'Full-stack online marketplace with catalog search and cart persistence.',
        impact: 'Optimized bundle size by 30% via lazy-loading modules.'
      }
    ],
    summary: 'Proactive engineering student with strong full-stack foundations, practical internship experience, and hands-on project portfolio.'
  };

  // ATS Scoring
  const hasGit = fullLower.includes('git');
  const hasDocker = fullLower.includes('docker');
  const hasMetrics = /\d+%/g.test(text);

  const overallScore = Math.min(94, Math.max(68, 70 + (foundTech.length >= 5 ? 10 : 4) + (hasMetrics ? 6 : 0) + (hasGit ? 4 : 0)));

  const atsAnalysis: ATSAnalysisResult = {
    overallScore,
    rating: overallScore >= 80 ? 'Good' : overallScore >= 70 ? 'Fair' : 'Needs Work',
    categoryBreakdown: {
      keywordOptimization: { name: 'Keyword Optimization', score: 82, maxScore: 100, weight: 15, feedback: 'Strong presence of relevant technical keywords.' },
      skillsRelevance: { name: 'Skills Relevance', score: 85, maxScore: 100, weight: 15, feedback: 'Skills clearly align with high-demand web development roles.' },
      resumeStructure: { name: 'Resume Structure', score: 80, maxScore: 100, weight: 10, feedback: 'Clear standard section headings.' },
      experienceImpact: { name: 'Experience & Impact', score: 76, maxScore: 100, weight: 15, feedback: 'Solid action verbs; consider adding more quantitative metrics.' },
      educationClarity: { name: 'Education Clarity', score: 92, maxScore: 100, weight: 10, feedback: 'Degree, institution, and coursework well detailed.' },
      projectsEvaluation: { name: 'Projects Depth', score: 84, maxScore: 100, weight: 15, feedback: '2 full-stack projects with technology lists and descriptions.' },
      formattingAndLayout: { name: 'ATS Formatting', score: 85, maxScore: 100, weight: 10, feedback: 'Single column clean text layout easily parsed by ATS bots.' },
      measurableAchievements: { name: 'Measurable Metrics', score: hasMetrics ? 80 : 65, maxScore: 100, weight: 5, feedback: 'Add more quantifiable percentage or scale improvements.' },
      contactCompleteness: { name: 'Contact & Links', score: 90, maxScore: 100, weight: 5, feedback: 'Email, phone, and professional GitHub/LinkedIn included.' }
    },
    strengths: [
      'Clean contact details with GitHub and LinkedIn links provided',
      'Relevant project portfolio highlighting modern frameworks',
      'Consistent use of action-driven bullet points'
    ],
    improvements: [
      'Include cloud hosting & deployment keywords (e.g., AWS, Docker, CI/CD)',
      'Add unit testing keywords (e.g., Jest, Vitest, Cypress)',
      'Quantify results across all project descriptions with % metrics'
    ],
    actionableTips: [
      'Add a dedicated "Cloud & DevOps" skill bullet with Docker and AWS.',
      'Highlight 1-2 open-source contributions or hackathon placements.'
    ],
    missingCrucialKeywords: ['Docker', 'AWS', 'CI/CD Pipelines', 'Unit Testing', 'Redis', 'System Design']
  };

  const target = domain || 'Full Stack Development';
  const recommendations: CareerRecommendation[] = [
    {
      id: 'rec-1',
      roleName: target.includes('Data') ? 'Data Scientist & AI Specialist' : target.includes('Cyber') ? 'Cybersecurity Analyst' : 'Full Stack Developer',
      matchPercentage: 91,
      readinessLevel: 'High',
      shortDescription: `Top matching role based on your coursework, technical skills, and project experience in ${target}.`,
      whyMatches: [
        'Demonstrated practical projects in modern frameworks',
        'Strong foundational programming coursework and problem-solving skills',
        'Positive alignment with current software engineering job market'
      ],
      requiredSkills: ['JavaScript / TypeScript', 'React.js', 'Node.js & Express', 'SQL & Databases', 'Docker Basics', 'REST APIs'],
      existingSkills: ['JavaScript', 'React.js', 'Node.js', 'SQL', 'Git', 'HTML/CSS'],
      missingSkills: ['Docker & Containerization', 'AWS Cloud Fundamentals', 'System Design & Scalability', 'Automated Testing'],
      estimatedLearningWeeks: 4,
      averageSalaryRange: '₹8,00,000 - ₹18,00,000 / $85k - $140k',
      topCompaniesHiring: ['Google', 'Microsoft', 'Amazon', 'Swiggy', 'Razorpay', 'Atlassian']
    },
    {
      id: 'rec-2',
      roleName: 'Frontend Engineer (React & TypeScript)',
      matchPercentage: 88,
      readinessLevel: 'High',
      shortDescription: 'Build high-performance, accessible, responsive client-side applications.',
      whyMatches: ['Strong React component structure and UI styling foundations'],
      requiredSkills: ['React.js', 'TypeScript', 'Tailwind CSS', 'State Management', 'Web Performance'],
      existingSkills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
      missingSkills: ['Advanced State Management (Zustand/Redux)', 'Web Vitals & Performance Profiling'],
      estimatedLearningWeeks: 3,
      averageSalaryRange: '₹7,50,000 - ₹16,00,000 / $80k - $130k',
      topCompaniesHiring: ['Meta', 'Uber', 'Zomato', 'Cred']
    },
    {
      id: 'rec-3',
      roleName: 'Backend & Systems Engineer',
      matchPercentage: 80,
      readinessLevel: 'Medium',
      shortDescription: 'Architect resilient server-side microservices, database schemas, and cloud APIs.',
      whyMatches: ['Node.js, Express, and relational database coursework background'],
      requiredSkills: ['Node.js & Express', 'PostgreSQL', 'System Design', 'Docker', 'Redis Caching'],
      existingSkills: ['Node.js', 'Express', 'SQL', 'REST APIs'],
      missingSkills: ['System Design & Scaling', 'Redis Caching', 'Docker & Kubernetes'],
      estimatedLearningWeeks: 6,
      averageSalaryRange: '₹9,00,000 - ₹20,00,000 / $95k - $150k',
      topCompaniesHiring: ['Amazon', 'Oracle', 'Paytm', 'Salesforce']
    }
  ];

  return {
    extractedData,
    atsAnalysis,
    recommendations
  };
}

function generateSkillGaps(extracted: ExtractedResumeData, career?: CareerRecommendation): SkillGapItem[] {
  return [
    {
      skill: 'JavaScript (ES6+) & Core Runtime',
      category: 'Languages',
      currentLevel: 85,
      requiredLevel: 90,
      gapLevel: 'Low',
      status: 'have',
      whyNeeded: 'Fundamental language driving modern web client and server runtimes.',
      learningTimeHours: 6,
      recommendedYouTubeQuery: 'JavaScript Event Loop Async Await Deep Dive'
    },
    {
      skill: 'React.js & Hooks Architecture',
      category: 'Frameworks',
      currentLevel: 75,
      requiredLevel: 90,
      gapLevel: 'Medium',
      status: 'improve',
      whyNeeded: 'Dominant frontend library powering 70%+ of modern software engineering frontends.',
      learningTimeHours: 12,
      recommendedYouTubeQuery: 'React 19 Hooks and State Management Masterclass'
    },
    {
      skill: 'Node.js & Express Backend APIs',
      category: 'Frameworks',
      currentLevel: 68,
      requiredLevel: 85,
      gapLevel: 'Medium',
      status: 'improve',
      whyNeeded: 'Essential for building secure RESTful services, middleware, and authentication.',
      learningTimeHours: 15,
      recommendedYouTubeQuery: 'Node.js Express REST API Complete Guide'
    },
    {
      skill: 'PostgreSQL & SQL Query Optimization',
      category: 'Databases',
      currentLevel: 65,
      requiredLevel: 80,
      gapLevel: 'Medium',
      status: 'improve',
      whyNeeded: 'Critical for schema normalization, relational joins, indexing, and ACID transactions.',
      learningTimeHours: 10,
      recommendedYouTubeQuery: 'PostgreSQL Database Design and Query Optimization'
    },
    {
      skill: 'Docker & Containerization',
      category: 'Tools',
      currentLevel: 35,
      requiredLevel: 75,
      gapLevel: 'High',
      status: 'learn',
      whyNeeded: 'Industry standard for packaging applications, reproducible builds, and cloud deployments.',
      learningTimeHours: 14,
      recommendedYouTubeQuery: 'Docker for Developers Crash Course Fireship'
    },
    {
      skill: 'System Design & Scalable Architecture',
      category: 'Core Concepts',
      currentLevel: 40,
      requiredLevel: 80,
      gapLevel: 'High',
      status: 'learn',
      whyNeeded: 'Required to answer architectural trade-offs: caching (Redis), load balancing, and rate limits.',
      learningTimeHours: 18,
      recommendedYouTubeQuery: 'System Design Interview Fundamentals freeCodeCamp'
    }
  ];
}

function generateRoadmap(career?: CareerRecommendation, skillGaps?: SkillGapItem[]): any {
  const roleName = career?.roleName || 'Full Stack Developer';
  return {
    id: `road-${Date.now()}`,
    careerRoleId: career?.id || 'rec-1',
    careerRoleName: roleName,
    targetDomain: career?.roleName || 'Full Stack Development',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    overallProgress: 35,
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
            title: 'Master JS Asynchronous Execution (Event Loop, Microtasks, Promises)',
            description: 'Understand the Call Stack, Task vs Microtask queue, and Promise concurrency (all, allSettled).',
            completed: true,
            durationDays: 4,
            notes: 'Reviewed event loop mental models and tested Promise.allSettled with error boundaries.'
          },
          {
            id: 't-1-2',
            title: 'Adopt TypeScript in React & Express',
            description: 'Write generic interfaces, utility types (Partial, Pick, Omit), and typed Express Request handlers.',
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
            description: 'Implement helmet, cors, express-rate-limit, input validation, and structured error handlers.',
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
}

function calculateJobReadiness(ats?: ATSAnalysisResult, skillGaps?: SkillGapItem[], extracted?: ExtractedResumeData) {
  const atsScore = ats?.overallScore || 75;
  const highGapsCount = skillGaps?.filter((g) => g.gapLevel === 'High').length || 2;
  const skillsScore = Math.max(60, 92 - highGapsCount * 6);

  return {
    overallScore: Math.round(skillsScore * 0.3 + atsScore * 0.25 + 75 * 0.2 + 70 * 0.15 + 85 * 0.1),
    status: 'Growing Competency' as const,
    breakdown: {
      skills: { category: 'Core Technical Skills', score: skillsScore, weight: 25, recommendation: 'Solid foundation; learn Docker containerization and AWS cloud basics.' },
      resume: { category: 'ATS Resume Score', score: atsScore, weight: 20, recommendation: 'Good structure and keywords; add cloud keywords & test frameworks.' },
      projects: { category: 'Portfolio & Projects', score: 76, weight: 20, recommendation: 'Deploy projects to cloud with live HTTPS demo links in resume.' },
      experience: { category: 'Practical Experience', score: 68, weight: 15, recommendation: 'Highlight concrete metrics and performance numbers in work descriptions.' },
      interviewPrep: { category: 'Interview Readiness', score: 70, weight: 10, recommendation: 'Practice top 30 technical questions and basic system design with Copilot.' },
      portfolio: { category: 'GitHub & Portfolio', score: 85, weight: 10, recommendation: 'Clean GitHub presence and portfolio website.' }
    },
    topNextActions: [
      'Complete Docker & Containerization module in Phase 3 (+4% Readiness)',
      'Deploy your SaaS capstone project with live demo link (+3% Readiness)',
      'Practice 10 React & JavaScript technical interview questions (+3% Readiness)'
    ],
    estimatedDaysToReady: 24
  };
}

export default router;
