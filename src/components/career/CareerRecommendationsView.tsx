import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, CheckCircle2, AlertCircle, ArrowRight, DollarSign, Building, Clock, Sparkles, Target } from 'lucide-react';

export const CareerRecommendationsView: React.FC = () => {
  const { resume, selectRole, setCurrentPage, isAnalyzing } = useApp();

  const recommendations = resume?.recommendations || [];
  const selectedCareer = resume?.selectedCareer;

  if (!resume || recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">No Career Recommendations Generated Yet</h3>
        <p className="text-xs text-slate-400">Please upload your resume to generate AI-driven career role alignments.</p>
        <button
          onClick={() => setCurrentPage('upload')}
          className="px-5 py-2.5 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Top Header */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 border border-purple-200 text-purple-700 uppercase tracking-wider">
              Gemini AI Career Match
            </span>
            <span className="text-xs text-slate-500 font-medium">Targeting {resume.preferredDomain || 'Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Top Matched Roles for Your Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Select a target role below to immediately generate your 5-phase customized learning roadmap.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('domain')}
          className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 self-start md:self-auto shrink-0 transition-all"
        >
          Explore Other Domains
        </button>
      </div>

      {/* Role Bento Cards List */}
      <div className="space-y-6">
        {recommendations.map((rec) => {
          const isCurrentActive = selectedCareer?.id === rec.id;

          return (
            <div
              key={rec.id}
              className={`p-8 rounded-[2rem] border transition-all shadow-sm ${
                isCurrentActive
                  ? 'bg-white border-2 border-indigo-600 ring-4 ring-indigo-50 shadow-md'
                  : 'bg-white border-slate-200/80 hover:border-indigo-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Role Details Left */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3.5 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-xs">
                      {rec.matchPercentage}% Career Match
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                      {rec.readinessLevel} Readiness
                    </span>
                    {isCurrentActive && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Active Target
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{rec.roleName}</h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-normal">{rec.shortDescription}</p>
                  </div>

                  {/* Why it matches list */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Why Your Background Matches:</p>
                    <div className="space-y-1.5">
                      {rec.whyMatches.map((why, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{why}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill breakdown chips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Existing Skills */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Skills You Already Have ({rec.existingSkills.length}):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.existingSkills.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-xl bg-white text-emerald-800 border border-emerald-200 text-[11px] font-bold shadow-2xs">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                      <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-2">Skills You Need to Close Gap ({rec.missingSkills.length}):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.missingSkills.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-xl bg-white text-rose-800 border border-rose-200 text-[11px] font-bold shadow-2xs">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Stats & Lock CTA */}
                <div className="lg:w-72 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between space-y-5 shrink-0">
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium flex items-center gap-1 mb-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Typical CTC / Salary:
                      </span>
                      <p className="font-extrabold text-slate-900 text-sm">{rec.averageSalaryRange}</p>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium flex items-center gap-1 mb-0.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Est. Preparation:
                      </span>
                      <p className="font-extrabold text-slate-900 text-sm">{rec.estimatedLearningWeeks} Weeks to Job-Ready</p>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium flex items-center gap-1 mb-1.5">
                        <Building className="w-3.5 h-3.5 text-indigo-600" /> Top Hiring Companies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.topCompaniesHiring.map((comp, ci) => (
                          <span key={ci} className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 space-y-2">
                    <button
                      onClick={() => selectRole(rec.id)}
                      className={`w-full py-3 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 ${
                        isCurrentActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <span>{isCurrentActive ? 'Roadmap Active' : 'Target This Career Role'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentPage('skill-gap')}
                      className="w-full py-2 bg-white hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 transition-colors"
                    >
                      Inspect Skill Gap Matrix
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
