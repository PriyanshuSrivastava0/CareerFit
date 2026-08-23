import { Router } from 'express';
import { db } from '../db';
import { INITIAL_CAREER_DOMAINS } from '../../src/data/mockDatabase';

const router = Router();

// Get list of available career domains
router.get('/domains', (req, res) => {
  return res.json({ domains: INITIAL_CAREER_DOMAINS });
});

// Select or change target domain
router.post('/select-domain', (req, res) => {
  const { userId, domain } = req.body;
  if (!userId || !domain) {
    return res.status(400).json({ error: 'User ID and domain are required.' });
  }

  const user = db.getUserById(userId);
  if (user) {
    user.currentDomain = domain;
  }

  const resume = db.getResumeByUserId(userId);
  if (resume) {
    resume.preferredDomain = domain;
    db.saveResume(resume);
  }

  return res.json({
    message: `Career domain updated to "${domain}".`,
    domain,
    resume
  });
});

// Select active career recommendation to align roadmap and gaps
router.post('/select-role', (req, res) => {
  const { userId, careerRoleId } = req.body;
  const resume = db.getResumeByUserId(userId);
  if (!resume || !resume.recommendations) {
    return res.status(404).json({ error: 'No career recommendations found.' });
  }

  const selected = resume.recommendations.find((r) => r.id === careerRoleId);
  if (!selected) {
    return res.status(404).json({ error: 'Selected career role not found.' });
  }

  resume.selectedCareer = selected;
  db.saveResume(resume);

  return res.json({
    message: `Selected career set to ${selected.roleName}`,
    selectedCareer: selected,
    resume
  });
});

// Get user career recommendations
router.get('/recommendations/:userId', (req, res) => {
  const { userId } = req.params;
  const resume = db.getResumeByUserId(userId);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  return res.json({
    recommendations: resume.recommendations || [],
    selectedCareer: resume.selectedCareer
  });
});

// Get user skill gaps
router.get('/skill-gaps/:userId', (req, res) => {
  const { userId } = req.params;
  const resume = db.getResumeByUserId(userId);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  return res.json({
    skillGaps: resume.skillGaps || [],
    selectedCareer: resume.selectedCareer
  });
});

export default router;
