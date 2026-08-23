import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CheckCircle2,
  Compass,
  Target,
  MapPin,
  Sparkles,
  Bot,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  FolderGit2,
  AlertTriangle,
  UploadCloud,
  Check,
  Clock
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { resume, setCurrentPage, setIsCopilotOpen, toggleTask } = useApp();

  const atsScore = resume?.atsAnalysis?.overallScore || 0;
  const careerMatch = resume?.selectedCareer?.matchPercentage || 0;
  const careerRoleName = resume?.selectedCareer?.roleName || 'Full Stack Developer';
  const roadmapProgress = resume?.roadmap?.overallProgress || 0;
  const readinessScore = resume?.jobReadiness?.overallScore || 0;

  const haveCount = resume?.skillGaps?.filter((s) => s.status === 'have').length || 1;
  const improveCount = resume?.skillGaps?.filter((s) => s.status === 'improve').length || 3;
  const learnCount = resume?.skillGaps?.filter((s) => s.status === 'learn').length || 2;

  // Next incomplete task
  let nextTask: any = null;
  let nextPhase: any = null;
  if (resume?.roadmap?.phases) {
    for (const phase of resume.roadmap.phases) {
      for (const task of phase.tasks) {
        if (!task.completed) {
          nextTask = task;
          nextPhase = phase;
          break;
        }
      }
      if (nextTask) break;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Grid: Welcome Banner Module */}
      <div className="p-8 rounded-[2rem] bg-indigo-600 text-white relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider backdrop-blur-xs">
                Candidate Dashboard
              </span>
              <span className="text-xs text-indigo-100 font-medium">
                Targeting: <strong className="text-white font-bold">{resume?.preferredDomain || currentUser?.currentDomain || 'Full Stack Development'}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome Back, {currentUser?.name || 'Engineer'}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              {resume ? (
                <>Your resume <span className="font-bold text-white">({resume.fileName})</span> is active. You have completed <strong className="text-white font-bold underline underline-offset-4">{roadmapProgress}%</strong> of your job readiness roadmap.</>
              ) : (
                <>Upload your resume to get your ATS score, career match analysis, and customized 5-phase learning roadmap.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('upload')}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{resume ? 'Re-Upload / Analyze' : 'Upload Resume'}</span>
            </button>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-5 py-3 rounded-2xl bg-indigo-700/80 hover:bg-indigo-700 text-white text-xs font-bold border border-indigo-400/40 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>Ask Copilot AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* If No Resume Uploaded Yet */}
      {!resume && (
        <div className="p-10 rounded-[2rem] bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">No Resume Uploaded Yet</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload your resume in PDF, DOCX, or text format to get immediate ATS feedback, skill breakdown, and role matching.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('upload')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
          >
            Upload Resume Now
          </button>
        </div>
      )}

      {/* Main 4 Key Bento Metric Tiles */}
      {resume && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* ATS Score Card */}
          <div
            onClick={() => setCurrentPage('ats')}
            className="p-6 rounded-[2rem] bg-white border border-slate-200/80 hover:border-indigo-400 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Score</span>
                <span className="p-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{atsScore}</span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
                <span className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {atsScore >= 80 ? 'Good' : 'Fair'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center justify-between group-hover:text-indigo-600 font-semibold transition-colors pt-3 border-t border-slate-100">
              <span>View 9-factor breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>

          {/* Career Fit Card */}
          <div
            onClick={() => setCurrentPage('recommendations')}
            className="p-6 rounded-[2rem] bg-white border border-slate-200/80 hover:border-purple-400 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Career Fit</span>
                <span className="p-2 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                  <Compass className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{careerMatch}%</span>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{careerRoleName}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center justify-between group-hover:text-purple-600 font-semibold transition-colors pt-3 border-t border-slate-100">
              <span>Explore 3 matched roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>

          {/* Skill Gap Matrix Card */}
          <div
            onClick={() => setCurrentPage('skill-gap')}
            className="p-6 rounded-[2rem] bg-white border border-slate-200/80 hover:border-rose-400 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Gap Status</span>
                <span className="p-2 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <Target className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
                  {haveCount} Have
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-100">
                  {improveCount} Improve
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 font-bold border border-rose-100">
                  {learnCount} Learn
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center justify-between group-hover:text-rose-600 font-semibold transition-colors pt-3 border-t border-slate-100">
              <span>Review skill matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>

          {/* Job Readiness Score Card */}
          <div
            onClick={() => setCurrentPage('readiness')}
            className="p-6 rounded-[2rem] bg-white border border-slate-200/80 hover:border-emerald-400 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Readiness</span>
                <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600">{readinessScore}%</span>
                <span className="text-xs font-medium text-slate-500">~24 days to ready</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center justify-between group-hover:text-emerald-600 font-semibold transition-colors pt-3 border-t border-slate-100">
              <span>View readiness scorecard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>
      )}

      {/* Bento Grid: Active Roadmap & Side Modules */}
      {resume && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Roadmap Progress & Action Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Roadmap Progress Box */}
            <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Active Roadmap: {careerRoleName}</h3>
                  <p className="text-xs text-slate-500">5 structured phases to achieve full job readiness</p>
                </div>
                <button
                  onClick={() => setCurrentPage('roadmap')}
                  className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-indigo-600 border border-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <span>Open Full Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-600">Overall Roadmap Completion</span>
                  <span className="text-indigo-600 font-bold">{roadmapProgress}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${roadmapProgress}%` }}
                  />
                </div>
              </div>

              {/* Next Milestone Focus */}
              {nextTask && (
                <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" /> Next Recommended Milestone
                    </span>
                    <span className="text-xs font-medium text-slate-500">{nextPhase?.title}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{nextTask.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{nextTask.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-indigo-100">
                    <button
                      onClick={() => toggleTask(nextTask.id, true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Milestone Complete</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage('roadmap')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      View Phase Tasks →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={() => setCurrentPage('resources')}
                className="p-5 rounded-[2rem] bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Video Library</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Free curated lectures</p>
              </button>

              <button
                onClick={() => setCurrentPage('projects')}
                className="p-5 rounded-[2rem] bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-105 transition-transform">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Projects Blueprints</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Production blueprints</p>
              </button>

              <button
                onClick={() => setCurrentPage('domain')}
                className="p-5 rounded-[2rem] bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Change Domain</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Explore 15+ tracks</p>
              </button>

              <button
                onClick={() => setCurrentPage('extracted')}
                className="p-5 rounded-[2rem] bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Edit Profile</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Refine parsed data</p>
              </button>
            </div>
          </div>

          {/* Right Col: Top ATS Strengths & Copilot Bento Module */}
          <div className="space-y-6">
            <div className="p-7 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">ATS Key Findings</h3>
                <span className="text-xs text-indigo-600 font-bold cursor-pointer hover:underline" onClick={() => setCurrentPage('ats')}>
                  Details →
                </span>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Top Strengths</p>
                {resume.atsAnalysis?.strengths.slice(0, 2).map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              {/* Top Improvement */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Priority ATS Improvement</p>
                {resume.atsAnalysis?.improvements.slice(0, 2).map((imp, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>

              {/* Missing keywords badge list */}
              {resume.atsAnalysis?.missingCrucialKeywords && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Missing High-Impact Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.atsAnalysis.missingCrucialKeywords.slice(0, 5).map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Bento Module: CareerFit Copilot Promo */}
            <div className="p-7 rounded-[2rem] bg-slate-900 text-white border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Ask CareerFit Copilot</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Need advice on how to rewrite your project descriptions or prepare for technical interviews?
              </p>
              <button
                onClick={() => setIsCopilotOpen(true)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-bold text-white transition-all shadow-sm"
              >
                Chat with Copilot AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
