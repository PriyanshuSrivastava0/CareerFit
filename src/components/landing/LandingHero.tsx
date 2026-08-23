import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Compass, Cpu, FileText, Zap } from 'lucide-react';

interface LandingHeroProps {
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenAuth: propOnOpenAuth }) => {
  const { setCurrentPage, openAuthModal } = useApp();
  const { currentUser, loginDemoUser } = useAuth();

  const handleOpenAuth = propOnOpenAuth || ((mode) => openAuthModal(mode));

  const handleStartAnalysis = () => {
    if (currentUser) {
      setCurrentPage('upload');
    } else {
      // Log in demo user directly or show auth modal
      loginDemoUser(0);
      setCurrentPage('upload');
    }
  };

  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Announcement Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-indigo-700 text-xs shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold">CareerFit AI 2.0 Released:</span>
            <span className="text-slate-600 font-medium">Live Gemini 3.7 Flash Engine & ATS Benchmarks</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Your Resume Tells Your Story.{' '}
            <span className="text-indigo-600">
              CareerFit AI Tells You Where It Can Take You.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Stop guessing why recruiters reject your resume. Get your exact <strong className="text-slate-900 font-bold">ATS score</strong>, discover high-match <strong className="text-slate-900 font-bold">career paths</strong>, pinpoint <strong className="text-slate-900 font-bold">missing skills</strong>, and follow a <strong className="text-slate-900 font-bold">custom roadmap</strong> to get hired.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartAnalysis}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2.5 group"
            >
              <FileText className="w-4 h-4 text-indigo-100 group-hover:scale-110 transition-transform" />
              <span>Analyze My Resume (Instant)</span>
              <ArrowRight className="w-4 h-4 text-indigo-100 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                loginDemoUser(0);
                setCurrentPage('dashboard');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Explore Live Demo Dashboard</span>
            </button>
          </div>

          {/* Live Micro-stats */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Enterprise ATS parser algorithms</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Curated YouTube & GitHub learning paths</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Hero Preview Card in Bento Grid Style */}
        <div className="mt-8 max-w-5xl mx-auto rounded-[2.5rem] bg-white p-2 border border-slate-200/80 shadow-md">
          <div className="bg-slate-50/70 rounded-[2rem] p-6 sm:p-8 border border-slate-100">
            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
              {/* Left Column: ATS Score Preview */}
              <div className="lg:w-1/3 bg-white border border-slate-200/80 rounded-[1.8rem] p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate ATS Score</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Tier 1 Match
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900">82</span>
                    <span className="text-sm font-bold text-slate-400">/ 100</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-bold mt-1">▲ 14% higher than average fresh graduate applicant</p>
                </div>

                <div className="mt-6 space-y-2 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Keyword Density:</span>
                    <span className="font-bold text-slate-900">88%</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Formatting Compatibility:</span>
                    <span className="font-bold text-slate-900">92%</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Measurable Impact:</span>
                    <span className="font-bold text-amber-600">76% (Add metrics)</span>
                  </div>
                </div>
              </div>

              {/* Center Column: Matched Career & Skill Gaps */}
              <div className="lg:w-2/3 flex flex-col justify-between space-y-4">
                <div className="p-5 rounded-[1.8rem] bg-indigo-50 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="text-[11px] text-indigo-700 font-bold uppercase tracking-wider">Top AI Career Match</div>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">Full Stack Developer (React & Node.js)</h3>
                    <p className="text-xs text-slate-600 mt-1 font-normal">High compatibility with your JavaScript, React, and REST API projects.</p>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-sm shrink-0 shadow-2xs">
                    91% Match
                  </div>
                </div>

                {/* Skill Gaps Mini Table */}
                <div className="bg-white border border-slate-200/80 rounded-[1.8rem] p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800">Target Skill Gap Roadmap:</span>
                    <span className="text-[11px] font-bold text-indigo-600">4 weeks to job-ready</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold mb-1">
                        <span>React.js</span>
                        <span>Have (85%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%]"></div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-[11px] text-amber-700 font-bold mb-1">
                        <span>PostgreSQL</span>
                        <span>Improve (65%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[65%]"></div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-[11px] text-rose-700 font-bold mb-1">
                        <span>Docker & AWS</span>
                        <span>Learn (35%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full w-[35%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
