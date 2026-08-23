import React from 'react';
import { useApp, ANALYSIS_STAGES } from '../../context/AppContext';
import { Sparkles, CheckCircle2, Loader2, Cpu, ShieldCheck } from 'lucide-react';

export const AnalysisLoadingScreen: React.FC = () => {
  const { analysisStageIndex } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Central Pulsing Icon */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-xl opacity-20 animate-pulse" />
        <div className="relative w-20 h-20 rounded-[2rem] bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-md">
          <Sparkles className="w-10 h-10 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini 3.7 Flash Engine Analyzing Profile</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Deconstructing Your Resume...
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-normal">
          Extracting skills, evaluating project architecture, calculating ATS weights, and matching high-growth career roles.
        </p>
      </div>

      {/* Progress Card with Stages */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 text-left space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 pb-3 border-b border-slate-100">
          <span>Analytical Pipeline</span>
          <span className="text-indigo-600">
            Step {Math.min(analysisStageIndex + 1, ANALYSIS_STAGES.length)} of {ANALYSIS_STAGES.length}
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          {ANALYSIS_STAGES.map((stage, idx) => {
            const isCompleted = idx < analysisStageIndex;
            const isCurrent = idx === analysisStageIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl text-xs transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold shadow-2xs'
                    : isCompleted
                    ? 'text-slate-800 bg-slate-50 font-medium'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-500">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <span className="truncate">{stage}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
