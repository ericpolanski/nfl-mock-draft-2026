import crypto from 'crypto';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from '../db.js';
import { scoreJob } from './fit-scorer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROLES = ['AI Engineer', 'Software Engineer', 'Machine Learning Engineer'];
const SOURCES = ['linkedin', 'indeed', 'glassdoor'];

// Path to Python JobSpy scraper
const JOBSPY_SCRIPT = join(__dirname, 'scraper_jobspy.py');

function hashUrl(url) {
  const normalized = (url || '').split('?')[0].toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function decodeHtmlEntities(text) {
  if (!text) return text;
  const entities = {
    '&nbsp;': ' ', '&nbsp': ' ', '&#160;': ' ', '&#xA0;': ' ', '\u00A0': ' ',
    '&amp;': '&', '&#38;': '&',
    '&lt;': '<', '&#60;': '<', '&#x3C;': '<',
    '&gt;': '>', '&#62;': '>', '&#x3E;': '>',
    '&quot;': '"', '&#34;': '"', '&#x22;': '"',
    '&apos;': "'", '&#39;': "'", '&#x27;': "'",
    '&mdash;': '\u2014', '&#8211;': '\u2013', '&ndash;': '\u2013',
    '&lsquo;': '\u2018', '&rsquo;': '\u2019', '&ldquo;': '\u201C', '&rdquo;': '\u201D',
    '&hellip;': '\u2026', '&#8230;': '\u2026',
    '&copy;': '\u00A9', '&reg;': '\u00AE', '&trade;': '\u2122',
    '&deg;': '\u00B0', '&plusmn;': '\u00B1', '&times;': '\u00D7', '&divide;': '\u00F7',
    '&cent;': '\u00A2', '&pound;': '\u00A3', '&euro;': '\u20AC', '&yen;': '\u00A5',
  };
  let result = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), char);
  }
  return result;
}

function parseSalary(text) {
  if (!text) return { min: null, max: null, text: null };
  const clean = (text || '').replace(/[$,kK]/g, '').trim();
  const numbers = clean.match(/[\d]+/g);
  if (!numbers) return { min: null, max: null, text };

  const vals = numbers.map(n => parseInt(n, 10));
  const isThousands = vals.some(v => v < 500);
  const min = isThousands ? vals[0] * 1000 : vals[0];
  const max = vals.length > 1 ? (isThousands ? vals[1] * 1000 : vals[1]) : min;
  const parsedText = text.startsWith('$') ? text : null;

  return { min, max, text: parsedText || text };
}

function isRemote(location) {
  if (!location) return false;
  return /\bremote\b/i.test(location);
}

function titleMatchesTarget(job) {
  const title = (job.title || '').toLowerCase();
  return ROLES.some(r => title.includes(r.toLowerCase()));
}

// ─── Call Python JobSpy scraper ─────────────────────────────────────────────

/**
 * Run the Python JobSpy scraper and return parsed jobs.
 * @param {Object} options
 * @param {string[]} options.sources - Sources to scrape
 * @param {number} options.resultsWanted - Max results per source per role
 * @param {number} options.timeoutMs - Timeout in milliseconds (default: 5 min)
 * @returns {Promise<Object[]>} - Array of normalized job objects
 */
