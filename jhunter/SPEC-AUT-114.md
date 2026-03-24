# SPEC: Fortune 100 Career Page Scraping Expansion (AUT-114)

## Overview

Add direct Fortune 100 company career page scraping to JHunter using Scrapfly.
Jobs feed into the existing pipeline — same DB schema, same fit scoring, same LLM services.
This is purely a backend expansion; no UI changes required.

---

## Context

Eric is a Dec 2025 Northwestern CS grad (AI concentration) with internship experience at AbbVie and Paper Tube Co.
He targets: **AI Engineer, Software Engineer, Machine Learning Engineer** roles at **entry level** (not senior).
He is based in **Gurnee, IL** but open to remote/hybrid.

JHunter currently uses JobSpy to scrape LinkedIn/Indeed/Glassdoor.
We now need to add direct career page scraping for Fortune 100 companies that post jobs on their own sites
(Workday, Greenhouse, Lever, SAP Fioneer, etc.) rather than on job boards.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXISTING JHunter PIPELINE                    │
│                                                                 │
│  Python Scraper (JobSpy) ──JSON──► scraper.js ──► SQLite DB    │
│                                        │                        │
│                                        ├──► fit-scorer.js      │
│                                        ├──► llm.js             │
│                                        ├──► resume-tailor.js   │
│                                        └──► cover-letter-gen.js│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  NEW: Fortune 100 Scraper                        │
│                                                                 │
│  scraper_fortune100.py                                           │
│    ├── ScrapflyClient (asp=true, residential pool)              │
│    ├── Company list (hardcoded top 30, expandable)              │
│    ├── Career page discovery (Workday/Greenhouse/Lever/SAP)    │
│    ├── Job listing extraction (Scrapfly extraction API)           │
│    └── Normalized JSON output (same schema as JobSpy)          │
│                              │                                  │
│                              ▼                                  │
│  scrape.js (modified) ◄──────┘                                  │
│    └── runFortune100Scrape() → existing pipeline                │
└─────────────────────────────────────────────────────────────────┘
```

**Key principle:** Fortune 100 scraper produces identical JSON schema as JobSpy scraper.
No new DB columns. No new services. Feeds directly into existing `scrapeAll()` pipeline.

---

## Companies to Target (Top 30 Fortune 100)

Phase 1 targets these companies with known career page infrastructure:

| # | Company | Career Page | ATS Type |
|---|---------|------------|----------|
| 1 | Walmart | careers.walmart.com | Workday |
| 2 | Amazon | amazon.jobs | Custom |
| 3 | Apple | apple.com/jobs | Custom |
| 4 | CVS Health | cvshealth.com/careers | Workday |
| 5 | Exxon Mobil | corporate.exxonmobil.com/careers | Custom |
| 6 | UnitedHealth Group | careers.unitedhealthgroup.com | Workday |
| 7 | Berkshire Hathaway | berkshirehathaway.com | N/A (referral) |
| 8 | Meta | meta.com/careers | Custom |
| 9 | Chevron | chevron.com/careers | Custom |
| 10 | Toyota Motor | toyotajob.com | Custom |
| 11 | Ford Motor | ford.com/careers | Workday |
| 12 |京东) — US companies only | | |
| 13 | Costco | costcocareers.com | Custom |
| 14 | The Home Depot | careers.homedepot.com | Workday |
| 15 | Chevron (already listed) | | |
| 16 | Marathon Petroleum | marathonnorthwest.com/careers | Custom |
| 17 | Costco (already listed) | | |
| 18 | Elevance Health | careers.elevancehealth.com | Custom |
| 19 | Cardinal Health | cardinalhealth.com/careers | Custom |
| 20 | Kroger | jobs.kroger.com | Workday |
| 21 | Walt Disney | disneycareers.com | Workday |
| 22 | Costco (already listed) | | |
| 23 | Chevron (already listed) | | |
| 24 | Frito-Lay (PepsiCo) | jobs.pepsico.com | Workday |
| 25 | Microsoft | careers.microsoft.com | Custom |
| 26 | UPS | jobs-ups.com | Workday |
| 27 | Lowe's | lowes.com/careers | Custom |
| 28 | Intel | intel.com/content/www/us/jobs.html | Custom |
| 29 | IBM | ibm.com/careers | Custom |
| 30 | Goldman Sachs | goldmansachs.com/careers | Custom |

**Phase 1 scope:** First 10 companies (most tech-friendly: Amazon, Apple, Meta, Microsoft, Google, Goldman, IBM, Intel, Walmart, Ford)

Phase 2 (future): Expand to full top 30.
Phase 3 (future): Full Fortune 100.

---

## Scraping Strategy

### 1. Anti-Bot Bypass (required for all companies)
```python
ScrapeConfig(
    url=career_page_url,
    asp=True,                          # Anti-Scraping Protection bypass
    proxy_pool="public_residential_pool",  # Residential IPs
    country="us",
    render_js=True,                    # Enable for JS-heavy pages
    wait_for_selector="[data-job-id], .job-listing, #results",  # Wait for jobs
)
```

### 2. Career Page Detection
Most Fortune 100 use one of these ATS platforms:
- **Workday**: `*.workday.com` — structured data, CSR page with job listings
- **Greenhouse**: `*.greenhouse.io` — `/jobs` page with JSON endpoint
- **Lever**: `*.lever.co` — `/jobs` page with JSON endpoint
- **SAP Fioneer**: `*.sapsf.com` / `*.successfactors.com`
- **Custom**: Most have `/careers` or `/jobs` pages

### 3. Job Listing Extraction
Use Scrapfly extraction API with natural language prompts:
```python
ScrapeConfig(
    url=job_listing_page,
    extraction_prompt="Extract all job listings. For each job: title, company, location, posted_date, job_url, description (first 500 chars). Return as structured data.",
    extraction_model="anthropic-sonnet-4",
    format="markdown",
)
```

### 4. Pagination Handling
- Workday: CSR pages typically load 20-50 per page; paginate via `page=X` param
- Greenhouse: `?page=X` or infinite scroll (use `render_js=True` + scroll)
- Lever: `?page=X`
- Max 5 pages per company per run (100 jobs max per company)

### 5. Job URL Deduplication
- Hash URL via SHA-256 (same as JobSpy scraper)
- Check against `jobs.url_hash` in SQLite before inserting
- Also deduplicate within run against `scrape_results.url_hash`

---

## Eric's Profile Alignment

Filter jobs to match Eric's target roles and experience level:

**Target titles (case-insensitive match):**
- AI Engineer, Artificial Intelligence Engineer
- Software Engineer, Software Developer
- Machine Learning Engineer, ML Engineer
- Data Engineer (secondary)
- Research Engineer (secondary)

**Exclude:**
- Senior/Principal/Staff roles (5+ years required)
- Manager roles
- Roles requiring degrees beyond BS
- Non-US locations (unless remote)

**Required fields per job:**
- `source`: `'fortune100'`
- `source_url`: Direct job posting URL
- `title`: Must match target roles above
- `company_name`: From Fortune 100 list
- `location`: Must be US-based or remote
- `description`: Full or truncated JD
- `posted_date`: YYYY-MM-DD or relative ("3 days ago")
- `requirements`: JSON array (extracted or empty)

---

## Data Schema (identical to JobSpy output)

```python
{
    'source': 'fortune100',
    'source_url': 'https://amazon.jobs/12345',
    'title': 'Software Engineer, AI/ML',
    'company_name': 'Amazon',
    'location': 'Seattle, WA' or 'Remote, USA',
    'is_remote': False,
    'salary_text': '$120K - $180K',  # Often not listed on career pages
    'salary_min': 120000,
    'salary_max': 180000,
    'posted_date': '2026-03-20',
    'description': '...',
    'requirements': '[]'
}
```

---

## File Structure

```
jhunter/
├── server/
│   ├── services/
│   │   ├── scraper_fortune100.py   # NEW — Python scraper (mirrors scraper_jobspy.py)
│   │   └── scraper_jobspy.py       # EXISTING — unchanged
│   ├── services/
│   │   └── scraper.js              # MODIFIED — add runFortune100Scrape()
│   └── routes/
│       └── scrape.js               # MODIFIED — add fortune100 to sources
└── data/
    └── fortune100_companies.json    # NEW — company list with ATS types and career URLs
