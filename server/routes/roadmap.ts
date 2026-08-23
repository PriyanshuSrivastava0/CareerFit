import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Get Roadmap for User
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const resume = db.getResumeByUserId(userId);
  if (!resume || !resume.roadmap) {
    return res.status(404).json({ error: 'No active roadmap found for user.' });
  }

  return res.json({
    roadmap: resume.roadmap,
    jobReadiness: resume.jobReadiness
  });
});

// Toggle Task Completion
router.post('/toggle-task', (req, res) => {
  const { userId, taskId, completed, notes } = req.body;
  if (!userId || !taskId || completed === undefined) {
    return res.status(400).json({ error: 'userId, taskId, and completed status are required.' });
  }

  const updatedRoadmap = db.toggleRoadmapTask(userId, taskId, completed, notes);
  if (!updatedRoadmap) {
    return res.status(404).json({ error: 'Roadmap or task not found.' });
  }

  const resume = db.getResumeByUserId(userId);

  return res.json({
    message: completed ? 'Task marked as completed! 🎉' : 'Task unmarked.',
    roadmap: updatedRoadmap,
    jobReadiness: resume?.jobReadiness
  });
});

// Update Task Notes
router.post('/update-notes', (req, res) => {
  const { userId, taskId, notes } = req.body;
  const resume = db.getResumeByUserId(userId);
  if (!resume || !resume.roadmap) {
    return res.status(404).json({ error: 'Roadmap not found.' });
  }

  let updated = false;
  for (const phase of resume.roadmap.phases) {
    for (const task of phase.tasks) {
      if (task.id === taskId) {
        task.notes = notes;
        updated = true;
      }
    }
  }

  if (updated) {
    db.saveResume(resume);
    return res.json({ message: 'Task notes saved successfully.', roadmap: resume.roadmap });
  }

  return res.status(404).json({ error: 'Task not found.' });
});

export default router;
