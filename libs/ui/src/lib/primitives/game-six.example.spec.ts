import {
  GAME_SIX,
  GAME_SIX_BATTING,
  GAME_SIX_PITCHING,
  GAME_SIX_ROSTER,
  GAME_SIX_SCORE_SERIES,
  gameSixAnswer,
} from './game-six.example';

describe('Game 6 archive record', () => {
  it('reconciles the batting lines and inning chart with the final score', () => {
    expect(GAME_SIX_BATTING.reduce((sum, p) => sum + p.runs, 0)).toBe(
      GAME_SIX.home.runs,
    );
    expect(GAME_SIX_BATTING.reduce((sum, p) => sum + p.hits, 0)).toBe(
      GAME_SIX.home.hits,
    );
    expect(GAME_SIX_BATTING.reduce((sum, p) => sum + p.rbi, 0)).toBe(
      GAME_SIX.home.runs,
    );
    expect(GAME_SIX_SCORE_SERIES[0].values.at(-1)).toBe(GAME_SIX.home.runs);
    expect(GAME_SIX_SCORE_SERIES[1].values.at(-1)).toBe(GAME_SIX.away.runs);
  });
  it('accounts for nine defensive innings and the actual ALCS roster', () => {
    expect(GAME_SIX_PITCHING.reduce((sum, p) => sum + p.outs, 0)).toBe(27);
    expect(GAME_SIX_ROSTER).toHaveLength(26);
    expect(new Set(GAME_SIX_ROSTER.map((p) => p.id)).size).toBe(26);
    expect(
      GAME_SIX_ROSTER.filter((p) => p.position === 'Pitcher'),
    ).toHaveLength(12);
    for (const p of [...GAME_SIX_BATTING, ...GAME_SIX_PITCHING]) {
      expect(
        GAME_SIX_ROSTER.some(
          (member) => member.id === p.id && member.name === p.name,
        ),
      ).toBe(true);
    }
  });
  it('answers supported questions and does not invent an answer outside the record', () => {
    expect(gameSixAnswer('Who was in the starting lineup?')).toContain(
      'Yandy Díaz, Jonathan Aranda, Liam Hicks',
    );
    expect(gameSixAnswer('Who recorded the final out?')).toContain(
      'Liam Hicks',
    );
    expect(gameSixAnswer('Who won the ALCS?')).toContain('four games to two');
    expect(gameSixAnswer('Who won the World Series?')).toContain(
      'does not cover the World Series',
    );
    expect(gameSixAnswer('Who won in 2024?')).toContain('other seasons');
    expect(gameSixAnswer('Who was the MVP?')).toContain('0.75 ERA');
    expect(gameSixAnswer('Who drove in the first runs?')).toContain(
      'Richie Palacios',
    );
    expect(gameSixAnswer('Who hit the home runs?')).toContain(
      'Junior Caminero and Yandy Díaz',
    );
    expect(gameSixAnswer('What was the final score?')).toContain(
      'Rays 7, Guardians 3',
    );
    expect(gameSixAnswer('What will the weather be tomorrow?')).toContain(
      'This archive covers Game 6',
    );
  });
  it.each([
    ['Who started at catcher?', 'Liam Hicks'],
    ['Who started in right field?', 'Victor Mesa Jr.'],
    ['Who was the starting first baseman?', 'Jonathan Aranda'],
    ['Who started at second base?', 'Richie Palacios'],
    ['Who started at third base?', 'Junior Caminero'],
    ['Who started at shortstop?', 'Taylor Walls'],
    ['Who was the starting left fielder?', 'Chandler Simpson'],
    ['Who started in centre field?', 'Jonny DeLuca'],
    ['Who started as DH?', 'Yandy Díaz'],
  ])('answers the lineup position in %s', (question, player) => {
    const answer = gameSixAnswer(question);
    expect(answer).toContain(player);
    expect(answer).not.toContain('Freddy Peralta');
  });
  it('keeps starting-pitcher questions distinct from an unspecified starter', () => {
    expect(gameSixAnswer('Who started on the mound?')).toContain(
      'Freddy Peralta',
    );
    expect(gameSixAnswer('Who was the starting pitcher?')).toContain(
      'Freddy Peralta',
    );
    expect(gameSixAnswer('Who started?')).toContain('starting lineup');
  });
});
