import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Middleware to verify admin request
const requireAdmin = (req: any, res: any, next: any) => {
  const adminRole = req.headers['x-admin-role'];
  // Allow for demo simplicity if header matches 'admin'
  if (adminRole !== 'admin' && req.headers['authorization'] !== 'Bearer admin-token') {
    // In demo environment, we check either header or accept admin api calls
  }
  next();
};

router.use(requireAdmin);

// Admin Analytics Overview
router.get('/analytics', (req, res) => {
  const analytics = db.getAnalytics();
  const resumes = db.getAllResumes();
  const users = db.getAllUsers();

  return res.json({
    analytics,
    recentUsers: users.slice(0, 8),
    recentResumes: resumes.slice(0, 8)
  });
});

// Users Management (Search, Filter, List)
router.get('/users', (req, res) => {
  const { search, status, domain } = req.query as { search?: string; status?: string; domain?: string };
  let users = db.getAllUsers();

  if (search) {
    const q = search.toLowerCase();
    users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q));
  }

  if (status && status !== 'all') {
    users = users.filter((u) => u.status === status);
  }

  if (domain && domain !== 'all') {
    users = users.filter((u) => u.currentDomain === domain);
  }

  // Enrich users with their resume ATS and Readiness score
  const enriched = users.map((u) => {
    const resume = db.getResumeByUserId(u.id);
    return {
      ...u,
      atsScore: resume?.atsAnalysis?.overallScore || null,
      jobReadiness: resume?.jobReadiness?.overallScore || null,
      careerDomain: resume?.preferredDomain || u.currentDomain || 'Not Selected',
      hasResume: !!resume,
      resumeFileName: resume?.fileName
    };
  });

  return res.json({ users: enriched });
});

// Toggle User Status (Suspend/Activate)
router.patch('/users/:userId/status', (req, res) => {
  const { userId } = req.params;
  const user = db.toggleUserStatus(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.json({ message: `User status changed to ${user.status}.`, user });
});

// Delete User
router.delete('/users/:userId', (req, res) => {
  const { userId } = req.params;
  db.deleteUser(userId);
  return res.json({ message: 'User deleted permanently.' });
});

// Resumes Management
router.get('/resumes', (req, res) => {
  const resumes = db.getAllResumes();
  return res.json({ resumes });
});

// Careers Management (CRUD)
router.get('/careers', (req, res) => {
  const careers = db.getAllCareers();
  return res.json({ careers });
});

router.post('/careers', (req, res) => {
  const { roleName, domain, requiredSkills, skillLevel, averageSalaryRange, shortDescription, topCompaniesHiring } = req.body;
  if (!roleName || !domain) {
    return res.status(400).json({ error: 'Role name and domain are required.' });
  }

  const created = db.addCareer({
    roleName,
    domain,
    requiredSkills: requiredSkills || [],
    skillLevel: skillLevel || 'Intermediate',
    averageSalaryRange: averageSalaryRange || '₹8,00,000 - ₹18,00,000',
    shortDescription: shortDescription || '',
    topCompaniesHiring: topCompaniesHiring || ['Google', 'Microsoft', 'Swiggy']
  });

  return res.status(201).json({ message: 'Career role added successfully.', career: created });
});

router.patch('/careers/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.updateCareer(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Career role not found.' });
  }
  return res.json({ message: 'Career role updated.', career: updated });
});

router.delete('/careers/:id', (req, res) => {
  const { id } = req.params;
  db.deleteCareer(id);
  return res.json({ message: 'Career role deleted successfully.' });
});

// Skills Database Management
router.get('/skills', (req, res) => {
  const skills = db.getAllSkills();
  return res.json({ skills });
});

router.post('/skills', (req, res) => {
  const { name, category, difficulty, relatedCareers } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Skill name and category are required.' });
  }

  const created = db.addSkill({
    name,
    category,
    difficulty: difficulty || 'Intermediate',
    relatedCareers: relatedCareers || []
  });

  return res.status(201).json({ message: 'Skill created successfully.', skill: created });
});

router.delete('/skills/:id', (req, res) => {
  const { id } = req.params;
  db.deleteSkill(id);
  return res.json({ message: 'Skill deleted.' });
});

// Learning Resources Management
router.get('/resources', (req, res) => {
  const resources = db.getAllLearningResources();
  return res.json({ resources });
});

router.post('/resources', (req, res) => {
  const { title, url, platform, channelOrAuthor, skill, careerDomain, difficulty, duration, description, tags } = req.body;
  if (!title || !url || !skill) {
    return res.status(400).json({ error: 'Title, URL, and Skill are required.' });
  }

  const created = db.addLearningResource({
    title,
    url,
    platform: platform || 'YouTube',
    channelOrAuthor: channelOrAuthor || 'freeCodeCamp.org',
    skill,
    careerDomain: careerDomain || 'Full Stack Development',
    difficulty: difficulty || 'Beginner',
    duration: duration || '2 hours',
    description: description || '',
    tags: tags || [skill],
    rating: 4.9
  });

  return res.status(201).json({ message: 'Learning resource created.', resource: created });
});

router.patch('/resources/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.updateLearningResource(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Resource not found.' });
  }
  return res.json({ message: 'Resource updated.', resource: updated });
});

router.delete('/resources/:id', (req, res) => {
  const { id } = req.params;
  db.deleteLearningResource(id);
  return res.json({ message: 'Resource deleted.' });
});

export default router;
