import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Auth Modals & Page
import { UserAuthModal } from './components/auth/UserAuthModal';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { AuthPage } from './components/auth/AuthPage';

// Landing Sections
import { LandingHero } from './components/landing/LandingHero';
import { HowItWorks } from './components/landing/HowItWorks';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { PricingSection } from './components/landing/PricingSection';

// User & Resume Screens
import { UserDashboard } from './components/user/UserDashboard';
import { ResumeUploadView } from './components/resume/ResumeUploadView';
import { AnalysisLoadingScreen } from './components/resume/AnalysisLoadingScreen';
import { ATSScoreView } from './components/resume/ATSScoreView';
import { ExtractedResumeEditor } from './components/resume/ExtractedResumeEditor';
import { CareerDomainPicker } from './components/career/CareerDomainPicker';
import { CareerRecommendationsView } from './components/career/CareerRecommendationsView';
import { SkillGapAnalysisView } from './components/skills/SkillGapAnalysisView';
import { PersonalizedRoadmapView } from './components/roadmap/PersonalizedRoadmapView';
import { LearningResourcesView } from './components/resources/LearningResourcesView';
import { ProjectRecommendationsView } from './components/projects/ProjectRecommendationsView';
import { JobReadinessView } from './components/readiness/JobReadinessView';

// Admin Screen
import { AdminDashboard } from './components/admin/AdminDashboard';

// Copilot
import { CareerFitCopilot } from './components/copilot/CareerFitCopilot';
import { Bot, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, isAnalyzing, isCopilotOpen, setIsCopilotOpen } = useApp();
  const { adminUser } = useAuth();

  const renderMainContent = () => {
    // While resume parsing pipeline is executing
    if (isAnalyzing) {
      return <AnalysisLoadingScreen />;
    }

    if (adminUser || currentPage === 'admin-dashboard' || currentPage.startsWith('admin-')) {
      return <AdminDashboard />;
    }

    switch (currentPage) {
      case 'landing':
        return (
          <>
            <LandingHero />
            <HowItWorks />
            <FeaturesSection />
            <PricingSection />
          </>
        );
      case 'auth':
        return <AuthPage />;
      case 'profile':
        return <ExtractedResumeEditor />;
      case 'dashboard':
        return <UserDashboard />;
      case 'upload':
        return <ResumeUploadView />;
      case 'ats':
        return <ATSScoreView />;
      case 'extracted':
        return <ExtractedResumeEditor />;
      case 'domain':
        return <CareerDomainPicker />;
      case 'recommendations':
        return <CareerRecommendationsView />;
      case 'skill-gap':
        return <SkillGapAnalysisView />;
      case 'roadmap':
        return <PersonalizedRoadmapView />;
      case 'resources':
        return <LearningResourcesView />;
      case 'projects':
        return <ProjectRecommendationsView />;
      case 'readiness':
        return <JobReadinessView />;
      default:
        return <LandingHero />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-slate-900 selection:bg-indigo-600 selection:text-white font-sans antialiased">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1">{renderMainContent()}</main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <UserAuthModal />
      <AdminLoginModal />

      {/* Copilot Drawer */}
      <CareerFitCopilot />

      {/* Floating Copilot Trigger Button (visible when Copilot is closed) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl shadow-slate-900/20 transition-all transform hover:scale-105 flex items-center gap-2.5 border border-slate-800 group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>Ask CareerFit Copilot</span>
        </button>
      )}

      {/* Toast Notification Stream */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
