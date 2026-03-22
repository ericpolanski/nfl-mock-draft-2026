// NFL 2026 Draft Order - 7 Rounds
// Based on regular season records (placeholder order for mock draft)

export const draftOrder = [
  // Round 1
  { round: 1, pick: 1, teamId: 'chi', position: 1 },
  { round: 1, pick: 2, teamId: 'jax', position: 2 },
  { round: 1, pick: 3, teamId: 'ne', position: 3 },
  { round: 1, pick: 4, teamId: 'cle', position: 4 },
  { round: 1, pick: 5, teamId: 'atl', position: 5 },
  { round: 1, pick: 6, teamId: 'ten', position: 6 },
  { round: 1, pick: 7, teamId: 'nyj', position: 7 },
  { round: 1, pick: 8, teamId: 'car', position: 8 },
  { round: 1, pick: 9, teamId: 'no', position: 9 },
  { round: 1, pick: 10, teamId: 'lv', position: 10 },
  { round: 1, pick: 11, teamId: 'ind', position: 11 },
  { round: 1, pick: 12, teamId: 'pit', position: 12 },
  { round: 1, pick: 13, teamId: 'lar', position: 13 },
  { round: 1, pick: 14, teamId: 'det', position: 14 },
  { round: 1, pick: 15, teamId: 'gb', position: 15 },
  { round: 1, pick: 16, teamId: 'phi', position: 16 },
  { round: 1, pick: 17, teamId: 'wsh', position: 17 },
  { round: 1, pick: 18, teamId: 'min', position: 18 },
  { round: 1, pick: 19, teamId: 'hou', position: 19 },
  { round: 1, pick: 20, teamId: 'nyg', position: 20 },
  { round: 1, pick: 21, teamId: 'ari', position: 21 },
  { round: 1, pick: 22, teamId: 'sea', position: 22 },
  { round: 1, pick: 23, teamId: 'sf', position: 23 },
  { round: 1, pick: 24, teamId: 'lac', position: 24 },
  { round: 1, pick: 25, teamId: 'buf', position: 25 },
  { round: 1, pick: 26, teamId: 'bal', position: 26 },
  { round: 1, pick: 27, teamId: 'cin', position: 27 },
  { round: 1, pick: 28, teamId: 'kc', position: 28 },
  { round: 1, pick: 29, teamId: 'mia', position: 29 },
  { round: 1, pick: 30, teamId: 'den', position: 30 },
  { round: 1, pick: 31, teamId: 'dal', position: 31 },
  { round: 1, pick: 32, teamId: 'tb', position: 32 },

  // Round 2 (similar pattern - higher picks go to worse teams)
  { round: 2, pick: 1, teamId: 'jax', position: 33 },
  { round: 2, pick: 2, teamId: 'chi', position: 34 },
  { round: 2, pick: 3, teamId: 'ten', position: 35 },
  { round: 2, pick: 4, teamId: 'ne', position: 36 },
  { round: 2, pick: 5, teamId: 'cle', position: 37 },
  { round: 2, pick: 6, teamId: 'atl', position: 38 },
  { round: 2, pick: 7, teamId: 'nyj', position: 39 },
  { round: 2, pick: 8, teamId: 'car', position: 40 },
  { round: 2, pick: 9, teamId: 'lv', position: 41 },
  { round: 2, pick: 10, teamId: 'no', position: 42 },
  { round: 2, pick: 11, teamId: 'ind', position: 43 },
  { round: 2, pick: 12, teamId: 'pit', position: 44 },
  { round: 2, pick: 13, teamId: 'det', position: 45 },
  { round: 2, pick: 14, teamId: 'lar', position: 46 },
  { round: 2, pick: 15, teamId: 'gb', position: 47 },
  { round: 2, pick: 16, teamId: 'phi', position: 48 },
  { round: 2, pick: 17, teamId: 'wsh', position: 49 },
  { round: 2, pick: 18, teamId: 'min', position: 50 },
  { round: 2, pick: 19, teamId: 'hou', position: 51 },
  { round: 2, pick: 20, teamId: 'ari', position: 52 },
  { round: 2, pick: 21, teamId: 'nyg', position: 53 },
  { round: 2, pick: 22, teamId: 'sea', position: 54 },
  { round: 2, pick: 23, teamId: 'sf', position: 55 },
  { round: 2, pick: 24, teamId: 'lac', position: 56 },
  { round: 2, pick: 25, teamId: 'bal', position: 57 },
  { round: 2, pick: 26, teamId: 'buf', position: 58 },
  { round: 2, pick: 27, teamId: 'cin', position: 59 },
  { round: 2, pick: 28, teamId: 'mia', position: 60 },
  { round: 2, pick: 29, teamId: 'kc', position: 61 },
  { round: 2, pick: 30, teamId: 'den', position: 62 },
  { round: 2, pick: 31, teamId: 'tb', position: 63 },
  { round: 2, pick: 32, teamId: 'dal', position: 64 },
];

// Generate full draft order (simplified - rounds 3-7)
for (let round = 3; round <= 7; round++) {
  const roundTeams = [...teams].sort(() => Math.random() - 0.5);
  roundTeams.forEach((team, idx) => {
    draftOrder.push({
      round,
      pick: idx + 1,
      teamId: team.id,
      position: (round - 1) * 32 + idx + 1
    });
  });
}

// Temporary teams array for draft order generation
const teams = [
  { id: 'ari' }, { id: 'atl' }, { id: 'bal' }, { id: 'buf' }, { id: 'car' },
  { id: 'chi' }, { id: 'cin' }, { id: 'cle' }, { id: 'dal' }, { id: 'den' },
  { id: 'det' }, { id: 'gb' }, { id: 'hou' }, { id: 'ind' }, { id: 'jax' },
  { id: 'kc' }, { id: 'lv' }, { id: 'lac' }, { id: 'lar' }, { id: 'mia' },
  { id: 'min' }, { id: 'ne' }, { id: 'no' }, { id: 'nyg' }, { id: 'nyj' },
  { id: 'phi' }, { id: 'pit' }, { id: 'sf' }, { id: 'sea' }, { id: 'tb' },
  { id: 'ten' }, { id: 'wsh' }
];

export const getPickAtPosition = (position) => draftOrder.find(p => p.position === position);
export const getTeamNextPick = (teamId) => draftOrder.find(p => p.teamId === teamId && !p.playerId);
