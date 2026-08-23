import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, CheckCircle2, AlertTriangle, BookOpen, ArrowRight, Sparkles, Filter, Search, Play } from 'lucide-react';

export const SkillGapAnalysisView: React.FC = () => {
  const { resume, setCurrentPage, setIsCopilotOpen } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const skillGaps = resume?.skillGaps || [];
  const selectedCareer = resume?.selectedCareer;

  const categories = ['all', 'Languages', 'Frameworks', 'Databases', 'Tools', 'Core Concepts'];

  const filtered = skillGaps.filter((item) => {
    const matchesCat = filterCategory === 'all' || item.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.skill.toLowerCase().includes(searchQuery.toLowerCase()) || item.whyNeeded.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const haveCount = skillGaps.filter((s) => s.status === 'have').length;
  const improveCount = skillGaps.filter((s) => s.status === 'improve').length;
  const learnCount = skillGaps.filter((s) => s.status === 'learn').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Top Header */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 uppercase tracking-wider">
              Skill Gap Intelligence
            </span>
            <span className="text-xs text-slate-500 font-medium">Target Role: <strong className="text-slate-900 font-bold">{selectedCareer?.roleName || 'Full Stack Developer'}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Industry Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 max-w-xl">
            Compare your existing resume competencies against active hiring requirements for this role.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('roadmap')}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <span>View 5-Phase Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Status Bento Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          onClick={() => setFilterStatus(filterStatus === 'have' ? 'all' : 'have')}
          className={`p-6 rounded-[2rem] border transition-all cursor-pointer shadow-sm ${
            filterStatus === 'have'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
              : 'bg-white border-slate-200/80 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Skills You Have</span>
            <span className="text-3xl font-black text-emerald-600">{haveCount}</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">Proficient skills recognized by ATS and verified in your project stack.</p>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'improve' ? 'all' : 'improve')}
          className={`p-6 rounded-[2rem] border transition-all cursor-pointer shadow-sm ${
            filterStatus === 'improve'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
              : 'bg-white border-slate-200/80 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Skills to Improve</span>
            <span className="text-3xl font-black text-amber-600">{improveCount}</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">Foundational knowledge present; needs deeper optimization or testing depth.</p>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'learn' ? 'all' : 'learn')}
          className={`p-6 rounded-[2rem] border transition-all cursor-pointer shadow-sm ${
            filterStatus === 'learn'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
              : 'bg-white border-slate-200/80 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Skills You Must Learn</span>
            <span className="text-3xl font-black text-rose-600">{learnCount}</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">Critical modern industry tools missing from resume (e.g. Docker, Redis).</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill gap..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Detailed Skill Gaps Bento Cards */}
      <div className="space-y-4">
        {filtered.map((item, idx) => {
          const isHave = item.status === 'have';
          const isImprove = item.status === 'improve';
          const isLearn = item.status === 'learn';

          return (
            <div
              key={idx}
              className="p-7 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm space-y-4 hover:border-indigo-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        isHave
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isImprove
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.gapLevel} Gap • {item.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.skill}</h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-2xl">
                    ⏱ {item.learningTimeHours} Hours to Master
                  </span>
                </div>
              </div>

              {/* Dual Bar Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Your Current Level</span>
                    <span className="font-bold text-slate-800">{item.currentLevel}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isHave ? 'bg-emerald-500' : isImprove ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${item.currentLevel}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Industry Target Level</span>
                    <span className="font-bold text-indigo-600">{item.requiredLevel}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.requiredLevel}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <p className="text-slate-600 flex-1 leading-relaxed font-normal">
                  <strong className="text-slate-900 font-semibold">Why recruiters check this:</strong> {item.whyNeeded}
                </p>

                {item.recommendedYouTubeQuery && (
                  <button
                    onClick={() => setCurrentPage('resources')}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Watch Curated Tutorial</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
