import React from 'react';
import { Cpu, ShieldCheck, Zap, Layers, Sparkles, Youtube, CheckCircle2, Award, Terminal } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Precision ATS Scoring Engine',
      desc: 'Evaluates your resume against 9 core ATS algorithms: Keyword Density, Skills Relevance, Structural Headings, Quantified Impact Metrics, and Project Depth.',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />
    },
    {
      title: 'AI Multi-Role Matcher',
      desc: 'Calculates exact role fit percentage (e.g., 91% Full Stack, 88% Frontend, 80% Backend) with clear justification of why each role matches your background.',
      icon: <Cpu className="w-6 h-6 text-purple-400" />
    },
    {
      title: 'Structured Skill Gap Matrix',
      desc: 'Categorizes skills into "Have", "Improve", and "Must Learn", with targeted time investments (e.g., 14 hours for Docker, 10 hours for PostgreSQL indexing).',
      icon: <Layers className="w-6 h-6 text-emerald-400" />
    },
    {
      title: 'Curated Free Video Library',
      desc: 'Direct links to high-definition, world-class YouTube lectures from freeCodeCamp, Fireship, Traversy Media, and official tech educators with zero subscription costs.',
      icon: <Youtube className="w-6 h-6 text-rose-400" />
    },
    {
      title: 'Interactive 5-Phase Roadmap',
      desc: 'Track completed milestones with interactive task checkboxes, customized study notes, and real-time completion progress tracking.',
      icon: <Terminal className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'CareerFit Copilot AI Assistant',
      desc: 'Ask contextual questions about your exact resume, request mock interview drills, or get suggestions for rewrite bullet points anytime.',
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />
    }
  ];

  return (
    <section id="features" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-200 text-emerald-800 uppercase tracking-wider">
            Built for Modern Job Seekers
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Every Tool You Need to Land Top Tech Offers
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Engineered to bridge the gap between academic education and industry hiring standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="p-8 rounded-[2rem] bg-white border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-md shadow-2xs group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
