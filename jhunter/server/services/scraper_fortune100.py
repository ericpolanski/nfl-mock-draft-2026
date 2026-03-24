#!/usr/bin/env python3
"""
JHunter Fortune 100 Career Page Scraper
Uses Scrapfly to scrape Fortune 100 company career pages.
Outputs normalized job listings as JSON for consumption by the Node.js pipeline.
"""

import json
import sys
import os
import re
import argparse
import signal
import time
from datetime import datetime, timedelta

from scrapfly import ScrapflyClient, ScrapeConfig, ExtractionConfig

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), 'data')
COMPANIES_FILE = os.path.join(DATA_DIR, 'fortune100_companies.json')

SCRAPFLY_API_KEY = os.environ.get('SCRAPFLY_API_KEY', '')
TARGET_ROLES = ['AI Engineer', 'Artificial Intelligence Engineer', 'Software Engineer',
                'Software Developer', 'Machine Learning Engineer', 'ML Engineer',
                'Data Engineer', 'Research Engineer']
EXCLUDE_KEYWORDS = ['Senior', 'Sr.', 'Sr ', 'Principal', 'Staff', 'Manager', 'Lead',
                    'Director', 'Executive', 'Head of', 'VP ', 'Vice President']
MAX_PAGES_PER_COMPANY = 5
RATE_LIMIT_SECONDS = 5


class ScraperTimeout(Exception):
    """Raised when the scraper exceeds its time limit."""
    pass


def load_companies(filepath=None):
    """Load company list from JSON file."""
    filepath = filepath or COMPANIES_FILE
    with open(filepath, 'r') as f:
        return json.load(f)


def normalize_title(title):
    """Normalize job title for matching."""
    return (title or '').strip().lower()


def title_matches_target(title):
    """Check if title matches one of the target roles."""
    if not title:
        return False
    normalized = normalize_title(title)
    for role in TARGET_ROLES:
        if role.lower() in normalized:
            return True
    return False


def title_excluded(title):
    """Check if title should be excluded (senior/manager roles)."""
    if not title:
        return False
    normalized = normalize_title(title)
    for exclude in EXCLUDE_KEYWORDS:
        if exclude.lower() in normalized:
            return True
    return False


def is_remote(location):
    """Check if location indicates remote work."""
    if not location:
        return False
    loc_lower = location.lower()
    return 'remote' in loc_lower or 'work from home' in loc_lower


def normalize_location(location, company_name):
    """Normalize location string."""
    if not location:
        return ''
    location = location.strip()
    if is_remote(location):
        return 'Remote, USA'
    return location


def parse_date(date_str):
    """Parse date string to YYYY-MM-DD format."""
    if not date_str:
        return None

    date_str = str(date_str).strip().lower()

    # Handle relative dates
    try:
        if 'day' in date_str and 'ago' in date_str:
            num = int(''.join(filter(str.isdigit, date_str)) or '1')
            d = datetime.now() - timedelta(days=num)
            return d.strftime('%Y-%m-%d')
        elif 'hour' in date_str and 'ago' in date_str:
            return datetime.now().strftime('%Y-%m-%d')
        elif 'week' in date_str and 'ago' in date_str:
            num = int(''.join(filter(str.isdigit, date_str)) or '1')
            d = datetime.now() - timedelta(weeks=num)
            return d.strftime('%Y-%m-%d')
        elif 'month' in date_str and 'ago' in date_str:
            num = int(''.join(filter(str.isdigit, date_str)) or '1')
            d = datetime.now() - timedelta(days=num * 30)
            return d.strftime('%Y-%m-%d')
    except Exception:
        pass

    # Try direct date parsing
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').strftime('%Y-%m-%d')
    except Exception:
        pass

    return date_str  # Return as-is if can't parse


