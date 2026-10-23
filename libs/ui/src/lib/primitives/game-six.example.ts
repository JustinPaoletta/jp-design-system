// Showcase-only content. Not exported by the published component library.
// Source: MLB Gameday 849815, October 19, 2026. See docs/content/BASEBALL_EXAMPLES.md.
export const GAME_SIX = {
  id: '849815',
  title: '2026 ALCS · Game 6',
  date: '2026-10-19',
  dateLabel: 'October 19, 2026',
  venue: 'Tropicana Field',
  location: 'St. Petersburg, Florida',
  firstPitch: '20:08',
  firstPitchLabel: '8:08 p.m. ET',
  attendance: 40230,
  duration: '2 hours, 55 minutes',
  champions: '2026 American League champions',
  result: 'Rays 7, Guardians 3',
  series: 'Tampa Bay wins the ALCS, 4–2.',
  recap:
    'The pennant belongs to Tampa Bay. The Rays beat Cleveland 7–3 at Tropicana Field to win the 2026 American League Championship Series, four games to two.',
  summary:
    'Richie Palacios opened the scoring with a two-run double. Junior Caminero and Yandy Díaz each hit a two-run home run. Freddy Peralta earned the win and ALCS MVP honors.',
  finalOut:
    'Liam Hicks caught Chase DeLauter’s foul pop for the final out. Bryan Baker retired all three batters in the ninth.',
  boxScoreUrl:
    'https://www.mlb.com/gameday/guardians-vs-rays/2026/10/19/849815/final/box',
  recapUrl: 'https://www.mlb.com/news/rays-win-alcs-2026',
  sourceUrl: 'https://statsapi.mlb.com/api/v1.1/game/849815/feed/live',
  home: { name: 'Tampa Bay Rays', runs: 7, hits: 7, errors: 0 },
  away: { name: 'Cleveland Guardians', runs: 3, hits: 7, errors: 0 },
} as const;

export const GAME_SIX_INNINGS = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
];
// Cumulative score at the end of each inning. Tampa Bay did not bat in the ninth.
export const GAME_SIX_SCORE_SERIES = [
  { id: 'rays', label: 'Rays', values: [0, 2, 3, 3, 3, 3, 5, 7, 7] },
  { id: 'guardians', label: 'Guardians', values: [0, 0, 0, 0, 0, 1, 1, 3, 3] },
];

export const GAME_SIX_BATTING = [
  {
    id: '650490',
    name: 'Yandy Díaz',
    position: 'Designated hitter',
    atBats: 4,
    runs: 1,
    hits: 1,
    rbi: 2,
    homeRuns: 1,
    walks: 0,
  },
  {
    id: '666018',
    name: 'Jonathan Aranda',
    position: 'First base',
    atBats: 4,
    runs: 0,
    hits: 0,
    rbi: 0,
    homeRuns: 0,
    walks: 0,
  },
  {
    id: '689414',
    name: 'Liam Hicks',
    position: 'Catcher',
    atBats: 4,
    runs: 1,
    hits: 1,
    rbi: 0,
    homeRuns: 0,
    walks: 1,
  },
  {
    id: '691406',
    name: 'Junior Caminero',
    position: 'Third base',
    atBats: 3,
    runs: 2,
    hits: 2,
    rbi: 2,
    homeRuns: 1,
    walks: 1,
  },
  {
    id: '802415',
    name: 'Chandler Simpson',
    position: 'Left field',
    atBats: 4,
    runs: 1,
    hits: 1,
    rbi: 0,
    homeRuns: 0,
    walks: 0,
  },
  {
    id: '683748',
    name: 'Victor Mesa Jr.',
    position: 'Right field',
    atBats: 3,
    runs: 1,
    hits: 0,
    rbi: 0,
    homeRuns: 0,
    walks: 1,
  },
  {
    id: '676356',
    name: 'Jonny DeLuca',
    position: 'Center field',
    atBats: 3,
    runs: 0,
    hits: 0,
    rbi: 1,
    homeRuns: 0,
    walks: 0,
  },
  {
    id: '680700',
    name: 'Richie Palacios',
    position: 'Second base',
    atBats: 4,
    runs: 0,
    hits: 2,
    rbi: 2,
    homeRuns: 0,
    walks: 0,
  },
  {
    id: '670764',
    name: 'Taylor Walls',
    position: 'Shortstop',
    atBats: 1,
    runs: 1,
    hits: 0,
    rbi: 0,
    homeRuns: 0,
    walks: 3,
  },
];

