import crypto from 'crypto';
import db from '../db.js';
import { scoreJob } from './fit-scorer.js';

const SCRAPFLY_API_KEY = process.env.SCRAPFLY_API_KEY;
const SCRAPFLY_BASE = 'https://api.scrapfly.io';

const CHICAGO_LOCATIONS = ['chicago', 'evanston', 'gurnee', 'north chicago', 'lincolnshire', 'grayslake', 'waukegan', 'lake county', 'northbrook', 'glenview', 'skokie', 'des plaines', 'arlington heights'];
const ROLES = ['AI Engineer', 'Software Engineer', 'Machine Learning Engineer'];
const SOURCES = ['linkedin', 'indeed', 'glassdoor', 'company'];

// Companies to scrape career pages for - use actual job search URLs (not landing pages)
// Key insight: career site landing pages don't have job listings; job search result pages do
const TARGET_COMPANIES = [
  { name: 'Abbott', careersUrl: 'https://www.jobs.abbott/us/en/search-results', roles: ['software', 'ai', 'machine learning', 'data', 'digital'] },
  { name: 'Accenture', careersUrl: 'https://www.accenture.com/us-en/careers/jobsearch', roles: ['software', 'ai', 'data'] },
  { name: 'Allstate', careersUrl: 'https://www.allstate.com/careers/search-openings.aspx', roles: ['software', 'ai', 'data'] },
  { name: 'Amazon', careersUrl: 'https://www.amazon.jobs/en/search/?base_query=software+engineer&loc_query=Chicago%2C+IL', roles: ['software', 'ai', 'machine learning'] },
  { name: 'Apple', careersUrl: 'https://jobs.apple.com/en-us/search?location=Chicago-IL-IL-UNITED+STATES', roles: ['software', 'ai', 'data'] },
  { name: 'Capital One', careersUrl: 'https://www.capitalone.com/careers/search/', roles: ['software', 'ai', 'machine learning'] },
  { name: 'Caterpillar', careersUrl: 'https://www.caterpillar.com/en/careers.html', roles: ['software', 'ai', 'data'] },
  { name: 'CDK Global', careersUrl: 'https://www.cdkglobal.com/careers', roles: ['software', 'ai'] },
  { name: 'Cerner', careersUrl: 'https://www.cerner.com/careers', roles: ['software', 'ai', 'data'] },
  { name: 'CIBC', careersUrl: 'https://www.cibc.com/en/careers/search.html', roles: ['software', 'ai', 'data'] },
  { name: 'Citizens Financial Group', careersUrl: 'https://www.citizensbank.com/careers/', roles: ['software', 'ai', 'data'] },
  { name: 'CNA Insurance', careersUrl: 'https://www.cna.com/careers/search', roles: ['software', 'ai', 'data'] },
  { name: 'Cognizant', careersUrl: 'https://www.cognizant.com/careers/job-search', roles: ['software', 'ai', 'machine learning'] },
  { name: 'Culvers', careersUrl: 'https://www.culvers.com/careers/', roles: ['software', 'it'] },
  { name: 'Discover Financial', careersUrl: 'https://www.discover.com/careers/', roles: ['software', 'ai', 'data'] },
  { name: 'DMG Blockchain', careersUrl: 'https://dmgblockchain.io/careers/', roles: ['software', 'ai'] },
  { name: 'Exelon', careersUrl: 'https://www.exeloncorp.com/careers.html', roles: ['software', 'it', 'data'] },
  { name: 'Fiserv', careersUrl: 'https://www.fiserv.com/careers.aspx', roles: ['software', 'ai', 'data'] },
  { name: 'Franklin Street', careersUrl: 'https://www.franklinstreet.com/careers/', roles: ['software', 'data'] },
  { name: 'Gallagher', careersUrl: 'https://www.ajg.com/careers/', roles: ['software', 'it'] },
  { name: 'GE', careersUrl: 'https://www.ge.com/careers/', roles: ['software', 'ai', 'data', 'digital'] },
  { name: 'Google', careersUrl: 'https://careers.google.com/location/chicago/', roles: ['software', 'ai', 'machine learning'] },
  { name: 'Grainger', careersUrl: 'https://www.grainger.com/careers/', roles: ['software', 'it', 'data'] },
  { name: 'Groupon', careersUrl: 'https://www.groupon.com/careers', roles: ['software', 'ai', 'data'] },
  { name: 'Health Care Service Corporation', careersUrl: 'https://www.hcsc.com/careers.html', roles: ['software', 'ai', 'data'] },
  { name: 'Hilton', careersUrl: 'https://www.hilton.com/en/careers/search/', roles: ['software', 'it'] },
  { name: 'IBM', careersUrl: 'https://www.ibm.com/careers/us-en/search/?q=software+engineer&d=https%3A%2F%2Fwww.ibm.com%2Fcareers%2Fus-en%2Fsearch%2F&loc=Chicago', roles: ['software', 'ai', 'data'] },
  { name: 'Infosys', careersUrl: 'https://www.infosys.com/careers/apply.html', roles: ['software', 'ai', 'data'] },
  { name: 'JPMorgan Chase', careersUrl: 'https://careers.jpmorgan.com/us/en/search-results?q=software+engineer&location=Chicago', roles: ['software', 'ai', 'data'] },
  { name: 'Kelloggs', careersUrl: 'https://www.kelloggcompany.com/careers', roles: ['software', 'it'] },
  { name: 'Kforce', careersUrl: 'https://www.kforce.com/careers/', roles: ['software', 'it'] },
  { name: 'KPMG', careersUrl: 'https://careers.kpmg.us/search-jobs/', roles: ['software', 'ai', 'data'] },
  { name: 'L3Harris', careersUrl: 'https://careers.l3harris.com/search-jobs', roles: ['software', 'it', 'data'] },
  { name: 'Leidos', careersUrl: 'https://www.leidos.com/careers', roles: ['software', 'ai', 'data'] },
  { name: 'Morningstar', careersUrl: 'https://www.morningstar.com/careers', roles: ['software', 'ai', 'data'] },
  { name: 'Motorola Solutions', careersUrl: 'https://www.motorolasolutions.com/en_us/about/careers.html', roles: ['software', 'ai', 'data'] },
  { name: 'Northrop Grumman', careersUrl: 'https://www.northropgrumman.com/search-jobs/', roles: ['software', 'ai', 'data'] },
  { name: 'Northern Trust', careersUrl: 'https://www.northerntrust.com/careers', roles: ['software', 'ai', 'data'] },
  { name: 'Northwestern Memorial', careersUrl: 'https://www.nm.org/careers', roles: ['software', 'it', 'data'] },
  { name: 'Optum', careersUrl: 'https://www.optum.com/careers/search.html', roles: ['software', 'ai', 'data'] },
  { name: 'Oracle', careersUrl: 'https://www.oracle.com/careers/', roles: ['software', 'ai', 'data'] },
  { name: 'PNC', careersUrl: 'https://www.pnc.com/en/about-pnc/careers.html', roles: ['software', 'ai', 'data'] },
  { name: 'Polanyi Digital', careersUrl: 'https://polanyidigital.com/careers', roles: ['software', 'ai'] },
  { name: 'Presbyterian Healthcare', careersUrl: 'https://www.presbyterian.com/careers', roles: ['software', 'it'] },
  { name: 'PwC', careersUrl: 'https://www.pwc.com/us/en/careers/search-jobs.html', roles: ['software', 'ai', 'data'] },
  { name: 'Rivian', careersUrl: 'https://www.rivian.com/careers', roles: ['software', 'ai', 'data'] },
  { name: 'Robert Bosch', careersUrl: 'https://www.bosch.us/careers/', roles: ['software', 'ai', 'data'] },
  { name: 'RSM', careersUrl: 'https://www.rsmus.com/careers.html', roles: ['software', 'ai', 'data'] },
  { name: 'Salesforce', careersUrl: 'https://www.salesforce.com/careers/', roles: ['software', 'ai', 'data'] },
  { name: 'SAS', careersUrl: 'https://www.sas.com/en_us/careers.html', roles: ['software', 'ai', 'data'] },
  { name: 'Sears', careersUrl: 'https://www.searsholdings.com/careers', roles: ['software', 'it'] },
  { name: 'Siemens', careersUrl: 'https://www.siemens.com/us/en/general/usa.html', roles: ['software', 'ai', 'data'] },
  { name: 'Snap-on', careersUrl: 'https://www.snapon.com/careers', roles: ['software', 'it'] },
  { name: 'Spot AI', careersUrl: 'https://www.spot.ai/careers', roles: ['software', 'ai'] },
  { name: 'State Farm', careersUrl: 'https://www.statefarm.com/careers/', roles: ['software', 'ai', 'data'] },
  { name: 'Target', careersUrl: 'https://corporate.target.com/careers', roles: ['software', 'ai', 'data'] },
  { name: 'Tesla', careersUrl: 'https://www.tesla.com/careers/search/', roles: ['software', 'ai', 'data'] },
  { name: 'TransUnion', careersUrl: 'https://www.transunion.com/careers', roles: ['software', 'ai', 'data'] },
  { name: 'UChicago', careersUrl: 'https://uchicago.edu/careers', roles: ['software', 'ai', 'data'] },
  { name: 'UIPath', careersUrl: 'https://www.uipath.com/careers', roles: ['software', 'ai'] },
  { name: 'United Airlines', careersUrl: 'https://careers.united.com/', roles: ['software', 'ai', 'data'] },
  { name: 'University of Chicago', careersUrl: 'https://uchicago.edu/careers', roles: ['software', 'ai', 'data'] },
  { name: 'US Bank', careersUrl: 'https://www.usbank.com/careers/', roles: ['software', 'ai', 'data'] },
  { name: 'Verisk', careersUrl: 'https://www.verisk.com/careers/', roles: ['software', 'ai', 'data'] },
  { name: 'Walmart', careersUrl: 'https://careers.walmart.com/', roles: ['software', 'ai', 'data'] },
  { name: 'West Monroe', careersUrl: 'https://www.westmonroe.com/careers', roles: ['software', 'it'] },
  { name: 'Wintrust', careersUrl: 'https://www.wintrust.com/careers', roles: ['software', 'it', 'data'] },
  { name: 'World Fuel Services', careersUrl: 'https://www.worldfuel.com/careers/', roles: ['software', 'it'] },
  { name: 'ZS Associates', careersUrl: 'https://www.zs.com/careers', roles: ['software', 'ai', 'data'] },
];

