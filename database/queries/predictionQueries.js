import queryUtil from './../../util/queryUtil';

module.exports = {
  getFanDuelPredActualForDate(date, src) {
      return `SELECT pr.player_bref_id, pr.game_date, pl.player_position, act.mins,
              (pr.pts + 1.2 * pr.reb + 1.5 * pr.ast + 2 * pr.stl + 2 * pr.blk - pr.tov) as pred_pts,
              ((pr.pts + 1.2 * pr.reb + 1.5 * pr.ast + 2 * pr.stl + 2 * pr.blk - pr.tov) / (s.salary / 1000)) as value,
              CAST((act.pts + 1.2 * act.reb + 1.5 * act.ast + 2 * act.stl + 2 * act.blk - act.tov) as float) as actual_pts,
              s.salary as salary

              FROM (
                SELECT
                  player_bref_id,
                  game_date,
                  MAX(CASE WHEN stat_type = 'pts'
                    THEN prediction END) pts,
                  MAX(CASE WHEN stat_type = 'reb'
                    THEN prediction END) reb,
                  MAX(CASE WHEN stat_type = 'ast'
                    THEN prediction END) ast,
                  MAX(CASE WHEN stat_type = 'stl'
                    THEN prediction END) stl,
                  MAX(CASE WHEN stat_type = 'blk'
                    THEN prediction END) blk,
                  MAX(CASE WHEN stat_type = 'tov'
                    THEN prediction END) tov,
                  MAX(CASE WHEN stat_type = 'tpt'
                    THEN prediction END) tpt
                FROM nba_predictions
                WHERE game_date = '${date}' AND source = '${src}'
                GROUP BY player_bref_id, game_date, source
                ORDER BY 1
              ) AS pr

              JOIN nba_players pl
                ON pl.bref_id = pr.player_bref_id

              JOIN (
                  SELECT
                    st.*,
                    g.game_date
                  FROM nba_stats st
                    JOIN nba_games g ON g.game_id = st.game_id
                  ) as act ON act.player_id = pl.player_id AND act.game_date = pr.game_date

              JOIN nba_salaries s
                ON s.game_date = pr.game_date AND s.player_id = pl.player_id

              WHERE pr.pts IS NOT NULL 
                    AND pr.reb IS NOT NULL 
                    AND pr.ast IS NOT NULL 
                    AND pr.stl IS NOT NULL
                    AND pr.blk IS NOT NULL
                    AND pr.tov IS NOT NULL;`
  },
  insertPredictions(predictions) {
    const insertPredictionsMap = [
      {propKey: "predictionSrc", type: "string"},
      {propKey: "gameDate", type: "date"},
      {propKey: "statType", type: "string"},
      {propKey: "Scored Labels"},
      {propKey: "bref_id", type: "string"}
    ];

    const predictionsListStr = queryUtil.parseArrOfObjs(predictions, insertPredictionsMap);

    return `INSERT INTO nba_predictions
            (source, game_date, stat_type, prediction, player_bref_id) VALUES
            ${predictionsListStr};`;
  },
}
