import React from 'react';
import { Upload, CheckCircle, Compass, Target, MapPin, Youtube, Bot, Award, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const HowItWorks: React.FC = () => {
  const { setCurrentPage } = useApp();
  const { currentUser, loginDemoUser } = useAuth();

  const steps = [
    {
      number: '01',
      title: 'Upload Your Resume',
      desc: 'Drag & drop your PDF, DOCX, or paste text. Our intelligent parser parses contact, education, skills, projects, and work experience in seconds.',
      icon: <Upload className="w-5 h-5 text-indigo-400" />
    },
    {
      number: '02',
      title: 'ATS Score & Keyword Audit',
      desc: 'Get an authentic ATS score breakdown out of 100 with 9 critical dimensions, pinpointing missing high-impact keywords and format flaws.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />
    },
    {
      number: '03',
      title: 'Pick or Discover Career Domain',
      desc: 'Select from 15+ modern domains (Full Stack, Data Science, AI/ML, Cloud, Cybersecurity) or let Gemini recommend your best match.',
      icon: <Compass className="w-5 h-5 text-purple-400" />
    },
    {
      number: '04',
      title: 'Deep Skill Gap Matrix',
      desc: 'See exactly which industry skills you have, which need polish, and which critical tools you must learn to qualify for top job offers.',
      icon: <Target className="w-5 h-5 text-rose-400" />
    },
    {
      number: '05',
      title: 'Personalized 5-Phase Roadmap',
      desc: 'An actionable week-by-week step plan covering core fundamentals, advanced frameworks, production databases, and capstone deployment.',
      icon: <MapPin className="w-5 h-5 text-amber-400" />
    },
    {
      number: '06',
      title: 'Curated YouTube & Projects',
      desc: 'No expensive paywalled courses. Access top-rated free YouTube lectures, GitHub repos, and step-by-step project blueprints.',
      icon: <Youtube className="w-5 h-5 text-red-400" />
    },
    {
      number: '07',
      title: 'CareerFit Copilot AI',
      desc: 'Ask contextual questions: "How do I rewrite this project bullet for ATS?", "Run a mock React technical interview", or "Plan my study hours".',
      icon: <Bot className="w-5 h-5 text-cyan-400" />
    },
    {
      number: '08',
      title: 'Live Job Readiness Score',
      desc: 'Track completed roadmap milestones and watch your job-readiness dial climb from 60% to 90%+ with verifiable skill confidence.',
      icon: <Award className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <section id="how-it-works" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 border border-indigo-200 text-indigo-800 uppercase tracking-wider">
            Seamless End-to-End Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How CareerFit AI Powers Your Job Readiness
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            A comprehensive, connected journey that turns raw credentials into high-paying engineering offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative p-6 rounded-[2rem] bg-white border border-slate-200/80 hover:border-indigo-300 transition-all group hover:-translate-y-1 shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-xl font-mono font-black text-slate-300 group-hover:text-indigo-600 transition-colors">
                  {step.number}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            onClick={() => {
              if (!currentUser) loginDemoUser(0);
              setCurrentPage('upload');
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <span>Experience The Workflow Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
