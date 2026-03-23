#!/usr/bin/env python3
"""
Scrape scouting reports from nflmockdraftdatabase.com for all prospects.
"""

import json
import os
import re
import time
from scrapfly import ScrapflyClient, ScrapeConfig

def normalize_name_for_url(name):
    """Convert player name to URL-friendly format."""
    # Lowercase and replace spaces/periods with dashes
    name = name.lower()
    name = name.replace(' ', '-').replace('.', '')
    return name

def extract_scouting_report(content):
    """Extract the scouting report section from the page content."""
    # Look for the scouting report section
    if "## Scouting Report" in content:
        # Extract everything after "## Scouting Report"
        start = content.find("## Scouting Report")
        # Find the next ## or the end of the content
        next_section = content.find("##", start + 20)
        if next_section == -1:
            report = content[start + 20:]
        else:
            report = content[start + 20:next_section]

        # Clean up the report
        report = report.strip()

        # Remove duplicate content (often appears twice)
        lines = report.split('\n')
        unique_lines = []
        seen = set()
        for line in lines:
            if line not in seen:
                unique_lines.append(line)
                seen.add(line)

        # Rejoin and clean
        report = '\n'.join(unique_lines)

        # Take only first 2000 chars to keep JSON manageable
        if len(report) > 2000:
            report = report[:2000] + "..."

        return report

    return None

def scrape_scouting_report(client, name, position):
    """Scrape scouting report for a single player."""
    url_name = normalize_name_for_url(name)
    url = f"https://www.nflmockdraftdatabase.com/players/2026/{url_name}"

    try:
        result = client.scrape(ScrapeConfig(
            url=url,
            asp=True,
            render_js=True,
            rendering_wait=3000,
            format="markdown",
            retry=False,  # Disable retry to avoid throttling issues
        ))

        report = extract_scouting_report(result.content)
        if report:
            return report
        else:
            print(f"  No scouting report found for {name}")
            return None

    except Exception as e:
        print(f"  Error scraping {name}: {e}")
        return None

def main():
    # Load prospects
    with open('data/prospects.json', 'r') as f:
        data = json.load(f)

    prospects = data['prospects']
    print(f"Loaded {len(prospects)} prospects")

    # Check which already have scouting reports
    existing_count = sum(1 for p in prospects if p.get('scoutingReport'))
    print(f"Already have scouting reports: {existing_count}")

    # Initialize scrapfly client
    client = ScrapflyClient(key=os.environ["SCRAPFLY_API_KEY"], retry=False)

    # Scrape for prospects missing scouting reports
    needs_scrape = [p for p in prospects if not p.get('scoutingReport')]
    print(f"Need to scrape: {len(needs_scrape)} prospects")

    # Process in batches to avoid rate limiting
    batch_size = 10
    total = len(needs_scrape)

    for i, prospect in enumerate(needs_scrape):
        name = prospect['name']
        position = prospect['position']

        print(f"[{i+1}/{total}] Scraping {name} ({position})...")

        report = scrape_scouting_report(client, name, position)

        if report:
            prospect['scoutingReport'] = report
            print(f"  Got report ({len(report)} chars)")
        else:
            prospect['scoutingReport'] = None
            print(f"  No report")

        # Rate limiting - wait between requests (2 seconds to avoid throttling)
        time.sleep(2)

        # Save progress every 20 players
        if (i + 1) % 20 == 0:
            with open('data/prospects.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"Progress saved at {i+1} players")

    # Final save
    with open('data/prospects.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\nDone! Total prospects: {len(prospects)}")
    print(f"Have scouting reports: {sum(1 for p in prospects if p.get('scoutingReport'))}")

if __name__ == "__main__":
    main()
