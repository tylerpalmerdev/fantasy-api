WITH clean_proj AS (
  SELECT player_id, game_date, game_id, team_id, depth_pos, is_starter,
  MAX(CASE WHEN source_id = 1 THEN pts END) nf,
  MAX(CASE WHEN source_id = 2 THEN pts END) bm,
  MAX(CASE WHEN source_id = 3 THEN pts END) rw,
  MAX(CASE WHEN source_id = 4 THEN pts END) fp
  FROM nba_projections
  WHERE game_date = '2015-11-22'
  GROUP BY player_id, game_date, game_id, team_id, depth_pos, is_starter ORDER BY 1
)
SELECT pl.bref_id, pl.player_position,
  nf, bm, rw, fp,
  p.depth_pos, p.is_starter,
  t.team_abbrev,
  CASE WHEN g.home_team_id = p.team_id THEN TRUE ELSE FALSE END AS is_home,
  CASE WHEN g.home_team_id = p.team_id THEN g.away_team_id ELSE g.home_team_id END AS opponent_id,
  g.game_time_24_et, g.day_of_week, t.stadium_capacity, t.tz_hrs_over_utc,
  ((DATE_PART('year', now()::date) - DATE_PART('year', pl.dob::date)) * 12 +
  (DATE_PART('month', now()::date) - DATE_PART('month', pl.dob::date))) AS age,
  ((DATE_PART('year', now()::date) - DATE_PART('year', pl.debut_date::date)) * 12 +
  (DATE_PART('month', now()::date) - DATE_PART('month', pl.debut_date::date))) AS exp,
  pl.height, pl.weight, pl.draft_pick, pl.games_played, pl.current_salary
FROM clean_proj p
  JOIN nba_games g ON g.game_id = p.game_id
  JOIN nba_players pl ON pl.player_id = p.player_id
  LEFT JOIN nba_teams t ON t.team_id = p.team_id
  LEFT JOIN nba_teams t2 ON t2.team_id = g.away_team_id
WHERE nf IS NOT NULL AND bm IS NOT NULL AND rw IS NOT NULL AND fp IS NOT NULL;