import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchProjectsApi } from '../../lib/api';
import { RecommendedProject } from '../../types';
import { INITIAL_PROJECT_RECOMMENDATIONS } from '../../data/mockDatabase';
import { FolderGit2, Sparkles, CheckCircle2, ArrowRight, Layers, Cpu, ExternalLink, X, BookOpen } from 'lucide-react';

export const ProjectRecommendationsView: React.FC = () => {
  const { resume } = useApp();
  const [projects, setProjects] = useState<RecommendedProject[]>(INITIAL_PROJECT_RECOMMENDATIONS);
  const [activeProjectModal, setActiveProjectModal] = useState<RecommendedProject | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProjectsApi();
        if (res.projects && res.projects.length > 0) {
          setProjects(res.projects);
        }
      } catch (e) {
        // fallback to initial
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 border border-purple-200 text-purple-700 uppercase tracking-wider">
              Resume Flagship Projects
            </span>
            <span className="text-xs text-slate-500 font-medium">Production Blueprints</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Recommended Capstone Portfolio Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Build and deploy these full-stack applications to prove hands-on architecture competency to tech recruiters.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm hover:border-purple-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                  {proj.difficulty} Level
                </span>
                <span className="text-xs text-slate-500 font-medium">⏱ {proj.estimatedHours} Hours</span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3 font-normal">
                {proj.description}
              </p>

              {/* Tech Stack Chips */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-600">Tech Stack:</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveProjectModal(proj)}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View Architecture Blueprint</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blueprint Detail Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 uppercase">
                  {activeProjectModal.difficulty} Blueprint
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{activeProjectModal.title}</h3>
              </div>
              <button onClick={() => setActiveProjectModal(null)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Project Overview:</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{activeProjectModal.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeProjectModal.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Key Competencies Gained:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeProjectModal.skillsGained.map((sk, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{sk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Step-by-Step Architecture Guide:</h4>
                <div className="space-y-2">
                  {(activeProjectModal.architectureSteps || []).map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
