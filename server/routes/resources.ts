import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Get learning resources with optional filtering
router.get('/', (req, res) => {
  const { domain, skill, difficulty } = req.query as { domain?: string; skill?: string; difficulty?: string };
  const resources = db.getAllLearningResources({ domain, skill, difficulty });
  return res.json({ resources });
});

// Get recommended capstone projects
router.get('/projects', (req, res) => {
  const projects = db.getAllProjects();
  return res.json({ projects });
});

// Get comprehensive job readiness score
router.get('/job-readiness/:userId', (req, res) => {
  const { userId } = req.params;
  const resume = db.getResumeByUserId(userId);
  if (!resume || !resume.jobReadiness) {
    return res.status(404).json({ error: 'Job readiness report not available yet.' });
  }

  return res.json({
    jobReadiness: resume.jobReadiness,
    atsScore: resume.atsAnalysis?.overallScore || 0,
    roadmapProgress: resume.roadmap?.overallProgress || 0
  });
});

export default router;