def extract_jobs_from_content(content, company, job_url_pattern, ats_type):
    """Extract job listings from page content using the extraction API."""
    jobs = []

    if not content:
        return jobs

    extraction_prompt = f"""Extract all job listings from this {company} careers page.
For each job, provide:
- title: The job title
- location: Job location (city, state/country)
- posted_date: When the job was posted (or "recent" if not specified)
- description: Brief description (first 300 chars of job summary)

Return a JSON array of job objects. Example:
[{{"title": "Software Engineer", "location": "Seattle, WA", "posted_date": "2026-03-20", "description": "Join our team to..."}}]

If no jobs found or page shows "no results", return an empty array []."""

    try:
        client = ScrapflyClient(key=SCRAPFLY_API_KEY)

        # Scrape the page first with JS rendering
        scrape_config = ScrapeConfig(
            url=f"https://example.com",  # Will be set per company
            asp=True,
            proxy_pool="public_residential_pool",
            country="us",
            render_js=True,
            wait_for_selector="[data-job-id], .job-listing, .search-result, #results, .job-card",
            format="markdown"
        )

        # Use extraction API on the content
        extraction_config = ExtractionConfig(
            body=content.encode('utf-8') if isinstance(content, str) else content,
            content_type="text/html",
            extraction_prompt=extraction_prompt,
            extraction_model="anthropic-sonnet-4"
        )

        result = client.extract(extraction_config)

        if result.data:
            extracted = result.data
            if isinstance(extracted, str):
                # Parse JSON from the extracted string
                try:
                    extracted = json.loads(extracted)
                except json.JSONDecodeError:
                    # Try to find JSON array in the text
                    match = re.search(r'\[[\s\S]*\]', extracted)
                    if match:
                        extracted = json.loads(match.group())
                    else:
                        return jobs

            if isinstance(extracted, list):
                for item in extracted:
                    title = item.get('title', '')
                    location = item.get('location', '')

                    if title_excluded(title):
                        continue

                    if not title_matches_target(title):
                        continue

                    location = normalize_location(location, company)

                    # Construct job URL (would need actual job ID from listing)
                    job_url = f"{job_url_pattern}" if job_url_pattern else ''

                    jobs.append({
                        'source': 'fortune100',
                        'source_url': job_url,
                        'title': title,
                        'company_name': company,
                        'location': location,
                        'is_remote': is_remote(location),
                        'salary_text': None,
                        'salary_min': None,
                        'salary_max': None,
                        'posted_date': parse_date(item.get('posted_date')),
                        'description': item.get('description', '')[:2000],
                        'requirements': '[]'
                    })
    except Exception as e:
        print(f"[{company}] Extraction error: {e}", file=sys.stderr)

    return jobs


def scrape_company_careers(client, company_data, roles, results_wanted=100):
    """Scrape a single company's career page for all roles."""
    company = company_data['company']
    career_url = company_data['career_url']
    job_url_pattern = company_data.get('job_url_pattern', '')
    ats_type = company_data.get('ats_type', 'custom')

    all_jobs = []

    print(f"[{company}] Starting scrape (ATS: {ats_type})", file=sys.stderr)

    for role in roles:
        for page in range(1, MAX_PAGES_PER_COMPANY + 1):
            try:
                # Build URL with search query
                search_url = f"{career_url}?q={role.replace(' ', '+')}&page={page}"

                scrape_config = ScrapeConfig(
                    url=search_url,
                    asp=True,
                    proxy_pool="public_residential_pool",
                    country="us",
                    render_js=True,
                    wait_for_selector="[data-job-id], .job-listing, .search-result, #results, .job-card, table tbody tr",
                    timeout=30000
                )

                print(f"[{company}] Scraping page {page} for role: {role}", file=sys.stderr)

                result = client.scrape(scrape_config)

                # Extract jobs from the markdown content
                content = result.content
                jobs = extract_jobs_from_content(content, company, job_url_pattern, ats_type)

                if not jobs:
                    print(f"[{company}] No more jobs found on page {page}", file=sys.stderr)
                    break

                print(f"[{company}] Found {len(jobs)} jobs on page {page}", file=sys.stderr)
                all_jobs.extend(jobs)

                if len(all_jobs) >= results_wanted:
                    print(f"[{company}] Reached results limit ({results_wanted})", file=sys.stderr)
                    break

                # Rate limiting
                time.sleep(RATE_LIMIT_SECONDS)

            except Exception as e:
                print(f"[{company}] Error on page {page}: {e}", file=sys.stderr)
                continue

        if len(all_jobs) >= results_wanted:
            break

    # Deduplicate by title + location
    seen = set()
    unique_jobs = []
    for job in all_jobs:
        key = (job['title'].lower(), job['location'].lower())
        if key not in seen:
            seen.add(key)
            unique_jobs.append(job)

    print(f"[{company}] Total unique jobs: {len(unique_jobs)}", file=sys.stderr)
    return unique_jobs


