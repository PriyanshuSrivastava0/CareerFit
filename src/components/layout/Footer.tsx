import React from 'react';
import { Sparkles, Heart, Shield, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-tight">CareerFit AI</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              The AI Career Operating System. Transforming raw resumes into actionable career paths, skill gap bridges, and personalized learning roadmaps.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-3">Core Modules</h4>
            <ul className="space-y-2 font-medium">
              <li>ATS Score Optimization</li>
              <li>AI Career Matching Engine</li>
              <li>Skill Gap Visualizer</li>
              <li>Personalized 5-Phase Roadmaps</li>
              <li>Job Readiness Scoring</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-3">Resources</h4>
            <ul className="space-y-2 font-medium">
              <li>Curated Video Lectures</li>
              <li>Full Stack Project Blueprints</li>
              <li>Technical Interview Question Bank</li>
              <li>Resume Optimization Rules</li>
              <li>CareerFit Copilot AI</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-3">Platform Status</h4>
            <div className="space-y-2.5 font-medium">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Gemini 3.7 Flash Engine Online</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Enterprise ATS Algorithm v4.2</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sub-500ms Parsing Latency</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} CareerFit AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Security</span>
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for tech talent
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
