import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  ExtractedPersonalInfo,
  ExtractedEducation,
  ExtractedExperience,
  ExtractedProject,
  ExtractedSkills
} from '../../types';
import {
  validateEmail,
  validateIndianPhone,
  validateUrl,
  validateGradYear
} from '../../lib/validation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Code,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Layers,
  Terminal,
  Database,
  Cpu,
  Smile,
  Info
} from 'lucide-react';

export const ExtractedResumeEditor: React.FC = () => {
  const { resume, updateExtractedResumeData, setCurrentPage, showToast } = useApp();
  const { currentUser } = useAuth();

  const extracted = resume?.extractedData;

  // Active section tab for mobile/desktop quick navigation
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'education' | 'experience' | 'projects' | 'skills'>('all');

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 1. Personal Details State
  const [personalInfo, setPersonalInfo] = useState<ExtractedPersonalInfo>({
    fullName: extracted?.personalInfo?.fullName || currentUser?.name || '',
    email: extracted?.personalInfo?.email || currentUser?.email || '',
    phone: extracted?.personalInfo?.phone || currentUser?.phone || '',
    location: extracted?.personalInfo?.location || 'Bengaluru, India',
    linkedin: extracted?.personalInfo?.linkedin || '',
    github: extracted?.personalInfo?.github || '',
    portfolio: extracted?.personalInfo?.portfolio || ''
  });

  const [summary, setSummary] = useState<string>(
    extracted?.summary || 'Passionate software engineer focused on building robust, high-performance web applications and scalable distributed systems.'
  );

  // 2. Education State
  const [educationList, setEducationList] = useState<ExtractedEducation[]>(() => {
    if (extracted?.education && extracted.education.length > 0) {
      return extracted.education;
    }
    return [
      {
        degree: currentUser?.education || 'B.Tech in Computer Science & Engineering',
        institution: 'National Institute of Technology',
        graduationYear: currentUser?.graduationYear || '2025',
        cgpaOrPercentage: '8.7 / 10 CGPA',
        relevantCoursework: ['Data Structures & Algorithms', 'Database Management Systems', 'Computer Networks', 'Operating Systems']
      }
    ];
  });

  // 3. Experience State
  const [experienceList, setExperienceList] = useState<ExtractedExperience[]>(() => {
    if (extracted?.experience && extracted.experience.length > 0) {
      return extracted.experience;
    }
    return [
      {
        id: 'exp-1',
        company: 'InnovateTech Solutions',
        role: 'Full Stack Engineering Intern',
        duration: 'Jan 2024 - Present',
        responsibilities: [
          'Engineered responsive React/TypeScript frontend workflows and optimized RESTful APIs in Node.js',
          'Collaborated with senior engineers to implement Redis caching layer, reducing API latency by 35%',
          'Wrote unit and integration tests using Jest, achieving 88% overall code coverage'
        ],
        achievements: [
          'Recognized as top intern contributor for Q1 engineering sprint',
          'Shipped mission-critical candidate evaluation dashboard used by 12,000+ daily users'
        ]
      }
    ];
  });

  // 4. Projects State
  const [projectsList, setProjectsList] = useState<ExtractedProject[]>(() => {
    if (extracted?.projects && extracted.projects.length > 0) {
      return extracted.projects;
    }
    return [
      {
        id: 'proj-1',
        name: 'AI-Powered Distributed Job Tracker',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
        description: 'Built a real-time full-stack job application tracking platform with automated email status synchronization and ATS scoring metrics.',
        impact: 'Scaled to 2,500 active users with sub-100ms database query response times.',
        liveUrl: 'https://jobtracker.example.com',
        githubUrl: 'https://github.com/example/job-tracker'
      },
      {
        id: 'proj-2',
        name: 'Microservices E-Commerce API Engine',
        technologies: ['Node.js', 'Express', 'MongoDB', 'Redis', 'JWT', 'Stripe API'],
        description: 'Architected an event-driven payment and inventory processing pipeline handling concurrent transaction ordering safely.',
        impact: 'Handled 500+ simulated concurrent orders without deadlocks.',
        liveUrl: 'https://ecommerce-api.example.com',
        githubUrl: 'https://github.com/example/ecommerce-engine'
      }
    ];
  });

  // 5. Skills State
  const [skills, setSkills] = useState<ExtractedSkills>(() => {
    if (extracted?.skills) {
      return {
        languages: extracted.skills.languages || ['JavaScript', 'TypeScript', 'Python', 'SQL'],
        frameworks: extracted.skills.frameworks || ['React', 'Node.js', 'Express', 'Next.js', 'Tailwind CSS'],
        databases: extracted.skills.databases || ['PostgreSQL', 'MongoDB', 'Redis'],
        tools: extracted.skills.tools || ['Git', 'Docker', 'AWS', 'Linux', 'Postman'],
        technical: extracted.skills.technical || ['REST APIs', 'Data Structures & Algorithms', 'System Design', 'CI/CD Pipelines'],
        soft: extracted.skills.soft || ['Problem Solving', 'Team Collaboration', 'Agile Methodology', 'Technical Documentation']
      };
    }
    return {
      languages: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'C++'],
      frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'Tailwind CSS'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis'],
      tools: ['Git', 'Docker', 'AWS', 'Linux', 'GitHub Actions'],
      technical: ['RESTful Architecture', 'Data Structures & Algorithms', 'Object-Oriented Design'],
      soft: ['Critical Thinking', 'Agile/Scrum', 'Cross-functional Communication']
    };
  });

  // Helper inputs for adding new tags / items
  const [newSkillInput, setNewSkillInput] = useState('');
  const [skillCategory, setSkillCategory] = useState<keyof ExtractedSkills>('languages');

  // Track any changes
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // -------------------------------------------------------------
  // Validation Logic
  // -------------------------------------------------------------
  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};

    // Personal validation
    if (!personalInfo.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }

    const emailCheck = validateEmail(personalInfo.email);
    if (!emailCheck.isValid) {
      errors.email = emailCheck.error || 'Invalid email address.';
    }

    if (personalInfo.phone.trim()) {
      const phoneCheck = validateIndianPhone(personalInfo.phone);
      if (!phoneCheck.isValid) {
        errors.phone = phoneCheck.error || 'Invalid phone number.';
      }
    }

    if (personalInfo.linkedin.trim()) {
      const urlCheck = validateUrl(personalInfo.linkedin);
      if (!urlCheck.isValid) errors.linkedin = 'Please provide a valid LinkedIn URL.';
    }

    if (personalInfo.github.trim()) {
      const urlCheck = validateUrl(personalInfo.github);
      if (!urlCheck.isValid) errors.github = 'Please provide a valid GitHub URL.';
    }

    if (personalInfo.portfolio.trim()) {
      const urlCheck = validateUrl(personalInfo.portfolio);
      if (!urlCheck.isValid) errors.portfolio = 'Please provide a valid Portfolio URL.';
    }

    // Education validation
    educationList.forEach((edu, idx) => {
      if (!edu.degree.trim()) {
        errors[`edu_degree_${idx}`] = 'Degree / qualification name is required.';
      }
      if (!edu.institution.trim()) {
        errors[`edu_inst_${idx}`] = 'Institution / university name is required.';
      }
      if (edu.graduationYear.trim()) {
        const yearCheck = validateGradYear(edu.graduationYear);
        if (!yearCheck.isValid) {
          errors[`edu_year_${idx}`] = yearCheck.error || 'Invalid graduation year.';
        }
      }
    });

    // Experience validation
    experienceList.forEach((exp, idx) => {
      if (!exp.role.trim()) {
        errors[`exp_role_${idx}`] = 'Job role / title is required.';
      }
      if (!exp.company.trim()) {
        errors[`exp_company_${idx}`] = 'Company / organization name is required.';
      }
    });

    // Project validation
    projectsList.forEach((proj, idx) => {
      if (!proj.name.trim()) {
        errors[`proj_name_${idx}`] = 'Project name is required.';
      }
      if (!proj.description.trim()) {
        errors[`proj_desc_${idx}`] = 'Project description is required.';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------------------------------------
  // Save Handler
  // -------------------------------------------------------------
  const handleSave = async () => {
    if (!validateAll()) {
      showToast('error', 'Validation Notice', 'Please correct the highlighted fields before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        personalInfo,
        summary,
        education: educationList,
        experience: experienceList,
        projects: projectsList,
        skills
      };

      await updateExtractedResumeData(payload);
      setIsDirty(false);
      showToast('success', 'Profile Synchronized', 'Your extracted resume info and skill index have been updated!');
    } catch (err: any) {
      showToast('error', 'Save Failed', err.message || 'Could not update extracted information.');
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Education List Handlers
  // -------------------------------------------------------------
  const handleAddEducation = () => {
    setEducationList([
      ...educationList,
      {
        degree: '',
        institution: '',
        graduationYear: `${new Date().getFullYear()}`,
        cgpaOrPercentage: '',
        relevantCoursework: []
      }
    ]);
    markDirty();
  };

  const handleUpdateEducation = (index: number, field: keyof ExtractedEducation, value: any) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: value };
    setEducationList(updated);
    markDirty();
  };

  const handleRemoveEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
    markDirty();
  };

  const handleAddCourseworkTag = (eduIndex: number, tag: string) => {
    if (!tag.trim()) return;
    const current = educationList[eduIndex].relevantCoursework || [];
    if (!current.includes(tag.trim())) {
      handleUpdateEducation(eduIndex, 'relevantCoursework', [...current, tag.trim()]);
    }
  };

  const handleRemoveCourseworkTag = (eduIndex: number, tag: string) => {
    const current = educationList[eduIndex].relevantCoursework || [];
    handleUpdateEducation(eduIndex, 'relevantCoursework', current.filter((t) => t !== tag));
  };

  // -------------------------------------------------------------
  // Experience List Handlers
  // -------------------------------------------------------------
  const handleAddExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        id: `exp-${Date.now()}`,
        company: '',
        role: '',
        duration: 'Jun 2024 - Present',
        responsibilities: ['Developed key application modules and optimized query pipelines.'],
        achievements: []
      }
    ]);
    markDirty();
  };

  const handleUpdateExperience = (index: number, field: keyof ExtractedExperience, value: any) => {
    const updated = [...experienceList];
    updated[index] = { ...updated[index], [field]: value };
    setExperienceList(updated);
    markDirty();
  };

  const handleRemoveExperience = (index: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
    markDirty();
  };

  const handleAddResponsibilityBullet = (expIndex: number, bulletText: string) => {
    if (!bulletText.trim()) return;
    const current = experienceList[expIndex].responsibilities || [];
    handleUpdateExperience(expIndex, 'responsibilities', [...current, bulletText.trim()]);
  };

  const handleRemoveResponsibilityBullet = (expIndex: number, bulletIdx: number) => {
    const current = experienceList[expIndex].responsibilities || [];
    handleUpdateExperience(
      expIndex,
      'responsibilities',
      current.filter((_, i) => i !== bulletIdx)
    );
  };

  // -------------------------------------------------------------
  // Project List Handlers
  // -------------------------------------------------------------
  const handleAddProject = () => {
    setProjectsList([
      ...projectsList,
      {
        id: `proj-${Date.now()}`,
        name: '',
        technologies: ['React', 'TypeScript'],
        description: '',
        impact: '',
        liveUrl: '',
        githubUrl: ''
      }
    ]);
    markDirty();
  };

  const handleUpdateProject = (index: number, field: keyof ExtractedProject, value: any) => {
    const updated = [...projectsList];
    updated[index] = { ...updated[index], [field]: value };
    setProjectsList(updated);
    markDirty();
  };

  const handleRemoveProject = (index: number) => {
    setProjectsList(projectsList.filter((_, i) => i !== index));
    markDirty();
  };

  const handleAddProjectTechTag = (projIndex: number, tech: string) => {
    if (!tech.trim()) return;
    const current = projectsList[projIndex].technologies || [];
    if (!current.includes(tech.trim())) {
      handleUpdateProject(projIndex, 'technologies', [...current, tech.trim()]);
    }
  };

  const handleRemoveProjectTechTag = (projIndex: number, tech: string) => {
    const current = projectsList[projIndex].technologies || [];
    handleUpdateProject(projIndex, 'technologies', current.filter((t) => t !== tech));
  };

  // -------------------------------------------------------------
  // Skills Handlers
  // -------------------------------------------------------------
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkillInput.trim()) return;
    const val = newSkillInput.trim();
    const current = skills[skillCategory] || [];
    if (!current.includes(val)) {
      setSkills({
        ...skills,
        [skillCategory]: [...current, val]
      });
      markDirty();
    }
    setNewSkillInput('');
  };

  const handleQuickAddSuggestedSkill = (category: keyof ExtractedSkills, val: string) => {
    const current = skills[category] || [];
    if (!current.includes(val)) {
      setSkills({
        ...skills,
        [category]: [...current, val]
      });
      markDirty();
      showToast('info', 'Skill Added', `Added ${val} to ${category}`);
    }
  };

  const handleRemoveSkill = (category: keyof ExtractedSkills, val: string) => {
    const current = skills[category] || [];
    setSkills({
      ...skills,
      [category]: current.filter((s) => s !== val)
    });
    markDirty();
  };

  const popularSuggestions: Record<keyof ExtractedSkills, string[]> = {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'SQL', 'HTML/CSS'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Vue.js', 'Django', 'FastAPI', 'NestJS'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Prisma', 'Firebase', 'Elasticsearch'],
    tools: ['Docker', 'AWS', 'Git', 'GitHub Actions', 'Kubernetes', 'Linux', 'Vercel', 'Postman'],
    technical: ['REST APIs', 'GraphQL', 'System Design', 'Microservices', 'Unit Testing', 'CI/CD', 'Data Structures'],
    soft: ['Problem Solving', 'Team Collaboration', 'Agile/Scrum', 'Leadership', 'Technical Writing']
  };

  // Count total items
  const totalSkillsCount =
    (skills.languages?.length || 0) +
    (skills.frameworks?.length || 0) +
    (skills.databases?.length || 0) +
    (skills.tools?.length || 0) +
    (skills.technical?.length || 0) +
    (skills.soft?.length || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Floating Control Bar */}
      <div className="sticky top-20 z-30 p-4 sm:p-5 rounded-[2rem] bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setCurrentPage('ats')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to ATS Score</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">Extracted Profile Editor</span>
              {isDirty ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold animate-pulse">
                  Unsaved Changes
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  All Synced
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Changes instantly update ATS keyword density & personalized career fit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              if (window.confirm('Reset all changes to original parsed resume data?')) {
                window.location.reload();
              }
            }}
            disabled={!isDirty}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            title="Discard Unsaved Changes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Discard</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px]"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Sync ATS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-rose-900">Please review {Object.keys(validationErrors).length} required field(s):</p>
            <ul className="list-disc list-inside space-y-0.5 text-rose-700">
              {Object.values(validationErrors).slice(0, 3).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
              {Object.values(validationErrors).length > 3 && (
                <li>...and {Object.values(validationErrors).length - 3} other fields.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Section Navigation Tabs (Responsive) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Sections', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'personal', label: 'Personal & Bio', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'education', label: `Education (${educationList.length})`, icon: <GraduationCap className="w-3.5 h-3.5" /> },
          { id: 'experience', label: `Experience (${experienceList.length})`, icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'projects', label: `Projects (${projectsList.length})`, icon: <FolderGit2 className="w-3.5 h-3.5" /> },
          { id: 'skills', label: `Skills (${totalSkillsCount})`, icon: <Code className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* 1. PERSONAL DETAILS & SUMMARY */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'personal') && (
        <section className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Personal Details & Online Presence</h3>
                <p className="text-xs text-slate-500 font-medium">Contact information and professional overview</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              Core Identity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => {
                    setPersonalInfo({ ...personalInfo, fullName: e.target.value });
                    markDirty();
                  }}
                  placeholder="e.g. Priyanshu Kumar"
                  className={`w-full bg-slate-50 border rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                    validationErrors.fullName ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              {validationErrors.fullName && <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationErrors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => {
                    setPersonalInfo({ ...personalInfo, email: e.target.value });
                    markDirty();
                  }}
                  placeholder="e.g. alex@example.com"
                  className={`w-full bg-slate-50 border rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                    validationErrors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              {validationErrors.email && <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationErrors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number (Indian / +91)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={personalInfo.phone}
                  onChange={(e) => {
                    setPersonalInfo({ ...personalInfo, phone: e.target.value });
                    markDirty();
                  }}
                  placeholder="+91 98765 43210"
                  className={`w-full bg-slate-50 border rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                    validationErrors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              {validationErrors.phone && <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationErrors.phone}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => {
                    setPersonalInfo({ ...personalInfo, location: e.target.value });
                    markDirty();
                  }}
                  placeholder="e.g. Bengaluru, India / Remote"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">LinkedIn Profile URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={personalInfo.linkedin}
                  onChange={(e) => {
                    setPersonalInfo({ ...personalInfo, linkedin: e.target.value });
                    markDirty();
                  }}
                  placeholder="https://linkedin.com/in/username"
                  className={`w-full bg-slate-50 border rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                    validationErrors.linkedin ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              {validationErrors.linkedin && <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationErrors.linkedin}</p>}
            </div>

            {/* GitHub Profile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">GitHub Profile URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={personalInfo.github}
                  onChange={(e) => {
                    setPersonalInfo({ ...personalInfo, github: e.target.value });
                    markDirty();
                  }}
                  placeholder="https://github.com/username"
                  className={`w-full bg-slate-50 border rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                    validationErrors.github ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              {validationErrors.github && <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationErrors.github}</p>}
            </div>
          </div>

          {/* Portfolio Website */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Portfolio / Personal Website</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={personalInfo.portfolio}
                onChange={(e) => {
                  setPersonalInfo({ ...personalInfo, portfolio: e.target.value });
                  markDirty();
                }}
                placeholder="https://myportfolio.dev"
                className={`w-full bg-slate-50 border rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                  validationErrors.portfolio ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
            </div>
            {validationErrors.portfolio && <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationErrors.portfolio}</p>}
          </div>

          {/* Summary / Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Professional Resume Summary / Bio
              </label>
              <span className="text-[11px] text-slate-400">{summary.length} characters</span>
            </div>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                markDirty();
              }}
              placeholder="Summarize your engineering expertise, core technical strengths, and career aspirations..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
            />
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 2. EDUCATION SECTION */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'education') && (
        <section className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Academic Background & Education</h3>
                <p className="text-xs text-slate-500 font-medium">Degrees, universities, CGPA and coursework</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddEducation}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Degree</span>
            </button>
          </div>

          <div className="space-y-4">
            {educationList.map((edu, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800">
                      {edu.degree || `Qualification #${idx + 1}`}
                    </h4>
                  </div>
                  {educationList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove Education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Degree Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Degree / Specialization <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                      placeholder="e.g. B.Tech in Computer Science & Engineering"
                      className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none ${
                        validationErrors[`edu_degree_${idx}`] ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  {/* Institution */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      University / College <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                      placeholder="e.g. Indian Institute of Technology Delhi"
                      className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none ${
                        validationErrors[`edu_inst_${idx}`] ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  {/* Grad Year */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => handleUpdateEducation(idx, 'graduationYear', e.target.value)}
                      placeholder="2025"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* CGPA */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">CGPA / Percentage</label>
                    <input
                      type="text"
                      value={edu.cgpaOrPercentage || ''}
                      onChange={(e) => handleUpdateEducation(idx, 'cgpaOrPercentage', e.target.value)}
                      placeholder="e.g. 8.8 CGPA or 85%"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Relevant Coursework */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Key Relevant Courses</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {edu.relevantCoursework?.map((course, cIdx) => (
                        <span
                          key={cIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-medium"
                        >
                          {course}
                          <button
                            type="button"
                            onClick={() => handleRemoveCourseworkTag(idx, course)}
                            className="hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type course name and press Enter (e.g. DBMS, Operating Systems)..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          if (val.trim()) {
                            handleAddCourseworkTag(idx, val.trim());
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 3. WORK EXPERIENCE & INTERNSHIPS */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'experience') && (
        <section className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Work Experience & Internships</h3>
                <p className="text-xs text-slate-500 font-medium">Roles, companies, responsibilities, and quantified impact</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddExperience}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Position</span>
            </button>
          </div>

          {experienceList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
              <p className="text-xs text-slate-500 font-medium">No experience items added yet.</p>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                + Add First Work Experience or Internship
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {experienceList.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-slate-800">
                        {exp.role ? `${exp.role} at ${exp.company || 'Company'}` : `Work Experience #${idx + 1}`}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Role */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Role / Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                        placeholder="e.g. Frontend Engineer Intern"
                        className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none ${
                          validationErrors[`exp_role_${idx}`] ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                        }`}
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Company / Organization <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                        placeholder="e.g. Swiggy, Flipkart, TechCorp"
                        className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none ${
                          validationErrors[`exp_company_${idx}`] ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                        }`}
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration / Dates</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => handleUpdateExperience(idx, 'duration', e.target.value)}
                        placeholder="e.g. May 2024 - Jul 2024"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Responsibilities Bullets */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Key Responsibilities & Contributions (Action-oriented bullet points)
                    </label>
                    <div className="space-y-2">
                      {exp.responsibilities?.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...(exp.responsibilities || [])];
                              updated[bIdx] = e.target.value;
                              handleUpdateExperience(idx, 'responsibilities', updated);
                            }}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveResponsibilityBullet(idx, bIdx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add new responsibility bullet (e.g. Built automated CI/CD pipeline reducing build time by 25%)..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value;
                            if (val.trim()) {
                              handleAddResponsibilityBullet(idx, val.trim());
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                          if (input && input.value.trim()) {
                            handleAddResponsibilityBullet(idx, input.value.trim());
                            input.value = '';
                          }
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bullet</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* 4. TECHNICAL PROJECTS */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'projects') && (
        <section className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Featured Technical Projects</h3>
                <p className="text-xs text-slate-500 font-medium">Full-stack applications, repositories, and architecture</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddProject}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="space-y-5">
            {projectsList.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800">
                      {proj.name || `Project #${idx + 1}`}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveProject(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Project Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Project Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                      placeholder="e.g. Distributed Job Tracker with Real-time Alerts"
                      className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none ${
                        validationErrors[`proj_name_${idx}`] ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  {/* Impact */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Measurable Impact / Outcome</label>
                    <input
                      type="text"
                      value={proj.impact || ''}
                      onChange={(e) => handleUpdateProject(idx, 'impact', e.target.value)}
                      placeholder="e.g. 2,000+ stars, sub-50ms latency"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Live URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Live Application URL</label>
                    <input
                      type="text"
                      value={proj.liveUrl || ''}
                      onChange={(e) => handleUpdateProject(idx, 'liveUrl', e.target.value)}
                      placeholder="https://app.example.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">GitHub Repository URL</label>
                    <input
                      type="text"
                      value={proj.githubUrl || ''}
                      onChange={(e) => handleUpdateProject(idx, 'githubUrl', e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-600">Technologies & Frameworks</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {proj.technologies?.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-semibold"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveProjectTechTag(idx, tech)}
                            className="hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add tech stack chip (e.g. Next.js, Redis, Docker) and press Enter..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          if (val.trim()) {
                            handleAddProjectTechTag(idx, val.trim());
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Project Description & Architecture <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                      placeholder="Describe the problem solved, architectural approach, and key technical implementation details..."
                      className={`w-full bg-white border rounded-xl p-3 text-xs text-slate-900 focus:outline-none leading-relaxed ${
                        validationErrors[`proj_desc_${idx}`] ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 5. SKILLS MATRIX */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'skills') && (
        <section className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Extracted Skills & Competencies</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {totalSkillsCount} indexed skills matching industry benchmarks
                </p>
              </div>
            </div>
          </div>

          {/* Add Skill Quick Bar */}
          <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-2.5">
            <select
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value as keyof ExtractedSkills)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="languages">Programming Languages</option>
              <option value="frameworks">Frameworks & Libraries</option>
              <option value="databases">Databases & Storage</option>
              <option value="tools">Tools & DevOps</option>
              <option value="technical">Core Technical Concepts</option>
              <option value="soft">Soft Skills</option>
            </select>

            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder={`Add new ${skillCategory} skill (e.g. Next.js, Redis, Docker)...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />

            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </form>

          {/* Categorized Skills Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Languages */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>Programming Languages ({skills.languages?.length || 0})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {skills.languages?.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs group"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill('languages', item)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggestions */}
              <div className="pt-2 border-t border-slate-200/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quick Add Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {popularSuggestions.languages
                    .filter((s) => !skills.languages?.includes(s))
                    .slice(0, 6)
                    .map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickAddSuggestedSkill('languages', s)}
                        className="px-2 py-0.5 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-[10px] font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Frameworks */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Frameworks & Libraries ({skills.frameworks?.length || 0})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {skills.frameworks?.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 shadow-2xs"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill('frameworks', item)}
                      className="text-indigo-400 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggestions */}
              <div className="pt-2 border-t border-slate-200/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quick Add Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {popularSuggestions.frameworks
                    .filter((s) => !skills.frameworks?.includes(s))
                    .slice(0, 6)
                    .map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickAddSuggestedSkill('frameworks', s)}
                        className="px-2 py-0.5 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-[10px] font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Databases */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Databases & Cloud Storage ({skills.databases?.length || 0})</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {skills.databases?.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill('databases', item)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quick Add Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {popularSuggestions.databases
                    .filter((s) => !skills.databases?.includes(s))
                    .slice(0, 6)
                    .map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickAddSuggestedSkill('databases', s)}
                        className="px-2 py-0.5 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-[10px] font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Tools & DevOps */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Tools, DevOps & Cloud ({skills.tools?.length || 0})</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {skills.tools?.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill('tools', item)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quick Add Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {popularSuggestions.tools
                    .filter((s) => !skills.tools?.includes(s))
                    .slice(0, 6)
                    .map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickAddSuggestedSkill('tools', s)}
                        className="px-2 py-0.5 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-[10px] font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Technical Concepts */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Core CS & Technical Concepts ({skills.technical?.length || 0})</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {skills.technical?.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill('technical', item)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                <Smile className="w-4 h-4 text-indigo-600" />
                <span>Soft Skills & Collaboration ({skills.soft?.length || 0})</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {skills.soft?.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill('soft', item)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="p-6 rounded-[2rem] bg-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="font-black text-base">Ready to refresh your career roadmap?</h4>
          <p className="text-xs text-indigo-100 font-medium">
            Saving your edits recalculates ATS compatibility scores and updates recommended learning paths.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[160px] w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-indigo-700/30 border-t-indigo-700 rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Sync All Sections</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
