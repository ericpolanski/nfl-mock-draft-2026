import express from 'express';
import { getProfile } from '../lib/profile.js';
import db from '../db.js';
import * as llm from '../services/llm.js';

const router = express.Router();

// GET /api/resume/base - Eric's structured profile
router.get('/base', (req, res) => {
  const profile = getProfile();
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(profile);
});

// POST /api/resume/tailor/:jobId - Generate tailoring suggestions
router.post('/tailor/:jobId', async (req, res) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const profile = getProfile();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const suggestions = await llm.generateResumeSuggestions(profile, job.description || '');

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/resume/generate/:jobId - Generate DOCX+PDF (stub)
router.post('/generate/:jobId', async (req, res) => {
  const { suggestions, tailored_sections } = req.body;

  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const now = new Date().toISOString();
    const fileName = `Eric Polanski Resume - ${job.company_name}.pdf`;

    const result = db.prepare(`
      INSERT INTO resume_versions (job_id, suggestions, tailored_sections, file_name, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.params.jobId, JSON.stringify(suggestions), JSON.stringify(tailored_sections), fileName, now);

    res.json({
      id: result.lastInsertRowid,
      job_id: req.params.jobId,
      file_name: fileName,
      created_at: now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/resume/download/:id - Download (stub)
router.get('/download/:id', (req, res) => {
  try {
    const resume = db.prepare('SELECT * FROM resume_versions WHERE id = ?').get(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Stub - would serve actual file in production
    res.json({
      id: resume.id,
      file_name: resume.file_name,
      download_url: `/generated/resumes/${resume.file_name}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
