# Game 6 examples

Storybook and Showcase feature Game 6 of the 2026 American League Championship Series (ALCS).
Tampa Bay beat Cleveland 7–3 on October 19, 2026.
The Rays won the series four games to two.
Use "2026 American League champions" for the title.
Do not call this result a World Series championship.

## Source record

The [shared example record](../../libs/ui/src/lib/primitives/game-six.example.ts) contains the scores, players, statistics, chronology and photo references.
It is not a public component API.
The examples do not request live scores.

The [MLB box score](https://www.mlb.com/gameday/guardians-vs-rays/2026/10/19/849815/final/box) identifies the game as `849815`.
The [MLB data feed](https://statsapi.mlb.com/api/v1.1/game/849815/feed/live) supplies the player statistics and inning scores.
These records were inspected on October 22, 2026.

| Item            | Record                                   |
| --------------- | ---------------------------------------- |
| Home team       | Tampa Bay Rays                           |
| Visiting team   | Cleveland Guardians                      |
| Date            | October 19, 2026                         |
| Venue           | Tropicana Field, St. Petersburg, Florida |
| First pitch     | 8:08 p.m. Eastern Time                   |
| Game duration   | 2 hours, 55 minutes                      |
| Attendance      | 40,230                                   |
| Rays            | 7 runs, 7 hits, 0 errors                 |
| Guardians       | 3 runs, 7 hits, 0 errors                 |
| Winning pitcher | Freddy Peralta                           |
| Losing pitcher  | Shawn Armstrong                          |
| Rays manager    | Kevin Cash                               |
| ALCS MVP        | Freddy Peralta                           |

## Scoring

The chart shows the cumulative score after each inning.
Tampa Bay did not bat in the ninth inning.
The final point retains its seven runs.

| Team      | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |
| --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rays      | 0   | 2   | 3   | 3   | 3   | 3   | 5   | 7   | 7   |
| Guardians | 0   | 0   | 0   | 0   | 0   | 1   | 1   | 3   | 3   |

The [MLB recap](https://www.mlb.com/news/rays-win-alcs-2026) describes the game.
Richie Palacios hit a two-run double in the second inning.
Jonny DeLuca added a sacrifice fly in the third inning.
Junior Caminero hit a two-run home run in the seventh inning.
Yandy Díaz hit a two-run home run in the eighth inning.

Liam Hicks caught Chase DeLauter's foul pop for the final out.
Bryan Baker retired all three batters in the ninth inning.
The [MLB pennant report](https://www.mlb.com/rays/news/rays-reach-world-series-on-18th-anniversary-of-first-al-pennant) records that final play.

## Player statistics

Use game statistics in the batting and pitching tables.
Do not substitute season totals or statistics from another game.
Use the recorded defensive position for this game.
Yandy Díaz was the designated hitter.
Jonathan Aranda played first base.

Peralta pitched 5⅓ innings in Game 6.
He allowed five hits and one earned run, with three strikeouts and three walks.
The pitching table uses baseball notation: `5.1` means 5⅓ innings, not 5.1 decimal innings.
The six Rays pitchers recorded 27 outs.

Peralta's ALCS totals were 12 innings, nine strikeouts and a 0.75 earned run average (ERA).
These are series totals, not Game 6 totals.
See the [MLB MVP report](https://www.mlb.com/rays/news/freddy-peralta-wins-2026-alcs-mvp).

The 26-player ALCS roster contains 12 pitchers and 14 position players.
The position groups contain six infielders, five outfielders, two catchers and one designated hitter.

## Example behavior

Keep component names and API instructions in the Storybook navigation.
Use short action labels, such as "Save game notes" and "Read game details".
Keep the historical score separate from editable personal notes.
Do not invent player injuries, team appointments, quotes or invitations.

The assistant examples answer questions from the shared record.
They do not connect to an AI service.
For questions outside the record, they describe the available topics.

The long table repeats the roster to test 10,000 rows.
Its visible description identifies that repetition.
Row numbers are not baseball statistics.

The calendar includes personal archive reminders with example times.
Those reminders are not official team appointments.
The clock-change example uses November 1, 2026 in Eastern Time.
That date is separate from the game date.

The `.example` email addresses are demonstration values.
They are not team mailboxes.
Keep generic component defaults available to other applications.

## Photographs

The [photo source record](../../apps/showcase/public/example-photos/README.md) identifies each image, creator, date and license.
The included file photographs show Rays players and Tropicana Field on other dates.
None shows Game 6.
Visible captions preserve that distinction.

Keep source and license links beside the photographs.
Keep the file licenses with redistributed copies and screenshot baselines.
The source record also lists actual Game 6 photographs that require a license.
No license for those game photographs has been purchased.
