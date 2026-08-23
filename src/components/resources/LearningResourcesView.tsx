import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchResourcesApi } from '../../lib/api';
import { LearningResource } from '../../types';
import { INITIAL_LEARNING_RESOURCES } from '../../data/mockDatabase';
import { BookOpen, Youtube, ExternalLink, Star, Clock, Filter, Search, Sparkles } from 'lucide-react';

export const LearningResourcesView: React.FC = () => {
  const { resume } = useApp();
  const [resources, setResources] = useState<LearningResource[]>(INITIAL_LEARNING_RESOURCES);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchResourcesApi();
        if (res.resources && res.resources.length > 0) {
          setResources(res.resources);
        }
      } catch (e) {
        // use initial
      }
    };
    load();
  }, []);

  const filtered = resources.filter((item) => {
    const matchesDiff = selectedDifficulty === 'all' || item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.channelOrAuthor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Top Header */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-700 uppercase tracking-wider">
              Free YouTube Curriculum
            </span>
            <span className="text-xs text-slate-500 font-medium">Zero Paywalls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Curated High-Yield Video Lectures
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Hand-picked tutorials and full crash courses from the world's best tech educators.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {diff === 'all' ? 'All Levels' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by skill or topic (e.g., Docker, React, PostgreSQL)..."
          className="w-full bg-white border border-slate-200/80 shadow-sm rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Video Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-7 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold">
                  <Youtube className="w-3.5 h-3.5" />
                  <span>{item.platform}</span>
                </span>

                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{item.rating || 4.9}</span>
                </div>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{item.channelOrAuthor}</p>

              <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{item.duration}</span>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Watch Video</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
