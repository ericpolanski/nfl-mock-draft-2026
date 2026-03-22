# SPEC-AUT-23: Fix Draft Order with Actual 2026 NFL Draft Order

## Overview
Update the draft-order.json file to use the actual 2026 NFL Draft order from real-draft-order.json.

## Data Source
- File: `/home/eric/ai-company/projects/nfl-mock-draft-2026/data/real-draft-order.json`
- Source: NFL.com (scraped 2026-03-22)
- Contains Round 1 picks with full team names

## Round 1 Mapping (Team Name → Team ID)
| Pick | Team Name | Team ID |
|------|-----------|---------|
| 1 | Las Vegas Raiders | lv |
| 2 | New York Jets | nyj |
| 3 | Arizona Cardinals | ari |
| 4 | Tennessee Titans | ten |
| 5 | New York Giants | nyg |
| 6 | Cleveland Browns | cle |
| 7 | Washington Commanders | was |
| 8 | New Orleans Saints | no |
| 9 | Kansas City Chiefs | kc |
| 10 | Cincinnati Bengals | cin |
| 11 | Miami Dolphins | mia |
| 12 | Dallas Cowboys | dal |
| 13 | Los Angeles Rams (from Falcons) | lar |
| 14 | Baltimore Ravens | bal |
| 15 | Tampa Bay Buccaneers | tb |
| 16 | New York Jets (from Colts) | nyj |
| 17 | Detroit Lions | det |
| 18 | Minnesota Vikings | min |
| 19 | Carolina Panthers | car |
| 20 | Dallas Cowboys (from Packers) | dal |
| 21 | Pittsburgh Steelers | pit |
| 22 | Los Angeles Chargers | lac |
| 23 | Philadelphia Eagles | phi |
| 24 | Cleveland Browns (from Jaguars) | cle |
| 25 | Chicago Bears | chi |
| 26 | Buffalo Bills | buf |
| 27 | San Francisco 49ers | sf |
| 28 | Houston Texans | hou |
| 29 | Kansas City Chiefs (from Rams) | kc |
| 30 | Miami Dolphins (from Broncos) | mia |
| 31 | New England Patriots | ne |
| 32 | Seattle Seahawks | sea |

## Implementation Notes
- Only Round 1 data exists in real-draft-order.json
- Round 2-7 in draft-order.json may remain as-is or need future updates
- The team ID mapping can be verified against teams.json

## Acceptance Criteria
- [ ] Round 1 of draft-order.json matches the actual 2026 NFL Draft order
- [ ] All team names from real-draft-order.json correctly map to team IDs
- [ ] App loads without errors after update