export const GAME_SIX_PITCHING = [
  {
    id: '642547',
    name: 'Freddy Peralta',
    innings: '5.1',
    outs: 16,
    hits: 5,
    earnedRuns: 1,
    strikeouts: 3,
    walks: 3,
    pitches: 84,
  },
  {
    id: '592155',
    name: 'Cam Booser',
    innings: '1.2',
    outs: 5,
    hits: 0,
    earnedRuns: 0,
    strikeouts: 0,
    walks: 0,
    pitches: 17,
  },
  {
    id: '669330',
    name: 'Tyler Wells',
    innings: '0.2',
    outs: 2,
    hits: 2,
    earnedRuns: 2,
    strikeouts: 0,
    walks: 0,
    pitches: 11,
  },
  {
    id: '693855',
    name: 'Ian Seymour',
    innings: '0.0',
    outs: 0,
    hits: 0,
    earnedRuns: 0,
    strikeouts: 0,
    walks: 2,
    pitches: 12,
  },
  {
    id: '687330',
    name: 'Kevin Kelly',
    innings: '0.1',
    outs: 1,
    hits: 0,
    earnedRuns: 0,
    strikeouts: 1,
    walks: 0,
    pitches: 3,
  },
  {
    id: '641329',
    name: 'Bryan Baker',
    innings: '1.0',
    outs: 3,
    hits: 0,
    earnedRuns: 0,
    strikeouts: 0,
    walks: 0,
    pitches: 9,
  },
];

export const GAME_SIX_ROSTER = [
  {
    id: '810938',
    name: 'Ben Williamson',
    position: 'Second base',
  },
  {
    id: '811315',
    name: 'Brody Hopkins',
    position: 'Pitcher',
  },
  {
    id: '641329',
    name: 'Bryan Baker',
    position: 'Pitcher',
  },
  {
    id: '592155',
    name: 'Cam Booser',
    position: 'Pitcher',
  },
  {
    id: '656775',
    name: 'Cedric Mullins',
    position: 'Center field',
  },
  {
    id: '802415',
    name: 'Chandler Simpson',
    position: 'Left field',
  },
  {
    id: '642121',
    name: 'Cole Sulser',
    position: 'Pitcher',
  },
  {
    id: '656876',
    name: 'Drew Rasmussen',
    position: 'Pitcher',
  },
  {
    id: '642547',
    name: 'Freddy Peralta',
    position: 'Pitcher',
  },
  {
    id: '643377',
    name: 'Griffin Jax',
    position: 'Pitcher',
  },
  {
    id: '693855',
    name: 'Ian Seymour',
    position: 'Pitcher',
  },
  {
    id: '666018',
    name: 'Jonathan Aranda',
    position: 'First base',
  },
  {
    id: '676356',
    name: 'Jonny DeLuca',
    position: 'Center field',
  },
  {
    id: '622761',
    name: 'Jorge Mateo',
    position: 'Shortstop',
  },
  {
    id: '691406',
    name: 'Junior Caminero',
    position: 'Third base',
  },
  {
    id: '687330',
    name: 'Kevin Kelly',
    position: 'Pitcher',
  },
  {
    id: '689414',
    name: 'Liam Hicks',
    position: 'Catcher',
  },
  {
    id: '663743',
    name: 'Nick Fortes',
    position: 'Catcher',
  },
  {
    id: '607259',
    name: 'Nick Martinez',
    position: 'Pitcher',
  },
  {
    id: '680700',
    name: 'Richie Palacios',
    position: 'Second base',
  },
  {
    id: '668723',
    name: 'Ryan Vilade',
    position: 'Right field',
  },
  {
    id: '571927',
    name: 'Steven Matz',
    position: 'Pitcher',
  },
  {
    id: '670764',
    name: 'Taylor Walls',
    position: 'Shortstop',
  },
  {
    id: '669330',
    name: 'Tyler Wells',
    position: 'Pitcher',
  },
  {
    id: '683748',
    name: 'Victor Mesa Jr.',
    position: 'Right field',
  },
  {
    id: '650490',
    name: 'Yandy Díaz',
    position: 'Designated hitter',
  },
];

