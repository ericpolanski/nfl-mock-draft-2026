import crypto from 'crypto';
import db from '../db.js';
import { scoreJob } from './fit-scorer.js';

const SCRAPFLY_API_KEY = process.env.SCRAPFLY_API_KEY;
const SCRAPFLY_BASE = 'https://api.scrapfly.io';

const CHICAGO_LOCATIONS = ['chicago', 'evanston', 'gurnee', 'north chicago', 'lincolnshire', 'grayslake', 'waukegan', 'lake county'];
const ROLES = ['AI Engineer', 'Software Engineer', 'Machine Learning Engineer'];
const SOURCES = ['linkedin', 'indeed', 'glassdoor'];

// Target companies in Chicagoland area for direct career page scraping
const DIRECT_COMPANIES = [
  'AbbVie', 'Allstate', 'Aon', 'United Airlines', 'Boeing',
  'CDK Global', 'Morningstar', 'CNA Insurance', 'Kemper',
  'Grubhub', 'SpotHero', 'Base', 'Sprout Social', 'Inventive',
  'Kaplan', 'Allstate', 'US Foods', 'Molex', 'Horizon Therapeutics'
];

function scrapflyHeaders() {
  return {
    'Content-Type': 'application/json'
  };
}

async function scrapflyScrape(url, config = {}) {
  const params = new URLSearchParams({
    key: SCRAPFLY_API_KEY,
    url,
    asp: 'true',
    render_js: 'true',
    country: 'US',
    ...config
  });

  const response = await fetch(`${SCRAPFLY_BASE}/scrape?${params}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Scrapfly error ${response.status}: ${error}`);
  }

  return response.json();
}

async function scrapflyExtract(body, url, extractionPrompt) {
  const response = await fetch(`${SCRAPFLY_BASE}/extraction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: SCRAPFLY_API_KEY,
      body,
      url,
      content_type: 'text/html',
      extraction_prompt: extractionPrompt
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Scrapfly extraction error ${response.status}: ${error}`);
  }

  return response.json();
}

