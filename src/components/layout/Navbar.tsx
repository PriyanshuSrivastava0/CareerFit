import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp, AppPage } from '../../context/AppContext';
import {
  Compass,
  FileText,
  CheckCircle2,
  Sparkles,
  BarChart3,
  MapPin,
  BookOpen,
  FolderGit2,
  Bot,
  ShieldAlert,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Target,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onOpenAdminAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenAdminAuth }) => {
  const { currentUser, adminUser, isAdminMode, logout, logoutAdmin, setIsAdminMode, loginDemoUser } = useAuth();
  const {
    currentPage,
    setCurrentPage,
    resume,
    isCopilotOpen,
    setIsCopilotOpen,
    openAuthModal,
    openAdminAuthModal
  } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      openAuthModal(mode);
    }
  };

  const handleOpenAdmin = () => {
    if (onOpenAdminAuth) {
      onOpenAdminAuth();
    } else {
      openAdminAuthModal();
    }
  };

  const navLinks: { id: AppPage; label: string; icon: React.ReactNode; requiresResume?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload Resume', icon: <FileText className="w-4 h-4" /> },
    { id: 'ats', label: 'ATS Score', icon: <CheckCircle2 className="w-4 h-4" />, requiresResume: true },
    { id: 'recommendations', label: 'Career Fit', icon: <Compass className="w-4 h-4" />, requiresResume: true },
    { id: 'skill-gap', label: 'Skill Gap', icon: <Target className="w-4 h-4" />, requiresResume: true },
    { id: 'roadmap', label: 'Roadmap', icon: <MapPin className="w-4 h-4" />, requiresResume: true },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'readiness', label: 'Job Readiness', icon: <Sparkles className="w-4 h-4" />, requiresResume: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage(isAdminMode ? 'admin-dashboard' : currentUser ? 'dashboard' : 'landing')}>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  CareerFit AI
                </span>
                {isAdminMode && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700 rounded-full tracking-wide uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">AI Career & Resume Intelligence</p>
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          {!isAdminMode && currentUser && (
            <nav className="hidden xl:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                const hasAtsBadge = link.id === 'ats' && resume?.atsAnalysis;
                return (
                  <button
                    key={link.id}
                    onClick={() => setCurrentPage(link.id)}
                    className={`flex items-center whitespace-nowrap gap-1 px-2 2xl:px-3 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {hasAtsBadge && (
                      <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-100 text-emerald-700 font-bold">
                        {resume.atsAnalysis?.overallScore}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {!isAdminMode && !currentUser && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <button onClick={() => setCurrentPage('landing')} className="hover:text-indigo-600 transition-colors">
                Product
              </button>
              <button
                onClick={() => {
                  setCurrentPage('landing');
                  setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  setCurrentPage('landing');
                  setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => {
                  setCurrentPage('landing');
                  setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                Pricing
              </button>
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* CareerFit Copilot Trigger */}
            <button
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${
                isCopilotOpen
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200 text-indigo-700'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Copilot AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Admin Switcher or Auth state */}
            {isAdminMode ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold"
                >
                  Exit Admin
                </button>
                <button
                  onClick={logoutAdmin}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : currentUser ? (
              /* Logged In User Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[110px]">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[110px]">{currentUser.currentDomain || 'Fresher'}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-xs">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-2xl mb-1">
                      <p className="font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {currentUser.experienceLevel || 'Fresher'}
                        </span>
                        <span className="text-slate-500">Class of {currentUser.graduationYear}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage('profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      <span>Profile & Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        loginDemoUser(1); // Switch to Ananya (Data Science)
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-amber-700 hover:bg-amber-50 font-medium transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Switch: Data Science Demo</span>
                    </button>

                    <button
                      onClick={() => {
                        loginDemoUser(2); // Switch to Rohan (Cybersecurity)
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-medium transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-emerald-500" />
                      <span>Switch: Cybersecurity Demo</span>
                    </button>

                    <div className="my-1 border-t border-slate-100"></div>

                    <button
                      onClick={() => {
                        handleOpenAdmin();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-medium transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span>Admin Portal Login</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        setCurrentPage('landing');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out Buttons */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-2xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleOpenAdmin}
                  className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-2xl border border-slate-200"
                  title="Admin Access"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Admin</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {currentUser &&
            navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold ${
                  currentPage === link.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.id === 'ats' && resume?.atsAnalysis && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 font-bold">
                    {resume.atsAnalysis.overallScore}/100
                  </span>
                )}
              </button>
            ))}

          {!currentUser && (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  handleOpenAuth('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 bg-slate-100 rounded-2xl"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  handleOpenAuth('signup');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-indigo-600 rounded-2xl"
              >
                Create Free Account
              </button>
              <button
                onClick={() => {
                  handleOpenAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl"
              >
                Admin Login
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