export const GAME_SIX_MOMENTS = [
  {
    id: 'palacios',
    title: 'Palacios puts Tampa Bay ahead',
    timeLabel: 'Bottom 2nd',
    dateTime: '2026-10-19',
    description:
      'Richie Palacios doubled home Chandler Simpson and Victor Mesa Jr. Rays 2, Guardians 0.',
  },
  {
    id: 'deluca',
    title: 'DeLuca adds a run',
    timeLabel: 'Bottom 3rd',
    dateTime: '2026-10-19',
    description:
      'Jonny DeLuca’s sacrifice fly brought home Junior Caminero. Rays 3, Guardians 0.',
  },
  {
    id: 'caminero',
    title: 'Caminero goes deep',
    timeLabel: 'Bottom 7th',
    dateTime: '2026-10-19',
    description:
      'Junior Caminero hit a two-run home run with Liam Hicks on base. Rays 5, Guardians 1.',
  },
  {
    id: 'kelly',
    title: 'Kelly stops the rally',
    timeLabel: 'Top 8th',
    dateTime: '2026-10-19',
    description:
      'Kevin Kelly struck out Brayan Rocchio with the bases loaded. Tampa Bay kept a 5–3 lead.',
  },
  {
    id: 'diaz',
    title: 'Díaz makes it 7–3',
    timeLabel: 'Bottom 8th',
    dateTime: '2026-10-19',
    description: 'Yandy Díaz hit a two-run home run with Taylor Walls on base.',
  },
  {
    id: 'final',
    title: 'American League champions',
    timeLabel: 'Top 9th · Final',
    dateTime: '2026-10-19',
    description: GAME_SIX.finalOut,
  },
];

// Read-only answers from this verified record. This example makes no AI or network call.
export function gameSixAnswer(question: string): string {
  if (/world series|202[0-5]|202[7-9]/i.test(question))
    return 'This archive covers the 2026 ALCS clincher. Tampa Bay won the American League pennant in Game 6; this record does not cover the World Series or other seasons.';
  if (/lineup|start.*line/i.test(question))
    return (
      'Tampa Bay’s starting lineup: ' +
      GAME_SIX_BATTING.map((player) => player.name).join(', ') +
      '. Freddy Peralta started on the mound.'
    );
  if (/mvp|pitch|peralta|who started/i.test(question))
    return 'Freddy Peralta allowed one earned run and five hits in 5⅓ innings, with three strikeouts. He won ALCS MVP after a 0.75 ERA over 12 innings in the series.';
  if (/go.ahead|first run|palacios/i.test(question))
    return 'Richie Palacios drove in the first two runs with a double in the second inning. Tampa Bay led the rest of the game.';
  if (/final out|hicks|baker/i.test(question)) return GAME_SIX.finalOut;
  if (/series|champ|pennant|alcs/i.test(question)) return GAME_SIX.recap;
  if (/home run|homer|key play|highlight/i.test(question))
    return GAME_SIX.summary;
  if (/score|summary|summarize|game|win|won/i.test(question))
    return GAME_SIX.result + '. ' + GAME_SIX.summary;
  return 'This archive covers Game 6 of the 2026 ALCS. Ask about the final score, starting lineup, home runs, final out or Freddy Peralta’s pitching.';
}

// Original AI-generated interpretations, not photographs or exact reconstructions.
// See apps/showcase/public/example-illustrations/README.md for the source record.
export const GAME_SIX_ILLUSTRATIONS = {
  celebration: {
    src: 'example-illustrations/game-six/pennant-night.webp',
    alt: 'Cartoon illustration of Rays teammates celebrating the Game 6 win beneath the Tropicana Field dome.',
    caption: 'A pennant to remember · AI-generated illustration',
  },
  finalOut: {
    src: 'example-illustrations/game-six/final-out.webp',
    alt: 'Cartoon illustration of Liam Hicks reaching up to catch the foul pop for the final out.',
    caption: 'The final out · AI-generated illustration',
  },
  peralta: {
    src: 'example-illustrations/game-six/freddy-peralta.webp',
    alt: 'Cartoon portrait of Freddy Peralta smiling broadly in a navy cap and cream jersey.',
    caption: 'Freddy Peralta · AI-generated illustration',
  },
  diaz: {
    src: 'example-illustrations/game-six/yandy-diaz.webp',
    alt: 'Cartoon portrait of Yandy Díaz with short hair and a gray chin goatee, wearing a cream jersey.',
    caption: 'Yandy Díaz · AI-generated illustration',
  },
  caminero: {
    src: 'example-illustrations/game-six/junior-caminero.webp',
    alt: 'Cartoon portrait of Junior Caminero smiling in a navy batting helmet, with a full beard and cream jersey.',
    caption: 'Junior Caminero · AI-generated illustration',
  },
} as const;
