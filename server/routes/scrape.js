import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/scrape/runs - List scrape runs
router.get('/runs', (req, res) => {
  try {
    const runs = db.prepare('SELECT * FROM scrape_runs ORDER BY started_at DESC LIMIT 20').all();
    res.json(runs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/scrape/runs/:id - Single scrape run
router.get('/runs/:id', (req, res) => {
  try {
    const run = db.prepare('SELECT * FROM scrape_runs WHERE id = ?').get(req.params.id);
    if (!run) {
      return res.status(404).json({ error: 'Scrape run not found' });
    }
    res.json(run);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/scrape/run - Trigger a scrape (stub - Phase 2)
router.post('/run', async (req, res) => {
  try {
    const { source } = req.body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO scrape_runs (started_at, status, source)
      VALUES (?, ?, ?)
    `).run(now, 'running', source || 'all');

    // Stub response - actual scraping is Phase 2
    res.json({
      id: result.lastInsertRowid,
      status: 'running',
      message: 'Scrape initiated (stub - Phase 2)'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/scrape/status - Get scrape status
router.get('/status', (req, res) => {
  try {
    const latest = db.prepare('SELECT * FROM scrape_runs ORDER BY started_at DESC LIMIT 1').get();
    res.json({
      last_run: latest,
      next_scheduled: '1:00 AM daily'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
