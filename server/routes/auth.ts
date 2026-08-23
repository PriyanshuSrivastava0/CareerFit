import { Router } from 'express';
import { db } from '../db';

const router = Router();

// User Registration
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password, education, graduationYear } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const newUser = db.createUser({
      name,
      email,
      phone: phone || '',
      password,
      education: education || 'Bachelor Degree',
      graduationYear: graduationYear || `${new Date().getFullYear()}`
    });

    const { passwordHash, ...safeUser } = newUser;
    return res.status(201).json({
      message: 'Account created successfully!',
      user: safeUser
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// User Login (Email / Phone + Password)
router.post('/login', (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Phone and password are required.' });
    }

    let user = db.getUserByEmail(identifier);
    if (!user) {
      user = db.getUserByPhone(identifier);
    }

    if (!user) {
      return res.status(401).json({ error: 'No account found with this email or phone.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended by administration. Please contact support.' });
    }

    if (user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
    }

    const { passwordHash, otpCode, ...safeUser } = user;
    return res.json({
      message: 'Login successful!',
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// Phone Login / OTP Request
router.post('/send-otp', (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    // Generate 6 digit mock OTP (fixed demo OTP 123456 or random for real flow)
    const demoOtp = '123456';
    return res.json({
      message: `OTP sent successfully to ${phone}`,
      demoOtpCode: demoOtp,
      expiresIn: 300
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Phone OTP Verify & Login/Signup
router.post('/verify-otp', (req, res) => {
  try {
    const { phone, otpCode, name, education, graduationYear } = req.body;
    if (!phone || !otpCode) {
      return res.status(400).json({ error: 'Phone number and OTP code are required.' });
    }

    // Accepts 123456 or any 6 digit test code for demo convenience
    if (otpCode !== '123456' && otpCode.length !== 6) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Try using demo code: 123456' });
    }

    let user = db.getUserByPhone(phone);
    if (!user) {
      // Auto register user if phone verified
      const cleanPhone = phone.replace(/[\s\-\+]/g, '');
      user = db.createUser({
        name: name || `User ${cleanPhone.slice(-4)}`,
        email: `user_${cleanPhone.slice(-6)}@careerfit.ai`,
        phone: phone,
        password: 'password123',
        education: education || 'Engineering / IT',
        graduationYear: graduationYear || '2025'
      });
    }

    const { passwordHash, ...safeUser } = user;
    return res.json({
      message: 'OTP verified successfully!',
      user: safeUser
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Forgot Password / Reset
router.post('/forgot-password', (req, res) => {
  try {
    const { identifier, newPassword } = req.body;
    if (!identifier || !newPassword) {
      return res.status(400).json({ error: 'Email/Phone and new password are required.' });
    }

    let user = db.getUserByEmail(identifier);
    if (!user) {
      user = db.getUserByPhone(identifier);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.passwordHash = newPassword;
    return res.json({ message: 'Password updated successfully! You can now log in.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Admin Login
router.post('/admin-login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Admin email and password are required.' });
    }

    const admin = db.getAdminByEmail(email);
    if (!admin || admin.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    return res.json({
      message: 'Admin authentication successful.',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error during admin login' });
  }
});

// Get Current User / Profile
router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: missing user token/id' });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { passwordHash, ...safeUser } = user;
  const resume = db.getResumeByUserId(userId);

  return res.json({
    user: safeUser,
    resume
  });
});

export default router;
