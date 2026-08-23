import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const { loginAsAdmin, loginDemoAdmin, isLoading } = useAuth();
  const { showToast, setCurrentPage, isAdminAuthModalOpen, closeAdminAuthModal } = useApp();
  const [email, setEmail] = useState('admin@careerfit.ai');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAdminAuthModalOpen;
  const handleClose = propOnClose || closeAdminAuthModal;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await loginAsAdmin(email, password);
      showToast('success', 'Admin Portal Access', 'Logged in to CareerFit AI Admin Command Center.');
      setCurrentPage('admin-dashboard');
      handleClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid admin credentials');
    }
  };

  const handleQuickDemo = async () => {
    try {
      await loginDemoAdmin();
      showToast('success', 'Admin Mode Activated', 'Viewing system analytics and user management.');
      setCurrentPage('admin-dashboard');
      handleClose();
    } catch (err: any) {
      setErrorMessage('Failed to enter admin demo');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-rose-200/80 rounded-[2rem] shadow-xl overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-rose-100 bg-rose-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Administrator Portal</h3>
              <p className="text-xs text-rose-700 font-medium">Management & System Oversight</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-rose-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@careerfit.ai"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Master Passkey</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Admin Demo Login (admin@careerfit.ai)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
