import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResumeDocument, CareerRecommendation, SkillGapItem, CareerRoadmap, JobReadinessReport } from '../types';
import { useAuth } from './AuthContext';
import {
  getResumeApi,
  uploadResumeApi,
  triggerAnalyzeResume,
  selectCareerDomainApi,
  selectCareerRoleApi,
  toggleRoadmapTaskApi,
  updateTaskNotesApi,
  updateExtractedDataApi,
  deleteResumeApi
} from '../lib/api';
import confetti from 'canvas-confetti';

export type AppPage =
  | 'landing'
  | 'dashboard'
  | 'upload'
  | 'analysis'
  | 'ats'
  | 'extracted'
  | 'domain'
  | 'recommendations'
  | 'skill-gap'
  | 'roadmap'
  | 'resources'
  | 'projects'
  | 'readiness'
  | 'profile'
  | 'auth'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-careers'
  | 'admin-skills'
  | 'admin-resources'
  | 'admin-resumes';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'phone' | 'forgot';
  openAuthModal: (mode?: 'login' | 'signup' | 'phone' | 'forgot') => void;
  closeAuthModal: () => void;
  isAdminAuthModalOpen: boolean;
  openAdminAuthModal: () => void;
  closeAdminAuthModal: () => void;
  resume: ResumeDocument | null;
  isLoadingResume: boolean;
  isAnalyzing: boolean;
  analysisStageIndex: number;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
  uploadAndAnalyzeResume: (payload: { rawText: string; fileName?: string; sampleId?: string; domain?: string }) => Promise<void>;
  reAnalyzeCurrentResume: (preferredDomain?: string) => Promise<void>;
  selectDomain: (domain: string) => Promise<void>;
  selectRole: (careerRoleId: string) => Promise<void>;
  toggleTask: (taskId: string, completed: boolean, notes?: string) => Promise<void>;
  saveTaskNotes: (taskId: string, notes: string) => Promise<void>;
  updateExtractedResumeData: (data: any) => Promise<void>;
  deleteCurrentResume: () => Promise<void>;
  refreshResume: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const ANALYSIS_STAGES = [
  'Extracting resume contact & profile information',
  'Identifying technical, framework & tool skills',
  'Analyzing academic background & coursework',
  'Evaluating practical experience & impact metrics',
  'Assessing project depth, complexity & architecture',
  'Checking ATS algorithm compatibility & keyword density',
  'Comparing candidate profile against live industry requirements',
  'Generating career fit recommendations & personalized roadmaps'
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdminMode } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    if (isAdminMode) return 'admin-dashboard';
    return currentUser ? 'dashboard' : 'landing';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'phone' | 'forgot'>('login');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = (mode: 'login' | 'signup' | 'phone' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openAdminAuthModal = () => {
    setIsAdminAuthModalOpen(true);
  };

  const closeAdminAuthModal = () => {
    setIsAdminAuthModalOpen(false);
  };

  const [resume, setResume] = useState<ResumeDocument | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStageIndex, setAnalysisStageIndex] = useState<number>(0);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync page state when user/admin mode switches
  useEffect(() => {
    if (isAdminMode) {
      setCurrentPage('admin-dashboard');
    } else if (!currentUser && currentPage !== 'landing') {
      setCurrentPage('landing');
    } else if (currentUser && currentPage === 'landing') {
      setCurrentPage('dashboard');
    }
  }, [isAdminMode, currentUser]);

  // Load user resume on mount or user change
  useEffect(() => {
    if (currentUser) {
      refreshResume();
    } else {
      setResume(null);
    }
  }, [currentUser?.id]);

  const refreshResume = async () => {
    if (!currentUser) return;
    setIsLoadingResume(true);
    try {
      const data = await getResumeApi(currentUser.id);
      setResume(data);
    } catch (err) {
      // User might not have uploaded a resume yet
      setResume(null);
    } finally {
      setIsLoadingResume(false);
    }
  };

  const uploadAndAnalyzeResume = async (payload: { rawText: string; fileName?: string; sampleId?: string; domain?: string }) => {
    if (!currentUser) {
      showToast('error', 'Authentication Required', 'Please log in to upload and analyze your resume.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStageIndex(0);
    setCurrentPage('analysis');

    // Multi-stage animated progression timer
    const interval = setInterval(() => {
      setAnalysisStageIndex((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 550);

    try {
      // 1. Upload
      const uploadRes = await uploadResumeApi({
        userId: currentUser.id,
        rawText: payload.rawText,
        fileName: payload.fileName,
        sampleId: payload.sampleId
      });

      // 2. Trigger AI ATS analysis
      const analysisRes = await triggerAnalyzeResume(currentUser.id, payload.domain || currentUser.currentDomain);
      clearInterval(interval);
      setAnalysisStageIndex(ANALYSIS_STAGES.length - 1);

      // Brief delay for stage visual satisfaction
      await new Promise((r) => setTimeout(r, 600));

      setResume(analysisRes.resume);
      setIsAnalyzing(false);

      // Celebrate analysis completion!
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast('success', 'Analysis Complete', `ATS Score: ${analysisRes.resume.atsAnalysis?.overallScore || 80}/100 calculated!`);
      setCurrentPage('ats');
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      showToast('error', 'Analysis Failed', err.message || 'Could not complete resume analysis.');
      setCurrentPage('upload');
    }
  };

  const reAnalyzeCurrentResume = async (preferredDomain?: string) => {
    if (!currentUser || !resume) return;
    setIsAnalyzing(true);
    setAnalysisStageIndex(0);
    setCurrentPage('analysis');

    const interval = setInterval(() => {
      setAnalysisStageIndex((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const res = await triggerAnalyzeResume(currentUser.id, preferredDomain || resume.preferredDomain);
      clearInterval(interval);
      setResume(res.resume);
      setIsAnalyzing(false);
      showToast('success', 'Profile Re-analyzed', 'Your career matches and skill roadmap have been updated.');
      setCurrentPage('recommendations');
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      showToast('error', 'Re-analysis Error', err.message);
    }
  };

  const selectDomain = async (domain: string) => {
    if (!currentUser) return;
    try {
      const res = await selectCareerDomainApi(currentUser.id, domain);
      if (res.resume) {
        setResume(res.resume);
      }
      showToast('info', 'Target Domain Selected', `Updated preference to ${domain}`);
      // Re-analyze for chosen domain
      await reAnalyzeCurrentResume(domain);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const selectRole = async (careerRoleId: string) => {
    if (!currentUser) return;
    try {
      const res = await selectCareerRoleApi(currentUser.id, careerRoleId);
      if (res.resume) {
        setResume(res.resume);
      }
      showToast('success', 'Career Path Locked', `Active roadmap generated for ${res.selectedCareer?.roleName}`);
      setCurrentPage('roadmap');
    } catch (err: any) {
      showToast('error', 'Selection Failed', err.message);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean, notes?: string) => {
    if (!currentUser) return;
    try {
      const res = await toggleRoadmapTaskApi(currentUser.id, taskId, completed, notes);
      if (res.roadmap && resume) {
        setResume({
          ...resume,
          roadmap: res.roadmap,
          jobReadiness: res.jobReadiness || resume.jobReadiness
        });

        if (completed) {
          confetti({
            particleCount: 30,
            spread: 45,
            origin: { y: 0.8 }
          });
          showToast('success', 'Milestone Completed', 'Great job! Your job-readiness score increased.');
        }
      }
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const saveTaskNotes = async (taskId: string, notes: string) => {
    if (!currentUser) return;
    try {
      const res = await updateTaskNotesApi(currentUser.id, taskId, notes);
      if (res.roadmap && resume) {
        setResume({
          ...resume,
          roadmap: res.roadmap
        });
      }
      showToast('info', 'Notes Saved', 'Task study note saved.');
    } catch (err: any) {
      showToast('error', 'Save Failed', err.message);
    }
  };

  const updateExtractedResumeData = async (data: any) => {
    if (!currentUser) return;
    try {
      const res = await updateExtractedDataApi(currentUser.id, data);
      if (res.resume) {
        setResume(res.resume);
      }
      showToast('success', 'Profile Updated', 'Resume data updated successfully.');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const deleteCurrentResume = async () => {
    if (!currentUser) return;
    try {
      await deleteResumeApi(currentUser.id);
      setResume(null);
      showToast('info', 'Resume Removed', 'You can upload a new resume anytime.');
      setCurrentPage('upload');
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isAdminAuthModalOpen,
        openAdminAuthModal,
        closeAdminAuthModal,
        resume,
        isLoadingResume,
        isAnalyzing,
        analysisStageIndex,
        isCopilotOpen,
        setIsCopilotOpen,
        toasts,
        showToast,
        removeToast,
        uploadAndAnalyzeResume,
        reAnalyzeCurrentResume,
        selectDomain,
        selectRole,
        toggleTask,
        saveTaskNotes,
        updateExtractedResumeData,
        deleteCurrentResume,
        refreshResume
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
