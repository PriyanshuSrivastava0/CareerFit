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
  EyeOff,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  Bot,
  ArrowLeft
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, loginWithOtp, loginDemoUser, isLoading, currentUser } = useAuth();
  const { setCurrentPage, showToast } = useApp();

  // Auth Modes: 'login' | 'signup' | 'phone' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'phone' | 'forgot'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  // Common UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // 1. Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // 2. Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupEducation, setSignupEducation] = useState('B.Tech in Computer Science & Engineering');
  const [signupGradYear, setSignupGradYear] = useState('2025');

  // 3. Phone OTP State
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // 4. Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  // Password Strength live evaluation
  const passwordStrength = evaluatePasswordStrength(authMode === 'signup' ? signupPassword : forgotNewPassword);

  // Timer for OTP countdown
  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      setCurrentPage('dashboard');
    }
  }, [currentUser]);

  const markTouched = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  // -------------------------------------------------------------
  // 1. Handle Login (Email / Phone + Password)
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage(loginMethod === 'email' ? 'Please enter your email address.' : 'Please enter your 10-digit phone number.');
      return;
    }

    if (loginMethod === 'email') {
      const emailCheck = validateEmail(loginIdentifier);
      if (!emailCheck.isValid) {
        setErrorMessage(emailCheck.error || 'Invalid email format.');
        return;
      }
    } else {
      const phoneCheck = validateIndianPhone(loginIdentifier);
      if (!phoneCheck.isValid) {
        setErrorMessage(phoneCheck.error || 'Invalid Indian phone number.');
        return;
      }
    }

    if (!loginPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    try {
      await login(loginIdentifier, loginPassword);
      setSuccessMessage('Login successful! Redirecting to candidate dashboard...');
      showToast('success', 'Welcome Back!', 'Logged in successfully.');
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify your email/phone and password.');
    }
  };

  // -------------------------------------------------------------
  // 2. Handle Create Account (Signup)
  // -------------------------------------------------------------
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!signupName.trim() || signupName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
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
      setErrorMessage('Please choose a stronger password containing uppercase, lowercase, numbers, and special characters.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both password fields are identical.');
      return;
    }

    if (!signupEducation.trim()) {
      setErrorMessage('Please select or specify your educational degree.');
      return;
    }

    const yearCheck = validateGradYear(signupGradYear);
    if (!yearCheck.isValid) {
      setErrorMessage(yearCheck.error || 'Please enter a valid graduation year.');
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

      setSuccessMessage('Account created successfully! Welcome to CareerFit AI.');
      showToast('success', 'Registration Complete', 'Your account has been created.');
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account. Email may already be in use.');
    }
  };

  // -------------------------------------------------------------
  // 3. Handle Phone OTP Flow
  // -------------------------------------------------------------
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const phoneCheck = validateIndianPhone(otpPhone);
    if (!phoneCheck.isValid) {
      setErrorMessage(phoneCheck.error || 'Please enter a valid 10-digit Indian phone number.');
      return;
    }

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsOtpSent(true);
      setResendTimer(30);
      setOtpCode(['1', '2', '3', '4', '5', '6']); // Auto-fill 123456 for easy demo testing
      setSuccessMessage(`OTP sent to ${otpPhone}. Use demo code: 123456`);
      showToast('info', 'OTP Sent', `Verification code sent to ${otpPhone}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit OTP code.');
      return;
    }

    try {
      await loginWithOtp({
        phone: otpPhone,
        otpCode: fullCode
      });
      setSuccessMessage('Phone verified! Signing into candidate dashboard...');
      showToast('success', 'OTP Verified', 'Logged in successfully.');
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired OTP code. Use demo code: 123456');
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const nextInput = document.getElementById(`otp-input-${Math.min(digits.length, 5)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = value.replace(/\D/g, '');
    setOtpCode(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // -------------------------------------------------------------
  // 4. Handle Forgot Password Reset Flow
  // -------------------------------------------------------------
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please provide your registered email or phone number.');
      return;
    }

    if (!forgotOtpSent) {
      // Step 1: Send reset code
      setForgotOtpSent(true);
      setForgotOtpCode('123456');
      setSuccessMessage('Reset verification code generated! (Demo code: 123456)');
      return;
    }

    // Step 2: Update password
    if (forgotOtpCode !== '123456' && forgotOtpCode.length < 4) {
      setErrorMessage('Invalid verification code. Please enter 123456');
      return;
    }

    if (forgotNewPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier, newPassword: forgotNewPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMessage('Password reset successfully! You can now log in with your new credentials.');
      showToast('success', 'Password Reset', 'Password updated successfully. Please log in.');
      setTimeout(() => {
        setAuthMode('login');
        setLoginIdentifier(forgotIdentifier);
        setForgotOtpSent(false);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#FAF8F3]">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Value Proposition Bento Showcase */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-indigo-900/30 blur-2xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-indigo-600 flex items-center justify-center font-black shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight">CareerFit AI</span>
            </div>

            <div className="space-y-2 pt-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                AI Career Intelligence
              </span>
              <h2 className="text-2xl font-black leading-tight">
                Turn your resume into high-impact job readiness.
              </h2>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Join thousands of engineering candidates optimizing their ATS screening scores and landing tech interviews faster.
              </p>
            </div>
          </div>

          {/* Middle Bento Metric Tiles */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">9-Factor ATS Algorithm</p>
                <p className="text-[11px] text-indigo-100">Deep keyword density & impact metrics</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">Customized 5-Phase Roadmaps</p>
                <p className="text-[11px] text-indigo-100">Targeted milestones with verified YouTube tutorials</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">CareerFit Copilot AI</p>
                <p className="text-[11px] text-indigo-100">24/7 technical interview coach & bullet rewriter</p>
              </div>
            </div>
          </div>

          {/* Bottom Candidate Testimonial */}
          <div className="relative z-10 p-4 rounded-2xl bg-indigo-900/40 border border-indigo-400/20 text-xs">
            <p className="italic text-indigo-100 leading-relaxed">
              "CareerFit AI increased my resume score from 58 to 91 and highlighted the exact microservices project I needed."
            </p>
            <div className="mt-2.5 flex items-center gap-2 font-bold text-white text-[11px]">
              <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center text-[10px]">✓</span>
              <span>Priyanshu Kumar • Software Engineer</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Auth Form Card */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl flex flex-col justify-between">
          
          <div>
            {/* Top Navigation & Mode Switcher */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {authMode === 'login' && 'Sign In to Your Account'}
                  {authMode === 'signup' && 'Create Candidate Account'}
                  {authMode === 'phone' && 'Phone OTP Sign In'}
                  {authMode === 'forgot' && 'Reset Your Password'}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {authMode === 'login' && 'Enter your credentials to access your roadmaps & ATS scores'}
                  {authMode === 'signup' && 'Join in 30 seconds to analyze and benchmark your tech profile'}
                  {authMode === 'phone' && 'Instant passwordless authentication with Indian phone number'}
                  {authMode === 'forgot' && 'Enter your registered email or phone to reset your master key'}
                </p>
              </div>

              <button
                onClick={() => setCurrentPage('landing')}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Return to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Error & Success Alert Banners */}
            {errorMessage && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ======================================================= */}
            {/* MODE 1: LOGIN (EMAIL OR PHONE + PASSWORD) */}
            {/* ======================================================= */}
            {authMode === 'login' && (
              <div className="space-y-5">
                {/* Switcher between Email and Phone Login */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('email');
                      setErrorMessage('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      loginMethod === 'email' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email + Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('phone');
                      setErrorMessage('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      loginMethod === 'phone' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone + Password</span>
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Identifier Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {loginMethod === 'email' ? 'Email Address' : 'Indian Phone Number'} <span className="text-rose-500">*</span>
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setErrorMessage('');
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
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

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-medium text-slate-600">Remember me on this device</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('phone');
                        setErrorMessage('');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Login via OTP →
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Demo Logins */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                    Instant Demo Test Profiles
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => loginDemoUser(0)}
                      className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Priyanshu (Fresher)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => loginDemoUser(1)}
                      className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ananya (Data)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => loginDemoUser(2)}
                      className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Rohan (Cyber)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* MODE 2: SIGNUP (CREATE ACCOUNT) */}
            {/* ======================================================= */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="priyanshu@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Phone Number (Indian) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number (Indian) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Educational Degree <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={signupEducation}
                        onChange={(e) => setSignupEducation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      >
                        <option value="B.Tech in Computer Science & Engineering">B.Tech / BE Computer Science</option>
                        <option value="B.Tech in Information Technology">B.Tech / BE Information Technology</option>
                        <option value="BCA / MCA">BCA / MCA</option>
                        <option value="B.Sc in Computer Science">B.Sc Computer Science / IT</option>
                        <option value="M.Tech in Computer Science">M.Tech / MS in CS</option>
                        <option value="Non-CS Engineering Graduate">Other Engineering Discipline</option>
                        <option value="Self-Taught Developer">Self-Taught / Bootcamp Graduate</option>
                      </select>
                    </div>
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Graduation Year <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={signupGradYear}
                        onChange={(e) => setSignupGradYear(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      >
                        <option value="2027">2027 (Future Grad)</option>
                        <option value="2026">2026 (Pre-final Year)</option>
                        <option value="2025">2025 (Final Year / Fresher)</option>
                        <option value="2024">2024 (Recent Graduate)</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022 or Earlier</option>
                      </select>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 8 characters"
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Password Strength Meter & Checklist */}
                {signupPassword && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Password Strength:</span>
                      <span className={passwordStrength.score >= 3 ? 'text-emerald-600' : passwordStrength.score === 2 ? 'text-amber-500' : 'text-rose-500'}>
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-slate-200'}`} />
                    </div>

                    {/* Checklist */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-500 pt-1">
                      <div className={`flex items-center gap-1.5 ${passwordStrength.hasMinLength ? 'text-emerald-600 font-bold' : ''}`}>
                        <span>{passwordStrength.hasMinLength ? '✓' : '•'}</span>
                        <span>8+ Characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.hasUppercase && passwordStrength.hasLowercase ? 'text-emerald-600 font-bold' : ''}`}>
                        <span>{passwordStrength.hasUppercase && passwordStrength.hasLowercase ? '✓' : '•'}</span>
                        <span>Upper & Lowercase</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.hasNumber ? 'text-emerald-600 font-bold' : ''}`}>
                        <span>{passwordStrength.hasNumber ? '✓' : '•'}</span>
                        <span>Number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.hasSpecialChar ? 'text-emerald-600 font-bold' : ''}`}>
                        <span>{passwordStrength.hasSpecialChar ? '✓' : '•'}</span>
                        <span>Special Symbol</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Candidate Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account & Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ======================================================= */}
            {/* MODE 3: PHONE OTP AUTHENTICATION */}
            {/* ======================================================= */}
            {authMode === 'phone' && (
              <div className="space-y-5">
                {!isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Indian Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">We will send a 6-digit one-time password to verify.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-slate-600">
                        Enter the 6-digit verification code sent to <strong className="text-slate-900">{otpPhone}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsOtpSent(false)}
                        className="text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        Change phone number
                      </button>
                    </div>

                    {/* 6-Digit Code Inputs */}
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && idx > 0) {
                              const prev = document.getElementById(`otp-input-${idx - 1}`);
                              if (prev) prev.focus();
                            }
                          }}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center font-black text-lg bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Demo Code: <strong>123456</strong></span>
                      <button
                        type="button"
                        disabled={resendTimer > 0}
                        onClick={handleSendOtp}
                        className="font-bold text-indigo-600 hover:underline disabled:text-slate-400 disabled:no-underline"
                      >
                        {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Access Dashboard</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ======================================================= */}
            {/* MODE 4: FORGOT PASSWORD */}
            {/* ======================================================= */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Registered Email or Phone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="alex@example.com or +91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                {forgotOtpSent && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Verification Code (Demo: 123456) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={forgotOtpCode}
                        onChange={(e) => setForgotOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        New Master Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="Min 8 characters"
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

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Confirm New Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{forgotOtpSent ? 'Update Password & Log In' : 'Send Verification Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Bottom Switch Mode Bar */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center">
            {authMode === 'login' && (
              <p className="text-xs text-slate-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Create free account →
                </button>
              </p>
            )}

            {(authMode === 'signup' || authMode === 'phone' || authMode === 'forgot') && (
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Sign in here →
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
