import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_CAREER_DOMAINS } from '../../data/mockDatabase';
import { Compass, Sparkles, ArrowRight, CheckCircle2, Search, Zap } from 'lucide-react';

export const CareerDomainPicker: React.FC = () => {
  const { resume, selectDomain, setCurrentPage, reAnalyzeCurrentResume } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  const currentSelected = resume?.preferredDomain || 'Full Stack Development';

  const filteredDomains = INITIAL_CAREER_DOMAINS.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = async (domain: string) => {
    await selectDomain(domain);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomain.trim()) return;
    await selectDomain(customDomain.trim());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-wider">
          Career Domain Alignment
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Which Career Domain Do You Want to Pursue?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Selecting a domain fine-tunes your ATS keyword weights, role recommendations, and learning roadmap.
        </p>
      </div>

      {/* Search & Custom Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search domain (e.g. AI, DevOps, Cybersecurity)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="Enter custom role..."
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Grid of Domains */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDomains.map((domain, idx) => {
          const isSelected = currentSelected === domain;
          return (
            <div
              key={idx}
              onClick={() => handleSelect(domain)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-indigo-400 border border-slate-800'}`}>
                    <Compass className="w-4 h-4" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {domain}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-indigo-300 font-bold' : 'text-slate-400'}>
                  {isSelected ? 'Active Focus' : 'Select Domain'}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:translate-x-1 transition-transform'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
