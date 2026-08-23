import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  CheckCircle2,
  Circle,
  FileText,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Edit3,
  X,
  Save,
  Award
} from 'lucide-react';

export const PersonalizedRoadmapView: React.FC = () => {
  const { resume, toggleTask, saveTaskNotes, setCurrentPage } = useApp();

  const roadmap = resume?.roadmap;
  const [activeNotesTaskId, setActiveNotesTaskId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');

  if (!resume || !roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">No Roadmap Generated Yet</h3>
        <p className="text-xs text-slate-400">Upload your resume and select a target career path to unlock your custom roadmap.</p>
        <button
          onClick={() => setCurrentPage('upload')}
          className="px-5 py-2.5 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  const handleOpenNotes = (taskId: string, currentNotes?: string) => {
    setActiveNotesTaskId(taskId);
    setNotesDraft(currentNotes || '');
  };

  const handleSaveNotes = async () => {
    if (activeNotesTaskId) {
      await saveTaskNotes(activeNotesTaskId, notesDraft);
      setActiveNotesTaskId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Bento Top Header */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 uppercase tracking-wider">
                Personalized Learning Roadmap
              </span>
              <span className="text-xs text-slate-500 font-medium">Target Role: <strong className="text-slate-900 font-bold">{roadmap.careerRoleName}</strong></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              5-Phase Actionable Career Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed font-normal">
              Complete each milestone to bridge missing skills, build industry capstone projects, and pass technical interviews.
            </p>
          </div>

          {/* Progress Dial Widget */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-500 block font-semibold">Roadmap Progress</span>
              <span className="text-2xl font-black text-indigo-700">{roadmap.overallProgress}%</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${roadmap.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Structured Phases List */}
      <div className="space-y-6">
        {roadmap.phases.map((phase) => {
          const completedTasksCount = phase.tasks.filter((t) => t.completed).length;
          const phaseProgress = Math.round((completedTasksCount / phase.tasks.length) * 100);
          const isPhaseDone = phaseProgress === 100;

          return (
            <div
              key={phase.id}
              className={`rounded-[2rem] border transition-all overflow-hidden shadow-sm ${
                isPhaseDone
                  ? 'bg-white border-emerald-300 ring-2 ring-emerald-50'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              {/* Phase Header */}
              <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                      Phase {phase.phaseNumber} • {phase.durationText}
                    </span>
                    {isPhaseDone && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">{phase.title}</h3>
                  <p className="text-xs text-slate-500 font-normal">{phase.description}</p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-xs font-bold text-slate-700">
                    {completedTasksCount}/{phase.tasks.length} Completed
                  </span>
                  <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${phaseProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-6 space-y-3.5">
                {phase.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                      task.completed
                        ? 'bg-emerald-50/30 border-emerald-200 text-slate-700'
                        : 'bg-slate-50/50 border-slate-200/70 text-slate-900 hover:border-indigo-300 hover:bg-white'
                    }`}
                  >
                    {/* Checkbox & Details */}
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id, !task.completed)}
                        className={`mt-0.5 p-1 rounded-lg transition-colors ${
                          task.completed
                            ? 'text-emerald-600 bg-emerald-100'
                            : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>

                      <div className="space-y-1">
                        <h4 className={`text-xs sm:text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">{task.description}</p>

                        {/* Task Notes (if saved) */}
                        {task.notes && (
                          <div className="mt-2 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2 font-medium">
                            <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span className="italic">"{task.notes}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side tools */}
                    <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                      {task.durationDays && (
                        <span className="text-[10px] text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold shadow-2xs">
                          ~{task.durationDays} days
                        </span>
                      )}

                      {task.resourceLinks && task.resourceLinks.length > 0 && (
                        <a
                          href={task.resourceLinks[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs transition-colors flex items-center gap-1 shadow-2xs"
                          title="Open YouTube Resource"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenNotes(task.id, task.notes)}
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-2xs"
                        title="Add/Edit Study Notes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note-Taking Modal */}
      {activeNotesTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[2rem] shadow-2xl p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Add Task Study Notes & Reflection</span>
              </h3>
              <button onClick={() => setActiveNotesTaskId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="e.g. Mastered Event Loop task queue order; completed 5 coding challenges on Promise.allSettled..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setActiveNotesTaskId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
