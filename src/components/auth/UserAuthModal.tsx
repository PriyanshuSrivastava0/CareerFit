import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  validateEmail,
  validateIndianPhone,
  evaluatePasswordStrength,
  validateGradYear
} from '../../lib/validation';
import {
  X,
  Mail,
  Lock,
  Phone,
  User,
  GraduationCap,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

interface UserAuthModalProps {
  isOpen?: boolean;
  initialMode?: 'login' | 'signup' | 'phone' | 'forgot';
  onClose?: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen: propIsOpen,
  initialMode = 'login',
  onClose: propOnClose
}) => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, showToast, setCurrentPage } = useApp();
  const { login, register, loginWithOtp, loginDemoUser, isLoading, currentUser } = useAuth();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAuthModalOpen;
  const onClose = propOnClose || closeAuthModal;

  const [mode, setMode] = useState<'login' | 'signup' | 'phone' | 'forgot'>(authModalMode || initialMode);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupEducation, setSignupEducation] = useState('B.Tech in Computer Science & Engineering');
  const [signupGradYear, setSignupGradYear] = useState('2025');

  // Phone OTP state
  const [phoneInput, setPhoneInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);

  // Password strength calculation
  const passwordStrength = evaluatePasswordStrength(mode === 'signup' ? signupPassword : forgotNewPassword);

  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode]);

  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // Login Handler
  // -------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage(loginMethod === 'email' ? 'Please enter your email.' : 'Please enter your 10-digit phone number.');
      return;
    }

    if (loginMethod === 'email') {
      const check = validateEmail(loginIdentifier);
      if (!check.isValid) {
        setErrorMessage(check.error || 'Invalid email format.');
        return;
      }
    } else {
      const check = validateIndianPhone(loginIdentifier);
      if (!check.isValid) {
        setErrorMessage(check.error || 'Invalid Indian phone number.');
        return;
      }
    }

    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      await login(loginIdentifier, loginPassword);
      showToast('success', 'Welcome Back!', 'Logged in successfully.');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  // -------------------------------------------------------------
  // Signup Handler
  // -------------------------------------------------------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    const emailCheck = validateEmail(signupEmail);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || 'Please enter a valid email address.');
      return;
    }

    const phoneCheck = validateIndianPhone(signupPhone);
    if (!phoneCheck.isValid) {
      setErrorMessage(phoneCheck.error || 'Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (signupPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (passwordStrength.score < 2) {
      setErrorMessage('Please create a stronger password (include numbers and mixed cases).');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    const gradCheck = validateGradYear(signupGradYear);
    if (!gradCheck.isValid) {
      setErrorMessage(gradCheck.error || 'Invalid graduation year.');
      return;
    }

    try {
      await register({
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        password: signupPassword,
        education: signupEducation,
        graduationYear: signupGradYear
      });
      showToast('success', 'Account Created!', 'Welcome to CareerFit AI.');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  // -------------------------------------------------------------
  // Phone OTP Handlers
  // -------------------------------------------------------------
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateIndianPhone(phoneInput);
    if (!check.isValid) {
      setErrorMessage(check.error || 'Please enter a valid 10-digit Indian phone number.');
      return;
    }
    setOtpSent(true);
    setResendTimer(30);
    setErrorMessage('');
    setOtpCode(['1', '2', '3', '4', '5', '6']); // Auto demo OTP
    showToast('info', 'OTP Sent', `Demo OTP sent to ${phoneInput}: 123456`);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit OTP.');
      return;
    }
    try {
      await loginWithOtp({
        phone: phoneInput,
        otpCode: fullCode
      });
      showToast('success', 'Phone Verified', 'Signed in successfully via OTP.');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed. Use demo code: 123456');
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const nextInput = document.getElementById(`modal-otp-input-${Math.min(digits.length, 5)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = value.replace(/\D/g, '');
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`modal-otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // -------------------------------------------------------------
  // Forgot Password Handler
  // -------------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please provide your registered email or phone.');
      return;
    }

    if (!forgotOtpSent) {
      setForgotOtpSent(true);
      showToast('info', 'Code Sent', 'Use demo reset verification code: 123456');
      return;
    }

    if (forgotNewPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      // MOCK BACKEND CALL FOR PROTOTYPE
      await new Promise(resolve => setTimeout(resolve, 800));
      
      showToast('success', 'Password Updated', 'You can now sign in with your new password.');
      setMode('login');
      setLoginIdentifier(forgotIdentifier);
      setForgotOtpSent(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                {mode === 'login' && 'Sign In to CareerFit AI'}
                {mode === 'signup' && 'Create Candidate Account'}
                {mode === 'phone' && 'Phone OTP Authentication'}
                {mode === 'forgot' && 'Reset Master Password'}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {mode === 'login' && 'Access your resume analyses & customized roadmap'}
                {mode === 'signup' && 'Join in 30 seconds for complete ATS scoring'}
                {mode === 'phone' && 'Passwordless instant sign-in with Indian phone'}
                {mode === 'forgot' && 'Recover and update your account password'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =================================================== */}
          {/* 1. LOGIN */}
          {/* =================================================== */}
          {mode === 'login' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setErrorMessage('');
                  }}
                  className={`py-1.5 rounded-xl transition-all ${
                    loginMethod === 'email' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Email + Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('phone');
                    setErrorMessage('');
                  }}
                  className={`py-1.5 rounded-xl transition-all ${
                    loginMethod === 'phone' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Phone + Password
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {loginMethod === 'email' ? 'Email Address' : 'Indian Phone Number'}
                  </label>
                  <div className="relative">
                    {loginMethod === 'email' ? (
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    ) : (
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    )}
                    <input
                      type={loginMethod === 'email' ? 'email' : 'text'}
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={loginMethod === 'email' ? 'candidate@example.com' : '+91 98765 43210'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage('');
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium text-slate-600">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('phone');
                      setErrorMessage('');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Login via OTP →
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Profiles */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Quick Demo Accounts
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loginDemoUser(0);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold"
                  >
                    Priyanshu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginDemoUser(1);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold"
                  >
                    Ananya
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginDemoUser(2);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold"
                  >
                    Rohan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* 2. SIGNUP */}
          {/* =================================================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Priyanshu Kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Indian Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree</label>
                  <select
                    value={signupEducation}
                    onChange={(e) => setSignupEducation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="B.Tech in Computer Science & Engineering">B.Tech CS / IT</option>
                    <option value="BCA / MCA">BCA / MCA</option>
                    <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                    <option value="Non-CS Degree">Other Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                  <select
                    value={signupGradYear}
                    onChange={(e) => setSignupGradYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="2027">2027</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025 (Fresher)</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {signupPassword && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600">Password Strength:</span>
                    <span className={passwordStrength.score >= 3 ? 'text-emerald-600' : 'text-amber-600'}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-slate-200'}`} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* =================================================== */}
          {/* 3. PHONE OTP */}
          {/* =================================================== */}
          {mode === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Indian Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-xs text-slate-600 text-center">
                    Enter code sent to <strong className="text-slate-900">{phoneInput}</strong>
                  </p>

                  <div className="flex justify-center gap-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`modal-otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        className="w-10 h-12 text-center font-black text-base bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Demo: <strong>123456</strong></span>
                    <button
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={handleSendOtp}
                      className="font-bold text-indigo-600 hover:underline disabled:text-slate-400"
                    >
                      {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend Code'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Verify & Continue</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* =================================================== */}
          {/* 4. FORGOT PASSWORD */}
          {/* =================================================== */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email or Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="alex@example.com or +91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {forgotOtpSent && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      New Password (Min 8 chars) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{forgotOtpSent ? 'Save New Password' : 'Send Reset Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer Mode Switcher */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs shrink-0">
          {mode === 'login' && (
            <p className="text-slate-600">
              Need an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className="font-bold text-indigo-600 hover:underline"
              >
                Create Account
              </button>
            </p>
          )}

          {(mode === 'signup' || mode === 'phone' || mode === 'forgot') && (
            <p className="text-slate-600">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className="font-bold text-indigo-600 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