function runJobSpy(options = {}) {
  const {
    sources = SOURCES,
    resultsWanted = 100,
    includeRemote = true,
    timeoutMs = 600000, // 10 minute default timeout
  } = options;

  return new Promise((resolve, reject) => {
    const args = [
      JOBSPY_SCRIPT,
      '--sources', sources.join(','),
      '--roles', ROLES.join(','),
      '--results-wanted', String(resultsWanted),
    ];
    if (!includeRemote) args.push('--no-remote');

    const proc = spawn('python3', ['-u', ...args], {
      cwd: __dirname,
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    // Timeout handler - kill subprocess and reject
    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
      reject(new Error(`JobSpy scraper timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) return; // Already rejected via timeout

      if (code !== 0) {
        console.error('[JobSpy] stderr:', stderr);
        return reject(new Error(`JobSpy scraper exited with code ${code}`));
      }

      try {
        const jobs = JSON.parse(stdout);
        resolve(jobs);
      } catch (e) {
        console.error('[JobSpy] JSON parse error. stderr:', stderr);
        console.error('[JobSpy] stdout (first 500):', stdout.slice(0, 500));
        reject(new Error(`Failed to parse JobSpy output: ${e.message}`));
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      if (timedOut) return;
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });
  });
}

// ─── Fortune 100 Scraper ─────────────────────────────────────────────────────

const FORTUNE100_SCRIPT = join(__dirname, 'scraper_fortune100.py');
const FORTUNE100_COMPANIES_FILE = join(__dirname, '..', '..', 'data', 'fortune100_companies.json');

/**
 * Run the Python Fortune 100 scraper and return parsed jobs.
 * @param {Object} options
 * @param {string[]} options.roles - Roles to search for
 * @param {number} options.resultsWanted - Max results per company
 * @param {number} options.timeoutMs - Timeout in milliseconds (default: 30 min)
 * @returns {Promise<Object[]>} - Array of normalized job objects
 */
function runFortune100Scrape(options = {}) {
  const {
    roles = ROLES,
    resultsWanted = 100,
    timeoutMs = 1800000, // 30 minute default timeout
  } = options;

  return new Promise((resolve, reject) => {
    const args = [
      FORTUNE100_SCRIPT,
      '--companies-file', FORTUNE100_COMPANIES_FILE,
      '--roles', roles.join(','),
      '--results-wanted', String(resultsWanted),
    ];

    const proc = spawn('python3', ['-u', ...args], {
      cwd: __dirname,
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
      reject(new Error(`Fortune100 scraper timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) return;

      if (code !== 0) {
        console.error('[Fortune100] stderr:', stderr);
        return reject(new Error(`Fortune100 scraper exited with code ${code}`));
      }

      try {
        const jobs = JSON.parse(stdout);
        resolve(jobs);
      } catch (e) {
        console.error('[Fortune100] JSON parse error. stderr:', stderr);
        console.error('[Fortune100] stdout (first 500):', stdout.slice(0, 500));
        reject(new Error(`Failed to parse Fortune100 output: ${e.message}`));
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      if (timedOut) return;
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });
  });
}

// ─── Legacy Scrapfly-based scrapers (kept for compatibility) ──────────────────
// These are no longer used but kept so other modules importing them don't break.
// The new scraping flow uses runJobSpy() instead.

async function scrapeLinkedIn() { return []; }
async function scrapeIndeed() { return []; }
async function scrapeGlassdoor() { return []; }
async function scrapeJobDetail(job) { return job; }

// ─── Upsert company ──────────────────────────────────────────────────────────

function upsertCompany(name) {
  const existing = db.prepare('SELECT id FROM companies WHERE name = ?').get(name);
  if (existing) return existing.id;
  const result = db.prepare('INSERT INTO companies (name) VALUES (?)').run(name);
  return result.lastInsertRowid;
}

// ─── Main scrapeAll function ────────────────────────────────────────────────

export async function scrapeAll(options = {}) {
  const {
    sources = SOURCES,
    maxDetailPages = 100,
    runId = null,
    resultsWanted = 20,
    includeRemote = true
  } = options;

  // Separate fortune100 from other sources
  const fortune100Enabled = sources.includes('fortune100');
  const jobspySources = sources.filter(s => s !== 'fortune100');

  // Run JobSpy for non-fortune100 sources
  let allListings = [];
  try {
    if (jobspySources.length > 0) {
      console.log('[Scraper] Running JobSpy scraper...');
      allListings = await runJobSpy({ sources: jobspySources, resultsWanted, includeRemote });
      console.log(`[Scraper] JobSpy returned ${allListings.length} listings`);
    }
  } catch (e) {
    console.error('[Scraper] JobSpy failed:', e.message);
    // Continue even if JobSpy fails - Fortune100 might still work
  }

  // Run Fortune100 scraper if enabled
  if (fortune100Enabled) {
    try {
      console.log('[Scraper] Running Fortune100 scraper...');
      const fortune100Jobs = await runFortune100Scrape({ roles: ROLES, resultsWanted });
      console.log(`[Scraper] Fortune100 returned ${fortune100Jobs.length} listings`);
      allListings = allListings.concat(fortune100Jobs);
    } catch (e) {
      console.error('[Scraper] Fortune100 failed:', e.message);
    }
  }

  if (allListings.length === 0) {
    return { jobs_found: 0, jobs_new: 0, jobs_scored: 0, error: 'No listings scraped' };
  }

  // Store ALL scraped listings in scrape_results table
  const now = new Date().toISOString();
  let totalStored = 0;
  let duplicateCount = 0;

  const insertResult = db.prepare(`
    INSERT INTO scrape_results (
      scrape_run_id, source, source_url, url_hash, title, company_name,
      location, salary_text, posted_date, is_duplicate, scraped_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seenInRun = new Set();

  for (const job of allListings) {
    const urlHash = hashUrl(job.source_url);
    const existingInJobs = db.prepare('SELECT id FROM jobs WHERE url_hash = ?').get(urlHash);
    const isDuplicate = existingInJobs ? 1 : 0;
    if (existingInJobs) duplicateCount++;

    if (seenInRun.has(urlHash)) continue;
    seenInRun.add(urlHash);

    try {
      insertResult.run(
        runId,
        job.source,
        job.source_url,
        urlHash,
        job.title,
        job.company_name,
        job.location,
        job.salary_text,
        job.posted_date,
        isDuplicate,
        now
      );
      totalStored++;
    } catch (e) {
      // Skip if insert fails (e.g., unique constraint)
    }
  }

  console.log(`[Scraper] Stored ${totalStored} in scrape_results (${duplicateCount} were duplicates)`);

  // Filter to target roles OR remote jobs
  const filtered = allListings.filter(job => {
    const titleMatch = titleMatchesTarget(job);
    const remoteMatch = isRemote(job.location);
    return titleMatch || remoteMatch;
  });

  // Deduplicate by URL hash
  const seen = new Set();
  const unique = filtered.filter(job => {
    const hash = hashUrl(job.source_url);
    if (seen.has(hash)) return false;
    return true;
  });

  console.log(`[Scraper] Unique listings for detail processing: ${unique.length}`);

  // Process jobs: insert into DB and score
  let jobsNew = 0;
  let jobsScored = 0;

  for (let i = 0; i < Math.min(unique.length, maxDetailPages); i++) {
    const listing = unique[i];

    try {
      const urlHash = hashUrl(listing.source_url);

      // Skip if already in jobs table
      const existing = db.prepare('SELECT id FROM jobs WHERE url_hash = ?').get(urlHash);
      if (existing) continue;

      const companyId = upsertCompany(listing.company_name);
      const salary = parseSalary(listing.salary_text);

      // Use description from JobSpy if available (LinkedIn with linkedin_fetch_description=True)
      // Truncate to 2000 chars to avoid memory bloat; full description fetched in detail scrape
      const description = (listing.description || '').slice(0, 2000);

      db.prepare(`
        INSERT INTO jobs (
          source, source_url, url_hash, title, company_name, company_id,
          location, is_remote, salary_min, salary_max, salary_text,
          description, requirements, posted_date, scraped_at,
          is_active, scrape_run_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `).run(
        listing.source,
        listing.source_url,
        urlHash,
        listing.title,
        listing.company_name,
        companyId,
        listing.location,
        isRemote(listing.location) ? 1 : 0,
        salary.min,
        salary.max,
        salary.text,
        description,
        listing.requirements,
        listing.posted_date || null,
        now,
        runId
      );

      jobsNew++;

      // Score the job
      const jobId = db.prepare('SELECT last_insert_rowid() as id').get().id;
      try {
        await scoreJob(jobId, db);
        jobsScored++;
      } catch (e) {
        console.error(`[Scraper] Scoring error for job ${jobId}:`, e.message);
      }

      // Rate limit between jobs
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`[Scraper] Error processing listing ${listing.source_url}:`, e.message);
    }
  }

  return { jobs_found: allListings.length, jobs_new: jobsNew, jobs_scored: jobsScored };
}

export { scrapeLinkedIn, scrapeIndeed, scrapeGlassdoor, scrapeJobDetail, runJobSpy, runFortune100Scrape };