// ─── Scrapfly helpers ───────────────────────────────────────────────────────

async function scrapflyScrape(url, config = {}) {
  const params = new URLSearchParams({
    key: SCRAPFLY_API_KEY,
    url,
    asp: 'true',
    country: 'US',
    ...config
  });

  const response = await fetch(`${SCRAPFLY_BASE}/scrape?${params}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Scrapfly ${response.status}: ${error}`);
  }

  return response.json();
}

// ─── HTML Parsing helpers ───────────────────────────────────────────────────

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(text) {
  const entities = {
    '&nbsp;': ' ', '&nbsp': ' ', '&#160;': ' ', '&#xA0;': ' ', '\u00A0': ' ',
    '&amp;': '&', '&#38;': '&',
    '&lt;': '<', '&#60;': '<', '&#x3C;': '<',
    '&gt;': '>', '&#62;': '>', '&#x3E;': '>',
    '&quot;': '"', '&#34;': '"', '&#x22;': '"',
    '&apos;': "'", '&#39;': "'", '&#x27;': "'",
    '&mdash;': '—', '&#8211;': '–', '&ndash;': '–',
    '&lsquo;': ''', '&rsquo;': ''', '&ldquo;': '"', '&rdquo;': '"',
    '&hellip;': '…', '&#8230;': '…',
    '&copy;': '©', '&reg;': '®', '&trade;': '™',
    '&deg;': '°', '&plusmn;': '±', '&times;': '×', '&divide;': '÷',
    '&cent;': '¢', '&pound;': '£', '&euro;': '€', '&yen;': '¥',
  };
  // First handle numeric/hex entities
  let result = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  // Then handle named entities (case-insensitive)
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), char);
  }
  return result;
}

