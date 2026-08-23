// Frontend validation helpers for CareerFit AI

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address (e.g., alex@domain.com).' };
  }
  return { isValid: true };
}

export function validateIndianPhone(phone: string): { isValid: boolean; error?: string; formatted?: string } {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required.' };
  }
  
  // Clean phone input
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Indian phone number regex: starts with 6-9 and has 10 digits, optionally prefixed with +91 or 91 or 0
  const indianPhoneRegex = /^(?:\+?91|0)?[6-9]\d{9}$/;
  
  if (!indianPhoneRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.'
    };
  }
  
  // Extract the standard 10 digit number
  const standard10 = cleaned.slice(-10);
  return {
    isValid: true,
    formatted: `+91 ${standard10.slice(0, 5)} ${standard10.slice(5)}`
  };
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 8) score++;
  if (hasUppercase && hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  if (password.length < 6) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'bg-rose-500',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  }

  if (score === 1) {
    return {
      score: 1,
      label: 'Weak',
      color: 'bg-amber-500',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  } else if (score === 2) {
    return {
      score: 2,
      label: 'Fair',
      color: 'bg-amber-400',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  } else if (score === 3) {
    return {
      score: 3,
      label: 'Strong',
      color: 'bg-indigo-500',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  } else {
    return {
      score: 4,
      label: 'Very Strong',
      color: 'bg-emerald-500',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  }
}

export function validateUrl(url: string, required: boolean = false): { isValid: boolean; error?: string } {
  if (!url || !url.trim()) {
    if (required) return { isValid: false, error: 'URL is required.' };
    return { isValid: true };
  }

  try {
    const formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    new URL(formatted);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid website or profile URL.' };
  }
}

export function validateGradYear(year: string): { isValid: boolean; error?: string } {
  if (!year || !year.trim()) {
    return { isValid: false, error: 'Graduation year is required.' };
  }
  const y = parseInt(year.trim(), 10);
  if (isNaN(y) || y < 1980 || y > 2035) {
    return { isValid: false, error: 'Please enter a valid 4-digit graduation year (e.g., 2025).' };
  }
  return { isValid: true };
}