function hashUrl(url) {
  // Normalize URL: lowercase, strip tracking params
  const normalized = url.split('?')[0].toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function parseSalary(text) {
  if (!text) return { min: null, max: null, text: null };
  // Handle "$120K - $180K", "$80,000 - $120,000", "120000", etc.
  const clean = text.replace(/[$,kK]/g, '').trim();
  const numbers = clean.match(/[\d]+/g);
  if (!numbers) return { min: null, max: null, text };

  const vals = numbers.map(n => parseInt(n, 10));
  // If values look like they're in thousands (e.g., 80-120), assume K
  const isThousands = vals.some(v => v < 500);

  const min = isThousands ? vals[0] * 1000 : vals[0];
  const max = vals.length > 1 ? (isThousands ? vals[1] * 1000 : vals[1]) : min;

  return { min, max, text };
}

function isChicagoland(location) {
  if (!location) return false;
  const loc = location.toLowerCase();
  return CHICAGO_LOCATIONS.some(c => loc.includes(c)) ||
    /\b(il|illinois)\b/i.test(loc) ||
    /\b(chicago|northbrook|evanston|gurnee|waukegan)\b/i.test(loc);
}

function isRemote(location) {
  if (!location) return false;
  return /\bremote\b/i.test(location);
}

function jobMatchesTarget(job) {
  const loc = (job.location || '').toLowerCase();
  const title = (job.title || '').toLowerCase();
  // Must be in Illinois or remote OR company is known Chicagoland
  const isIL = /\bil\b/i.test(loc) || isChicagoland(loc);
  const isRemoteJob = isRemote(loc);
  if (!isIL && !isRemoteJob) return false;

  // Title should match target roles
  const roleMatch = ROLES.some(r => title.includes(r.toLowerCase()));
  return roleMatch;
}

// ─── LinkedIn Scraper ───────────────────────────────────────────────────────

async function scrapeLinkedIn() {
  const jobs = [];

  for (const role of ROLES) {
    const query = encodeURIComponent(`${role} entry level`);
    const url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=Chicago%2C%20IL&f_E=2&f_TPR=r604800&locationId=`;

    try {
      const result = await scrapflyScrape(url, { rendering_wait: 5000 });

      const extracted = await scrapflyExtract(
        result.result.content,
        url,
        `Extract all job listings from this LinkedIn search results page. For each job return a JSON array with: title, company_name, location, source_url (the job detail link), posted_date (as YYYY-MM-DD or relative like "2 days ago"), salary_text (if visible). Return ONLY valid JSON array.`
      );

      let listings = [];
      try {
        listings = JSON.parse(extracted.data?.extracted_content || '[]');
      } catch {
        // Fallback: try to extract from markdown
        const markdown = extracted.data?.extracted_content || '';
        // Try common patterns
        const lines = markdown.split('\n').filter(l => l.trim());
        for (const line of lines) {
          const titleMatch = line.match(/\[([^\]]+)\]/);
          const companyMatch = line.match(/at\s+([^(]+)/);
          if (titleMatch) {
            listings.push({
              title: titleMatch[1],
              company_name: companyMatch ? companyMatch[1].trim() : 'Unknown',
              location: 'Chicago, IL',
              source_url: '',
              posted_date: null,
              salary_text: null
            });
          }
        }
      }

      for (const job of listings) {
        if (!job.source_url || job.source_url === '#') continue;
        jobs.push({
          source: 'linkedin',
          source_url: job.source_url,
          title: job.title,
          company_name: job.company_name,
          location: job.location || 'Chicago, IL',
          salary_text: job.salary_text,
          posted_date: job.posted_date,
          description: '',
          requirements: '[]'
        });
      }
    } catch (e) {
      console.error(`LinkedIn scrape error for ${role}:`, e.message);
    }

    // Rate limit between requests
    await new Promise(r => setTimeout(r, 2000));
  }

  return jobs;
}

// ─── Indeed Scraper ─────────────────────────────────────────────────────────

async function scrapeIndeed() {
  const jobs = [];

  for (const role of ROLES) {
    const query = encodeURIComponent(role);
    const location = encodeURIComponent('Gurnee, IL');
    const url = `https://www.indeed.com/jobs?q=${query}&l=${location}&radius=30&fromage=3&sort=date`;

    try {
      const result = await scrapflyScrape(url, { rendering_wait: 4000 });

      const extracted = await scrapflyExtract(
        result.result.content,
        url,
        `Extract all job listings from this Indeed search results page. For each job return a JSON array with: title, company_name, location, source_url (the complete indeed job URL), posted_date (as YYYY-MM-DD or relative like "3 days ago"), salary_text (if visible). Return ONLY valid JSON array.`
      );

      let listings = [];
      try {
        listings = JSON.parse(extracted.data?.extracted_content || '[]');
      } catch {
        // Try HTML parsing from result if extraction fails
        const html = result.result.content;
        // Simple regex-based fallback for job cards
        const cardRegex = /<a[^>]+href="(\/rc\/clk\?[^"]+)"[^>]*>.*?<女星[^>]*>([^<]+)<\/span>.*?<div[^>]*class="[^"]*company[^"]*"[^>]*>([^<]+)<\/div>/gs;
        let match;
        while ((match = cardRegex.exec(html)) !== null && listings.length < 30) {
          const href = match[1];
          const title = match[2]?.trim();
          const company = match[3]?.trim();
          if (title && company) {
            listings.push({
              title,
              company_name: company,
              location: 'Gurnee, IL (30mi)',
              source_url: href.startsWith('http') ? href : `https://www.indeed.com${href}`,
              posted_date: null,
              salary_text: null
            });
          }
        }
      }

      for (const job of listings) {
        if (!job.source_url) continue;
        const fullUrl = job.source_url.startsWith('http')
          ? job.source_url
          : `https://www.indeed.com${job.source_url}`;

        jobs.push({
          source: 'indeed',
          source_url: fullUrl,
          title: job.title,
          company_name: job.company_name,
          location: job.location || 'Gurnee, IL',
          salary_text: job.salary_text,
          posted_date: job.posted_date,
          description: '',
          requirements: '[]'
        });
      }
    } catch (e) {
      console.error(`Indeed scrape error for ${role}:`, e.message);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  return jobs;
}

// ─── Glassdoor Scraper ──────────────────────────────────────────────────────

async function scrapeGlassdoor() {
  const jobs = [];

  for (const role of ROLES) {
    const query = encodeURIComponent(role);
    const url = `https://www.glassdoor.com/Job/chicago-${query}-jobs-SRCH_IL.0_7.htm`;

    try {
      const result = await scrapflyScrape(url, { rendering_wait: 5000 });

      const extracted = await scrapflyExtract(
        result.result.content,
        url,
        `Extract all job listings from this Glassdoor search results page. For each job return a JSON array with: title, company_name, location, source_url (the job detail URL), posted_date, salary_text. Return ONLY valid JSON array.`
      );

      let listings = [];
      try {
        listings = JSON.parse(extracted.data?.extracted_content || '[]');
      } catch {
        // Fallback
      }

      for (const job of listings) {
        if (!job.source_url) continue;
        const fullUrl = job.source_url.startsWith('http')
          ? job.source_url
          : `https://www.glassdoor.com${job.source_url}`;

        jobs.push({
          source: 'glassdoor',
          source_url: fullUrl,
          title: job.title,
          company_name: job.company_name,
          location: job.location || 'Chicago, IL',
          salary_text: job.salary_text,
          posted_date: job.posted_date,
          description: '',
          requirements: '[]'
        });
      }
    } catch (e) {
      console.error(`Glassdoor scrape error for ${role}:`, e.message);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  return jobs;
}

// ─── Scrape detail page for a single job ───────────────────────────────────

async function scrapeJobDetail(job) {
  if (!job.source_url) return null;

  try {
    const result = await scrapflyScrape(job.source_url, { rendering_wait: 3000 });

    const extracted = await scrapflyExtract(
      result.result.content,
      job.source_url,
      `Extract the full job details from this job posting page. Return JSON with: title, company_name, location, salary_text, description (full job description text), requirements (array of requirement strings), apply_url (the direct link to apply).`
    );

    let detail = {};
    try {
      detail = JSON.parse(extracted.data?.extracted_content || '{}');
    } catch {
      detail = {};
    }

    const salary = parseSalary(detail.salary_text || job.salary_text);

    return {
      ...job,
      title: detail.title || job.title,
      company_name: detail.company_name || job.company_name,
      location: detail.location || job.location,
      salary_text: salary.text,
      salary_min: salary.min,
      salary_max: salary.max,
      description: detail.description || '',
      requirements: Array.isArray(detail.requirements)
        ? JSON.stringify(detail.requirements)
        : job.requirements,
      source_url: detail.apply_url || job.source_url
    };
  } catch (e) {
    // Return original job data if detail scrape fails
    return {
      ...job,
      salary_text: parseSalary(job.salary_text).text,
      salary_min: parseSalary(job.salary_text).min,
      salary_max: parseSalary(job.salary_text).max
    };
  }
}

// ─── Upsert company ─────────────────────────────────────────────────────────

function upsertCompany(name) {
  const existing = db.prepare('SELECT id FROM companies WHERE name = ?').get(name);
  if (existing) return existing.id;

  const result = db.prepare('INSERT INTO companies (name) VALUES (?)').run(name);
  return result.lastInsertRowid;
}

// ─── Main scrapeAll function ────────────────────────────────────────────────

export async function scrapeAll(options = {}) {
  const { sources = SOURCES, maxDetailPages = 20, runId = null } = options;

  const allListings = [];

  if (sources.includes('linkedin')) {
    try {
      const linkedinJobs = await scrapeLinkedIn();
      allListings.push(...linkedinJobs);
      console.log(`LinkedIn: found ${linkedinJobs.length} listings`);
    } catch (e) {
      console.error('LinkedIn scrape failed:', e.message);
    }
  }

  if (sources.includes('indeed')) {
    try {
      const indeedJobs = await scrapeIndeed();
      allListings.push(...indeedJobs);
      console.log(`Indeed: found ${indeedJobs.length} listings`);
    } catch (e) {
      console.error('Indeed scrape failed:', e.message);
    }
  }

  if (sources.includes('glassdoor')) {
    try {
      const glassdoorJobs = await scrapeGlassdoor();
      allListings.push(...glassdoorJobs);
      console.log(`Glassdoor: found ${glassdoorJobs.length} listings`);
    } catch (e) {
      console.error('Glassdoor scrape failed:', e.message);
    }
  }

  console.log(`Total listings before dedup: ${allListings.length}`);

  // Deduplicate by URL hash
  const seen = new Set();
  const unique = allListings.filter(job => {
    const hash = hashUrl(job.source_url);
    if (seen.has(hash)) return false;
    // Also check if already in DB
    const existing = db.prepare('SELECT id FROM jobs WHERE url_hash = ?').get(hash);
    if (existing) return false;
    seen.add(hash);
    return true;
  });

  console.log(`Unique new listings: ${unique.length}`);

  // Filter to Chicagoland-relevant
  const filtered = unique.filter(job => jobMatchesTarget(job) || isRemote(job.location));
  console.log(`After Chicagoland filter: ${filtered.length}`);

  // Scrape detail pages (limited)
  let jobsNew = 0;
  let jobsScored = 0;
  const now = new Date().toISOString();

  for (let i = 0; i < Math.min(filtered.length, maxDetailPages); i++) {
    const listing = filtered[i];

    try {
      const detail = await scrapeJobDetail(listing);
      if (!detail) continue;

      const companyId = upsertCompany(detail.company_name);
      const urlHash = hashUrl(detail.source_url);
      const salary = parseSalary(detail.salary_text);

      db.prepare(`
        INSERT INTO jobs (
          source, source_url, url_hash, title, company_name, company_id,
          location, is_remote, salary_min, salary_max, salary_text,
          description, requirements, posted_date, scraped_at,
          is_active, scrape_run_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `).run(
        detail.source,
        detail.source_url,
        urlHash,
        detail.title,
        detail.company_name,
        companyId,
        detail.location,
        isRemote(detail.location) ? 1 : 0,
        salary.min,
        salary.max,
        salary.text,
        detail.description,
        detail.requirements,
        detail.posted_date || null,
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
        console.error(`Scoring error for job ${jobId}:`, e.message);
      }

      // Rate limit between detail scrapes
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error(`Detail scrape error for ${listing.source_url}:`, e.message);
    }
  }

  return { jobs_found: allListings.length, jobs_new: jobsNew, jobs_scored: jobsScored };
}

export { scrapeLinkedIn, scrapeIndeed, scrapeGlassdoor, scrapeJobDetail };