// ─── Company Career Pages ────────────────────────────────────────────────────
// Note: LinkedIn/Indeed/Glassdoor search pages are JS-gated and don't return job data.
// We scrape company career pages directly instead.

async function scrapeCompanyCareerPages() {
  const jobs = [];
  const seenUrls = new Set();

  for (const company of TARGET_COMPANIES) {
    try {
      const result = await scrapflyScrape(company.careersUrl, {
        render_js: 'true',
        rendering_wait: 5000,
        auto_scroll: 'true'
      });
      const html = result.result?.content || '';
      console.log(`[scrape] ${company.name}: HTML length=${html.length}`);

      // Find all links that look like job posting URLs
      const jobLinkPatterns = [
        /href=["']([^"']*\/job[s]?\/[^"']+)["']/gi,
        /href=["']([^"']*\/position[s]?\/[^"']+)["']/gi,
        /href=["']([^"']*\/careers?\/[^"']*)["']/gi,
      ];

      for (const pattern of jobLinkPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          let jobUrl = match[1];

          // Skip non-job links
          if (jobUrl.includes('javascript') || jobUrl.includes('#')) continue;
          if (!jobUrl.match(/\/job/i) && !jobUrl.match(/\/position/i)) continue;

          // Skip search/browse pages - need actual job detail pages
          if (jobUrl.includes('/search')) continue;

          if (jobUrl.startsWith('/')) {
            try {
              jobUrl = new URL(company.careersUrl).origin + jobUrl;
            } catch {
              continue;
            }
          }

          if (!jobUrl.startsWith('http')) continue;
          if (seenUrls.has(jobUrl)) continue;
          seenUrls.add(jobUrl);

          // Extract title from surrounding context
          const snippetStart = Math.max(0, match.index - 400);
          const snippet = html.slice(snippetStart, match.index + 300);
          const titleMatch = snippet.match(/class=["'][^"']*(?:job[- ]?(?:title|name)|title)[^"']*["'][^>]*>\s*([^<]{5,100})</i) ||
                             snippet.match(/>([^<]{5,100})<\/a>[^<]*(?:job|position)/i) ||
                             snippet.match(/jobTitle[^>]*>\s*([^<]{5,100})/i);
          let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

          // Fallback: extract title from URL slug (e.g., /job/12345/Software-Engineer-Chicago)
          if (!title) {
            const urlSlugMatch = jobUrl.match(/\/job[s]?\/[^\/]+\/(.+?)(?:\/|$|\?)/i);
            if (urlSlugMatch) {
              title = urlSlugMatch[1].replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            }
          }

          // Skip if still no title found
          if (!title) continue;

          // Check if title mentions target roles
          const titleLower = title.toLowerCase();
          const hasTargetRole = company.roles.some(r => titleLower.includes(r));

          // Also check URL for hints
          const urlLower = jobUrl.toLowerCase();
          const urlHasTargetRole = company.roles.some(r => urlLower.includes(r));

          // Include if title/URL suggests target role
          if (hasTargetRole || urlHasTargetRole) {


            jobs.push({
              source: 'direct',
              source_url: jobUrl,
              title: title,
              company_name: company.name,
              location: 'Chicago, IL',
              salary_text: null,
              posted_date: null,
              description: '',
              requirements: '[]'
            });
          }
        }
      }

      console.log(`Company ${company.name}: found job links (total: ${seenUrls.size})`);
    } catch (e) {
      console.error(`Company ${company.name} error:`, e.message);
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  return jobs;
}

// Legacy stubs - job boards don't work due to JS gating
async function scrapeLinkedIn() { return []; }
async function scrapeIndeed() { return []; }
async function scrapeGlassdoor() { return []; }

// ─── Job Detail Scraper ─────────────────────────────────────────────────────

async function scrapeJobDetail(job) {
  if (!job.source_url) return job;

  try {
    const result = await scrapflyScrape(job.source_url, { render_js: 'true', rendering_wait: 3000 });
    const html = result.result?.content || '';

    // Bug 4: Extract salary - look in multiple places including JSON-LD
    let salary = { min: null, max: null, text: null };

    // Try JSON-LD structured data first
    const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1]);
        if (jsonLd.baseSalary) {
          const bs = jsonLd.baseSalary;
          if (typeof bs === 'object') {
            salary.min = bs.minValue || null;
            salary.max = bs.maxValue || null;
            salary.text = bs.value || null;
          }
        }
      } catch {}
    }

    // Check data-salary/data-compensation attributes
    if (!salary.text) {
      const dataSalaryMatch = html.match(/data-(?:salary|compensation|pay)=["']([^"']+)["']/i);
      if (dataSalaryMatch) {
        salary = parseSalary(dataSalaryMatch[1]);
      }
    }

    // Fall back to regex patterns
    if (!salary.text) {
      const salaryPatterns = [
        /\$[\d,]+(?:\s*-\s*\$[\d,]+|\/\s*yr)?/gi,
        /(?:salary|pay|compensation|annual pay)[\s:]*\$[\d,]+[^\n<]{0,200}/i,
        /(?:USD\s*)?\$[\d,]+(?:\s*-\s*\$[\d,]+)?/gi,
      ];
      for (const pattern of salaryPatterns) {
        const match = html.match(pattern);
        if (match) {
          salary = parseSalary(match[0]);
          break;
        }
      }
    }

    // Bug 2: Extract description - capture full content, not truncated at first benefits div
    // Bug 7: Also preserve newlines in description
    const descPatterns = [
      // Pattern 1: Capture full content until the apply section or footer
      /<div[^>]+class=["'][^"']*(?:description|job-description|jobdetail|jd|job-content|job-body)[^"']*["'][^>]*>([\s\S]{500,20000}?)(?=(?:<div[^>]+class=["'][^"']*(?:apply|application|submit)[^"']*["']|<footer|<\\/article))/i,
      // Pattern 2: article tag with broad capture
      /<article[^>]*>([\s\S]{500,25000}?)<(?:aside|footer|nav|div[^>]+class=["'][^"']*(?:apply|application)[^"']*["'])/i,
      // Pattern 3: section-based with longer capture
      /<section[^>]+(?:id|class)=["'][^"']*(?:description|job-description|jobdetail|job-content|about|role)[^"']*["'][^>]*>([\s\S]{500,25000}?)<(?:section|aside|footer|nav|div[^>]+class=["'][^"']*(?:apply|application)[^"']*["'])/i,
    ];
    let description = '';
    for (const pattern of descPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        description = stripHtmlWithNewlines(match[1]);
        break;
      }
    }
    // Fallback: extract body text broadly
    if (!description || description.length < 100) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]{500,20000}?)<\/body>/i);
      if (bodyMatch) {
        description = stripHtmlWithNewlines(bodyMatch[1]);
      }
    }

    // Bug 3: Requirements parsing - remove nav/header/footer/aside from HTML first
    // Bug 6: Also extract benefits section
    const cleanHtml = html
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '');

    // Bug 3: Extract requirements from clean HTML with more negative filters
    const reqPatterns = [
      /<(?:ul|ol)[^>]*class=["'][^"']*(?:qualifications|requirements|skills|experience)[^"']*["'][^>]*>([\s\S]{100,5000}?)<\/(?:ul|ol)>/gi,
      /<li[^>]*class=["'][^"']*(?:qualification|requirement|skill)[^"']*["'][^>]*>([\s\S]{10,500}?)<\/li>/gi,
    ];
    const requirements = [];
    const seenReqs = new Set();
    for (const pattern of reqPatterns) {
      const matches = [...cleanHtml.matchAll(pattern)];
      for (const match of matches) {
        const text = stripHtml(match[1]).trim();
        if (text.length > 15 && text.length < 300 && !seenReqs.has(text) &&
            !text.match(/^(Job|Apply|Career|Amazon|Google|Microsoft|Company|Job categories|My career|Sign\s+in|Account|Categories|Navigation|Browse)/i) &&
            !text.includes('http') && !text.includes('javascript')) {
          seenReqs.add(text);
          requirements.push(text);
        }
      }
    }

    // Bug 6: Extract benefits section
    const benefitsPatterns = [
      /<li[^>]+class=["'][^"']*(?:benefit|perk)[^"']*["'][^>]*>([\s\S]{10,500}?)<\/li>/gi,
      /<(?:ul|ol)[^>]*class=["'][^"']*(?:benefits|perks|what-we-offer)[^"']*["'][^>]*>([\s\S]{100,5000}?)<\/(?:ul|ol)>/gi,
      /<(?:div|p)[^>]*class=["'][^"']*(?:benefits|perks|what-we-offer)[^"']*["'][^>]*>([\s\S]{100,3000}?)(?=<(?:div|p)[^>]+class=["'][^"']*(?:apply|about-us|company)[^"']*["']|<footer)/gi,
    ];
    const benefits = [];
    for (const pattern of benefitsPatterns) {
      const matches = [...cleanHtml.matchAll(pattern)];
      for (const match of matches) {
        const text = stripHtml(match[1]).trim();
        if (text.length > 5 && text.length < 300 && !benefits.includes(text)) {
          benefits.push(text);
        }
      }
    }

    // Bug 1: Extract location - enhance with body text search
    const locationPatterns = [
      /class=["'][^"']*(?:location|job-location|locationValue)[^"']*["'][^>]*>\s*([^<,]{2,80})/i,
      /<li[^>]*>([^<]{2,80}(?:Chicago|IL|IL |Illinois|Remote|Hybrid|Northbrook|Evanston|Skokie|Gurnee)[^<]{0,40})<\/li>/i,
      /(?:location|Location)["\s:]+([^<\n,]{2,80})/i,
    ];
    let extractedLocation = null;
    for (const pattern of locationPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const loc = match[1].replace(/<[^>]+>/g, '').trim();
        if (loc.length > 2) {
          extractedLocation = loc;
          break;
        }
      }
    }

    // Bug 1: Fallback - search description body for explicit location statements
    if (!extractedLocation && description) {
      const bodyLocationMatch = description.match(/(?:based\s+(?:in|near)|location[:]\s*|role\s+is\s+(?:in|near))\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)/i);
      if (bodyLocationMatch && bodyLocationMatch[1]) {
        extractedLocation = bodyLocationMatch[1].trim();
      }
    }

    // Bug 6: Append benefits as delimited section within description
    let finalDescription = description.slice(0, 8000) || job.description;
    if (benefits.length > 0) {
      finalDescription += '\n\n=== BENEFITS ===\n' + benefits.join('\n');
    }

    return {
      ...job,
      location: extractedLocation || job.location,
      salary_text: salary.text,
      salary_min: salary.min,
      salary_max: salary.max,
      description: finalDescription,
      requirements: JSON.stringify(requirements.slice(0, 20))
    };
  } catch (e) {
    console.warn(`Detail scrape error for ${job.source_url}:`, e.message);
    return job;
  }
}

function stripHtmlWithNewlines(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    // First: replace block-level elements with explicit newlines
    .replace(/<\/(p|div|h[1-6]|li|tr|article|section)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    // Then remove remaining tags
    .replace(/<[^>]+>/g, ' ')
    // Decode entities using comprehensive decoder
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    // Clean: collapse spaces but preserve intentional line breaks
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Utilities ─────────────────────────────────────────────────────────────

function hashUrl(url) {
  const normalized = url.split('?')[0].toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function parseSalary(text) {
  if (!text) return { min: null, max: null, text: null };
  const clean = text.replace(/[$,kK]/g, '').trim();
  const numbers = clean.match(/[\d]+/g);
  if (!numbers) return { min: null, max: null, text };
  const vals = numbers.map(n => parseInt(n, 10));
  const isThousands = vals.some(v => v < 500);
  const min = isThousands ? vals[0] * 1000 : vals[0];
  const max = vals.length > 1 ? (isThousands ? vals[1] * 1000 : vals[1]) : min;
  return { min, max, text };
}

function isChicagoland(location) {
  if (!location) return false;
  const loc = location.toLowerCase();
  return CHICAGO_LOCATIONS.some(c => loc.includes(c)) || /\bil\b/i.test(loc);
}

function isRemote(location) {
  if (!location) return false;
  return /\bremote\b/i.test(location);
}

function jobMatchesTarget(job) {
  const loc = (job.location || '').toLowerCase();
  const title = (job.title || '').toLowerCase();
  if (!isChicagoland(loc) && !isRemote(loc)) return false;
  return ROLES.some(r => title.includes(r.toLowerCase()));
}

function upsertCompany(name) {
  const existing = db.prepare('SELECT id FROM companies WHERE name = ?').get(name);
  if (existing) return existing.id;
  const result = db.prepare('INSERT INTO companies (name) VALUES (?)').run(name);
  return result.lastInsertRowid;
}

// ─── Main ─────────────────────────────────────────────────────────────────

export async function scrapeAll(options = {}) {
  const { sources = SOURCES, maxDetailPages = 20, runId = null } = options;
  const allListings = [];

  // Job board sources - these return empty due to JS gating, but kept for compatibility
  if (sources.includes('linkedin')) {
    try {
      const linkedinJobs = await scrapeLinkedIn();
      allListings.push(...linkedinJobs);
    } catch (e) { console.error('LinkedIn scrape failed:', e.message); }
  }

  if (sources.includes('indeed')) {
    try {
      const indeedJobs = await scrapeIndeed();
      allListings.push(...indeedJobs);
    } catch (e) { console.error('Indeed scrape failed:', e.message); }
  }

  if (sources.includes('glassdoor')) {
    try {
      const glassdoorJobs = await scrapeGlassdoor();
      allListings.push(...glassdoorJobs);
    } catch (e) { console.error('Glassdoor scrape failed:', e.message); }
  }

  // Company career pages - primary source
  if (sources.includes('company')) {
    try {
      const companyJobs = await scrapeCompanyCareerPages();
      allListings.push(...companyJobs);
    } catch (e) { console.error('Company career scrape failed:', e.message); }
  }

  console.log(`Total listings before dedup: ${allListings.length}`);

  // Deduplicate
  const seen = new Set();
  const unique = allListings.filter(job => {
    const hash = hashUrl(job.source_url);
    if (seen.has(hash)) return false;
    const existing = db.prepare('SELECT id FROM jobs WHERE url_hash = ?').get(hash);
    if (existing) return false;
    seen.add(hash);
    return true;
  });

  // Filter to Chicagoland / remote relevant roles
  const filtered = unique.filter(j => jobMatchesTarget(j) || isRemote(j.location));
  console.log(`Unique new listings: ${unique.length}, after filter: ${filtered.length}`);

  // Scrape detail pages
  let jobsNew = 0, jobsScored = 0;
  const now = new Date().toISOString();

  for (let i = 0; i < Math.min(filtered.length, maxDetailPages); i++) {
    const listing = filtered[i];

    try {
      const detail = await scrapeJobDetail(listing);
      if (!detail.source_url) continue;

      const companyId = upsertCompany(detail.company_name);
      const urlHash = hashUrl(detail.source_url);
      const salary = (detail.salary_min !== null || detail.salary_max !== null)
        ? { min: detail.salary_min, max: detail.salary_max, text: detail.salary_text }
        : parseSalary(detail.salary_text);

      db.prepare(`
        INSERT INTO jobs (
          source, source_url, url_hash, title, company_name, company_id,
          location, is_remote, salary_min, salary_max, salary_text,
          description, requirements, posted_date, scraped_at,
          is_active, scrape_run_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `).run(
        detail.source, detail.source_url, urlHash, detail.title, detail.company_name, companyId,
        detail.location || 'Chicago, IL', isRemote(detail.location) ? 1 : 0,
        salary.min, salary.max, salary.text || detail.salary_text,
        detail.description || '', detail.requirements || '[]',
        detail.posted_date || null, now, runId
      );

      jobsNew++;

      // Score
      const jobId = db.prepare('SELECT last_insert_rowid() as id').get().id;
      try {
        await scoreJob(jobId, db);
        jobsScored++;
      } catch (e) {
        console.error(`Scoring error for job ${jobId}:`, e.message);
      }

      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error(`Error processing listing:`, e.message);
    }
  }

  return { jobs_found: allListings.length, jobs_new: jobsNew, jobs_scored: jobsScored };
}

export { scrapeLinkedIn, scrapeIndeed, scrapeGlassdoor, scrapeJobDetail, scrapeCompanyCareerPages };
