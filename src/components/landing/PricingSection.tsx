import React from 'react';
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const PricingSection: React.FC = () => {
  const { setCurrentPage } = useApp();
  const { currentUser, loginDemoUser } = useAuth();

  const plans = [
    {
      name: 'Candidate Free',
      badge: 'Current Tier',
      price: '₹0',
      period: 'Forever free',
      desc: 'Everything you need to analyze your resume, see ATS scores, and follow standard roadmaps.',
      features: [
        'Full 9-Category ATS Resume Analysis',
        'Top 3 AI Career Role Recommendations',
        'Core Skill Gap Breakdown (Have / Improve / Learn)',
        'Full 5-Phase Interactive Learning Roadmap',
        'Curated YouTube Video Library',
        'Basic CareerFit Copilot AI (10 queries/day)'
      ],
      cta: 'Start Free Today',
      popular: false
    },
    {
      name: 'Career Pro',
      badge: 'Most Popular',
      price: '₹499',
      period: 'per month',
      desc: 'Advanced recruiter simulation, unlimited resume revisions, and live mock interview drills.',
      features: [
        'Everything in Candidate Free',
        'Unlimited Resume Uploads & ATS Iterations',
        'Real-time Resume Bullet Rewrite with Gemini 3.7',
        'Interactive Technical Mock Interviews with Copilot',
        'GitHub Portfolio Architecture Reviews',
        'Exportable PDF Career Roadmap & Verification Badge',
        'Priority Copilot AI Responses'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Campus / Enterprise',
      badge: 'For Universities',
      price: 'Custom',
      period: 'per department',
      desc: 'Complete placement intelligence platform for colleges, universities, and bootcamp cohorts.',
      features: [
        'Everything in Career Pro',
        'Admin Cohort Analytics & ATS Leaderboards',
        'Custom Campus Placement Skill Taxonomies',
        'Bulk Resume Uploads & Batch Scoring',
        'Placement Officer Audit Dashboard',
        'Dedicated SLA & Custom SSO'
      ],
      cta: 'Request Campus Demo',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 border border-purple-200 text-purple-800 uppercase tracking-wider">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Invest in Your Tech Career Trajectory
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Start completely free. Upgrade when you need unlimited deep AI coaching and mock interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-[2.5rem] p-8 flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-indigo-50/70 border-2 border-indigo-600 shadow-md shadow-indigo-600/10'
                  : 'bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow-2xs">
                  Recommended For Job Seekers
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                  <span className="text-xs font-bold text-indigo-700 px-2.5 py-0.5 rounded-full bg-indigo-100 border border-indigo-200">
                    {plan.badge}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium ml-1.5">/ {plan.period}</span>
                </div>

                <p className="text-xs text-slate-600 mb-6 leading-relaxed font-normal">{plan.desc}</p>

                <div className="space-y-3 mb-8 pt-4 border-t border-slate-200/80">
                  {plan.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!currentUser) loginDemoUser(0);
                  setCurrentPage('upload');
                }}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
