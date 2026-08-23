import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Award, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck, Download, Bot } from 'lucide-react';

export const JobReadinessView: React.FC = () => {
  const { resume, setCurrentPage, setIsCopilotOpen } = useApp();
  const { currentUser } = useAuth();

  const report = resume?.jobReadiness;
  const atsScore = resume?.atsAnalysis?.overallScore || 80;

  if (!resume || !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">No Job Readiness Report Generated Yet</h3>
        <p className="text-xs text-slate-400">Upload your resume and complete roadmap milestones to track your score.</p>
        <button
          onClick={() => setCurrentPage('upload')}
          className="px-5 py-2.5 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  const breakdownList = Object.values(report.breakdown || {}) as Array<{
    category: string;
    score: number;
    weight: number;
    recommendation: string;
  }>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Top Header */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Dial Left */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="text-slate-100" strokeWidth="9" stroke="currentColor" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-emerald-500"
                  strokeWidth="9"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - report.overallScore / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-slate-900">{report.overallScore}%</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Job Ready</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {report.status}
                </span>
                <span className="text-xs text-slate-500 font-medium">~{report.estimatedDaysToReady} Days to Full Readiness</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Comprehensive Market Competency Index
              </h2>
              <p className="text-xs text-slate-500 max-w-lg leading-relaxed font-normal">
                Calculated by combining your real-time ATS resume quality, verified portfolio depth, missing skill coverage, and roadmap milestones.
              </p>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setCurrentPage('roadmap')}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Roadmap Milestones</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Practice Technical Mock Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6-Dimension Scorecard Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">6-Dimension Competency Breakdown</h3>
            <p className="text-xs text-slate-500 font-normal">How your score is weighted across all hiring requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {breakdownList.map((item, idx) => (
            <div key={idx} className="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-900">{item.category}</h4>
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.score}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.score}%` }} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.recommendation}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Weight: {item.weight}%</span>
                <span className="font-bold text-slate-700">Status: Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Next Actions Box */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-base text-slate-900">Priority Actions to Reach 90%+ Readiness</h3>
        </div>

        <div className="space-y-3">
          {report.topNextActions.map((action, i) => (
            <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800 font-medium">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs">
                {i + 1}
              </span>
              <span className="leading-relaxed">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Certificate Preview */}
      <div className="p-8 rounded-[2rem] bg-white border-2 border-emerald-400 text-center space-y-4 max-w-xl mx-auto shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto shadow-2xs">
          <Award className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
            Verified Candidate Assessment
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1">CareerFit AI Readiness Certificate</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">Issued to: <strong className="text-slate-900">{currentUser?.name || 'Priyanshu Kumar'}</strong></p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex justify-around">
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold">TARGET ROLE</span>
            <span className="font-bold text-slate-900">{resume.selectedCareer?.roleName || 'Full Stack Developer'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold">READINESS INDEX</span>
            <span className="font-bold text-emerald-600">{report.overallScore}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold">ATS VALIDATION</span>
            <span className="font-bold text-indigo-600">{atsScore}/100</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="text-[11px] text-slate-400 font-medium">ID: CF-CERT-{Date.now().toString().slice(-6)} • Digital Seal Active</span>
        </div>
      </div>
    </div>
  );
};
