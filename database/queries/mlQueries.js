import queryUtil from './../../util/queryUtil';

module.exports = {
    getModelAiDataForDate(gameDate, statType, isTraining) {
        return `-- SELECT PARAMS (ACTUAL VAL ONLY IF ISTRAINING) --
                SELECT ${isTraining? "s." + statType + ", " : ""}pl.bref_id, pl.player_position,
                ${statType === 'tpt' ? '' : 'nf, '}bm, rw, fp,
                p.depth_pos, p.is_starter,
                t.team_abbrev,
                p.game_id as game_id,
                lg.game_id as last_game_for_team,
                CASE WHEN g.home_team_id = p.team_id THEN TRUE ELSE FALSE END AS is_home,
                CASE WHEN g.home_team_id = p.team_id THEN
                    (SELECT team_abbrev FROM nba_teams WHERE team_id = g.away_team_id) ELSE
                    (SELECT team_abbrev FROM nba_teams WHERE team_id = g.home_team_id) END AS opponent_abbrev,
                CASE WHEN g.home_team_id = p.team_id THEN g.home_spread ELSE -g.home_spread END AS team_spread,
                CASE WHEN g.home_team_id = p.team_id THEN g.home_pred_pts ELSE g.away_pred_pts END AS team_pred_pts,
                g.game_time_24_et, g.day_of_week, t.stadium_capacity, t.tz_hrs_over_utc, t.stadium_lat_n AS home_lat, t.stadium_lng_w AS home_lng,
                ((DATE_PART('year', now()::date) - DATE_PART('year', pl.dob::date)) * 12 +
                (DATE_PART('month', now()::date) - DATE_PART('month', pl.dob::date))) AS age,
                ((DATE_PART('year', now()::date) - DATE_PART('year', pl.debut_date::date)) * 12 +
                (DATE_PART('month', now()::date) - DATE_PART('month', pl.debut_date::date))) AS exp_months,
                pl.height, pl.weight, pl.draft_pick, pl.games_played, pl.current_salary, records.pct as team_winning_pct
                
                --- CORE TABLE: GET PROJECTION DATA BY PLAYER FOR DATE & STAT TYPE --
                FROM (
                    SELECT player_id, game_date, game_id, team_id, depth_pos, is_starter,
                    ${statType === 'tpt' ? '' : 'MAX(CASE WHEN source_id = 1 THEN ' + statType + " END) nf,"}
                    MAX(CASE WHEN source_id = 2 THEN ${statType} END) bm,
                    MAX(CASE WHEN source_id = 3 THEN ${statType} END) rw,
                    MAX(CASE WHEN source_id = 4 THEN ${statType} END) fp
                    FROM nba_projections
                    WHERE game_date = '${gameDate}'
                    GROUP BY player_id, game_date, game_id, team_id, depth_pos, is_starter ORDER BY 1
                ) p

                -- JOIN GAME & PLAYER TABLES FOR DETAILS --
                JOIN nba_games g ON g.game_id = p.game_id
                JOIN nba_players pl ON pl.player_id = p.player_id

                -- GET ACTUAL STATS FOR TRAINING --
                JOIN nba_stats AS s ON s.player_id = p.player_id AND s.game_id = g.game_id

                -- JOIN ON TEAM THAT PLAYER WAS ON AT THE TIME OF THE PROJECTION --
                -- NOTE: WILL GET IN REAL TIME WHEN CALCULATED PROJECTIONS IN REAL TIME --
                LEFT JOIN nba_teams t ON t.team_id = p.team_id

                -- GET LAST GAME FOR TEAM --
                JOIN (
                    SELECT t.team_id as team_id, team_abbrev, g.game_id as game_id, g.game_date
                    FROM nba_teams t
                    JOIN nba_games g
                    ON g.game_id = (
                        SELECT gp.game_id
                        FROM nba_games gp
                        WHERE
                            (gp.away_team_id = t.team_id OR gp.home_team_id = t.team_id)
                            AND gp.game_date < '${gameDate}'
                        ORDER BY gp.game_date DESC
                        LIMIT 1
                    )
                ) as lg ON lg.team_id = p.team_id

                -- GET WINNING PCT FOR TEAMS AT TIME OF GAME --
                JOIN (
                    -- SUBQUERY TO GET WINNING PCT FOR TEAM AS OF GAME DATE: --
                    WITH games_won AS (
                        SELECT
                            CASE WHEN home_team_won
                            THEN home_team_id
                            ELSE away_team_id END AS team_id,
                            count(CASE WHEN home_team_won
                            THEN home_team_id
                                ELSE away_team_id END) AS wins
                        FROM nba_games
                        WHERE game_date < '${gameDate}'
                        GROUP BY team_id
                    )

                    SELECT gw.team_id AS team_id, CAST(ROUND((1.0 * wins) / (1.0 * wins + 1.0 * losses), 3) as REAL) as pct

                    FROM games_won gw

                    JOIN (
                        SELECT
                        CASE WHEN home_team_won THEN away_team_id ELSE home_team_id END AS team_id,
                        count(CASE WHEN home_team_won THEN away_team_id ELSE home_team_id END) AS losses
                        FROM nba_games
                        WHERE game_date < '${gameDate}'
                        GROUP BY team_id
                    ) as gl
                    ON gl.team_id = gw.team_id
                ) AS records ON records.team_id = p.team_id

                -- ONLY PULL VALS WHERE ALL SRCS ARE PRESENT --
                WHERE ${statType === 'tpt' ? '' : 'nf IS NOT NULL AND '}bm IS NOT NULL AND rw IS NOT NULL AND fp IS NOT NULL;`;
    }
};
