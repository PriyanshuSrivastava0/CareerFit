export const createMockResume = (userId: string, domain?: string) => ({
  id: `resume-${Date.now()}`,
  userId: userId,
  fileName: 'Demo_Resume_Processed.pdf',
  fileSize: 102450,
  fileType: 'application/pdf',
  rawText: 'Demo resume raw text content...',
  uploadedAt: new Date().toISOString(),
  preferredDomain: domain || 'Full Stack Development',
  atsAnalysis: {
    overallScore: 88,
    keywordMatchRate: 85,
    readabilityScore: 92,
    formattingScore: 90,
    missingKeywords: ['Docker', 'AWS', 'GraphQL', 'CI/CD'],
    strengths: ['Strong frontend framework experience', 'Clear impact metrics in projects', 'Consistent formatting'],
    weaknesses: ['Missing cloud infrastructure keywords', 'Could expand on testing frameworks']
  },
  extractedData: {
    personal: { name: 'Demo Candidate', email: 'demo@careerfit.ai', phone: '+91 9876543210' },
    education: [{ institution: 'Demo University', degree: 'B.Tech', year: '2025' }],
    experience: [{ company: 'Demo Corp', role: 'Intern', duration: '3 months', highlights: ['Did stuff'] }],
    skills: { languages: ['JavaScript', 'TypeScript'], frameworks: ['React', 'Node.js'], tools: ['Git'] },
    projects: [{ name: 'Demo Project', description: 'A cool project' }]
  },
  recommendations: [
    { id: 'rec-1', roleName: 'Full Stack Engineer', matchPercentage: 88, salary: '₹12-18 LPA', growth: 'Very High', reason: 'Strong match with React and Node.js' },
    { id: 'rec-2', roleName: 'Frontend Engineer', matchPercentage: 94, salary: '₹10-15 LPA', growth: 'High', reason: 'Excellent frontend framework knowledge' },
    { id: 'rec-3', roleName: 'Backend Engineer', matchPercentage: 75, salary: '₹12-20 LPA', growth: 'High', reason: 'Needs more DB and cloud experience' }
  ],
  selectedCareer: { id: 'rec-1', roleName: 'Full Stack Engineer', matchPercentage: 88, salary: '₹12-18 LPA', growth: 'Very High', reason: 'Strong match with React and Node.js' },
  skillGaps: [
    { skill: 'Docker', importance: 'High', status: 'missing', recommendedResource: 'res-6' },
    { skill: 'AWS Cloud Services', importance: 'Medium', status: 'missing', recommendedResource: 'res-8' }
  ],
  roadmap: {
    phases: [
      { id: 'ph-1', title: 'Phase 1: Core Fundamentals', duration: '2 weeks', tasks: [{ id: 't-1', title: 'Review Advanced React', completed: false }] },
      { id: 'ph-2', title: 'Phase 2: Backend Mastery', duration: '3 weeks', tasks: [{ id: 't-2', title: 'Learn Docker containerization', completed: false }] }
    ]
  },
  jobReadiness: {
    overallScore: 78,
    technicalScore: 82,
    experienceScore: 75,
    resumeScore: 88,
    interviewReadiness: 65,
    radarData: [
      { subject: 'Frontend', A: 90, fullMark: 100 },
      { subject: 'Backend', A: 75, fullMark: 100 },
      { subject: 'Cloud/DevOps', A: 40, fullMark: 100 },
      { subject: 'System Design', A: 60, fullMark: 100 },
      { subject: 'Algorithms', A: 85, fullMark: 100 }
    ]
  }
});
