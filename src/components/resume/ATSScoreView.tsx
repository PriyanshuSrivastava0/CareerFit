import React from 'react';
import { useApp } from '../../context/AppContext';
import { ATSCategoryScore } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  FileEdit,
  Bot,
  Compass,
  Check,
  ShieldCheck,
  Tag
} from 'lucide-react';

export const ATSScoreView: React.FC = () => {
  const { resume, setCurrentPage, setIsCopilotOpen } = useApp();

  if (!resume || !resume.atsAnalysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">No ATS Analysis Found</h3>
        <p className="text-xs text-slate-400">Please upload a resume first to view ATS analysis.</p>
        <button
          onClick={() => setCurrentPage('upload')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  const { overallScore, rating, categoryBreakdown, strengths, improvements, actionableTips, missingCrucialKeywords } =
    resume.atsAnalysis;

  const categories = Object.values(categoryBreakdown || {}) as ATSCategoryScore[];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 border-emerald-200 bg-emerald-50';
    if (score >= 70) return 'text-indigo-700 border-indigo-200 bg-indigo-50';
    return 'text-rose-700 border-rose-200 bg-rose-50';
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-indigo-600';
    return 'bg-rose-500';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Top Banner with ATS Score Radial & Summary */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Overall Radial Score Display */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="text-slate-100" strokeWidth="9" stroke="currentColor" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={overallScore >= 80 ? 'text-emerald-500' : overallScore >= 70 ? 'text-indigo-600' : 'text-rose-500'}
                  strokeWidth="9"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallScore / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-slate-900">{overallScore}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {rating || 'Good Compatibility'}
                </span>
                <span className="text-xs text-slate-500 font-medium">({resume.fileName})</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {overallScore >= 80
                  ? 'Strong Candidate Resume'
                  : overallScore >= 70
                  ? 'Moderate ATS Alignment'
                  : 'Needs Structural Keyword Optimization'}
              </h2>
              <p className="text-xs text-slate-600 max-w-lg leading-relaxed font-normal">
                Your resume scored higher than <strong className="text-emerald-700 font-bold">76% of tech applicant pools</strong>. Applying the suggested keywords and metric quantifications can push your score into the top 5% (92+).
              </p>
            </div>
          </div>

          {/* Right Action Group */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setCurrentPage('recommendations')}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore AI Career Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('extracted')}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <FileEdit className="w-4 h-4 text-amber-600" />
              <span>Edit Parsed Info</span>
            </button>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Ask Copilot to Fix Bullets</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9-Factor Category Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">9-Factor ATS Algorithm Breakdown</h3>
            <p className="text-xs text-slate-500 font-medium">Detailed performance scoring across all screening dimensions</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-xl">Weighted Algorithm v4.2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-900">{cat.name}</h4>
                  <span className={`px-2.5 py-0.5 rounded-xl text-[11px] font-bold border ${getScoreColor(cat.score)}`}>
                    {cat.score} / {cat.maxScore}
                  </span>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div className={`h-full rounded-full ${getBarColor(cat.score)}`} style={{ width: `${cat.score}%` }} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{cat.feedback}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>Weight: {cat.weight}%</span>
                <span className="font-bold text-slate-700">{cat.score >= 80 ? 'Passing' : 'Action Needed'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements Bento Double Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What is Good (Strengths) */}
        <div className="p-7 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">What is Working Well</h3>
          </div>
          <div className="space-y-3">
            {strengths.map((str, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What Needs Improvement */}
        <div className="p-7 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">What Needs Improvement</h3>
          </div>
          <div className="space-y-3">
            {improvements.map((imp, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-slate-800 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{imp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Tips & Missing Crucial Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actionable Tips */}
        <div className="p-7 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Immediate Actionable Tips</h3>
          </div>
          <div className="space-y-2.5">
            {actionableTips.map((tip, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-start gap-2.5 font-medium">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Crucial Keywords */}
        <div className="p-7 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Tag className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Missing Crucial Keywords</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Click to ask Copilot</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Adding these keywords to your project descriptions and skills section will significantly boost recruiter filter passes:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {missingCrucialKeywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => setIsCopilotOpen(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>+ {kw}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