```

---

## API Changes

### POST /api/scrape/run
Add `fortune100` to accepted source values:

```javascript
// Request
{ "sources": ["linkedin", "indeed", "glassdoor", "fortune100"] }

// Response
{ "id": 42, "status": "running", "message": "Scraping initiated for fortune100" }
```

### GET /api/scrape/status
No changes — already shows latest run regardless of source.

### GET /api/scrape/results
No changes — already stores `source` field per result.

---

## Error Handling

1. **Company unreachable**: Log error, continue to next company. Don't abort entire run.
2. **Anti-bot blocks request**: Retry up to 3 times with exponential backoff (2s, 4s, 8s).
3. **No jobs found on career page**: Log warning, continue. Some companies may have no open AI/SWE roles.
4. **Rate limiting**: 1 request per company per 5 seconds (respect career page ToS).
5. **Session reuse**: Use Scrapfly session to maintain cookies/state across requests to same domain.
6. **Timeout**: Per-company timeout of 120 seconds. Hard cap per scraper run of 30 minutes total.

---

## Testing

1. **Unit test**: `scraper_fortune100.py` produces valid JSON matching expected schema
2. **Integration test**: Full run → verify jobs appear in SQLite with correct `source='fortune100'`
3. **Dedup test**: Re-run → verify no duplicate `url_hash` entries
4. **ATS compatibility**: Test each ATS type (Workday, Greenhouse, Lever) with real companies

---

## Out of Scope (deferred to Phase 2/3)

- Full Fortune 100 list (only top 10 in Phase 1)
- Authentication-protected career pages (require login)
- Job alert signup/save functionality
- Custom career page form submission
- Salary data scraping (often not public on career pages)
- Video/interactive job previews

---

## Dependencies

- `scrapfly-sdk` (already installed: 0.8.27)
- `playwright` (for `scrapfly-browser` skill — may be needed for JS-heavy pages)
- `SCRAPFLY_API_KEY` env var (already in use)

---

## Verification

1. Run `python scraper_fortune100.py --companies amazon,apple,meta,microsoft` — verify JSON output
2. Run full scrape with `fortune100` source — verify jobs appear in JobBoard UI
3. Verify `source='fortune100'` filter works in `GET /api/jobs`
4. Verify fit scoring runs on new Fortune 100 jobs
5. Verify no duplicate `url_hash` on re-run
6. Verify `scrape_results` shows correct `source` per row