def scrape_all(companies=None, roles=None, results_wanted=100, overall_timeout=1800):
    """Scrape all configured Fortune 100 companies."""
    roles = roles or TARGET_ROLES
    companies = companies or load_companies()

    all_jobs = []
    seen_urls = set()
    start_time = time.time()

    client = ScrapflyClient(key=SCRAPFLY_API_KEY)

    for company_data in companies:
        elapsed = time.time() - start_time
        remaining = overall_timeout - elapsed
        if remaining <= 0:
            print(f"[TIMEOUT] Overall timeout reached, stopping.", file=sys.stderr)
            break

        print(f"[{company_data['company']}] Starting (remaining: {remaining:.0f}s)", file=sys.stderr)

        try:
            jobs = scrape_company_careers(client, company_data, roles, results_wanted)

            for job in jobs:
                url = job['source_url'].split('?')[0].lower() if job['source_url'] else ''
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    all_jobs.append(job)
                elif not url:
                    # Include jobs without URL (dedup by title+location already done)
                    all_jobs.append(job)

            # Rate limiting between companies
            time.sleep(RATE_LIMIT_SECONDS)

        except Exception as e:
            print(f"[{company_data['company']}] Error: {e}", file=sys.stderr)
            continue

    print(f"[TOTAL] Scraped {len(all_jobs)} unique jobs", file=sys.stderr)
    return all_jobs


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='JHunter Fortune 100 Scraper')
    parser.add_argument('--companies',
                        default='',
                        help='Comma-separated company names to scrape (default: all)')
    parser.add_argument('--roles',
                        default='AI Engineer,Software Engineer,Machine Learning Engineer',
                        help='Comma-separated list of roles to search for')
    parser.add_argument('--results-wanted', type=int, default=100,
                        help='Max results per company (default: 100)')
    parser.add_argument('--timeout', type=int, default=1800,
                        help='Overall timeout in seconds (default: 1800 = 30 min)')

    args = parser.parse_args()

    if not SCRAPFLY_API_KEY:
        print("[FATAL] SCRAPFLY_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)

    # Set up overall SIGALRM timeout as a safety net
    def sigalrm_handler(signum, frame):
        print(f"[FATAL] Script killed by SIGALRM after {args.timeout}s", file=sys.stderr)
        sys.exit(1)
    signal.signal(signal.SIGALRM, sigalrm_handler)
    signal.alarm(args.timeout)

    roles = [r.strip() for r in args.roles.split(',')]

    # Load and filter companies
    all_companies = load_companies()
    if args.companies:
        company_names = [c.strip() for c in args.companies.split(',')]
        companies = [c for c in all_companies if c['company'] in company_names]
        if not companies:
            print(f"[ERROR] No matching companies found for: {args.companies}", file=sys.stderr)
            print(f"[ERROR] Available: {[c['company'] for c in all_companies]}", file=sys.stderr)
            sys.exit(1)
    else:
        companies = all_companies

    try:
        jobs = scrape_all(
            companies=companies,
            roles=roles,
            results_wanted=args.results_wanted,
            overall_timeout=args.timeout
        )
        # Cancel alarm since we finished
        signal.alarm(0)
        print(json.dumps(jobs, ensure_ascii=False))
    except Exception as e:
        signal.alarm(0)
        print(f"[FATAL] Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)