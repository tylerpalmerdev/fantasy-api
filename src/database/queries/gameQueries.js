import queryUtil from './../../util/queryUtil';

module.exports = {
  getGames(dateOrMinDate, maxDate) {
    let getDateOrRange = (gameOrMinDate, maxDate) => {
      if (!gameOrMinDate) {
        return "";
      } else if (gameOrMinDate && !maxDate) {
        return `WHERE game_date=to_date('${gameOrMinDate}', 'YYYY-MM-DD')`;
      } else if (gameOrMinDate && maxDate) {
        return `WHERE game_date BETWEEN to_date('${gameOrMinDate}', 'YYYY-MM-DD')
                AND to_date('${maxDate}', 'YYYY-MM-DD')`;
      }
    }
    
    return `SELECT game_id, away_team_id, home_team_id, bref_slug
            FROM nba_games
            ${getDateOrRange(dateOrMinDate, maxDate)}
            ORDER BY game_date DESC;`;
  },
  insertGames(gameListStr) {
    return `INSERT INTO nba_games 
            (game_date, game_time_24_et, day_of_week, away_team_id, home_team_id) VALUES
            ${gameListStr};`;
  },
  updatePostGameData(updateListStr) {
    return `UPDATE nba_games AS g
            SET
              away_team_pts = u.away_team_pts,
              home_team_pts = u.home_team_pts,
              away_team_injured = u.away_team_injured,
              home_team_injured = u.home_team_injured,
              attendance = u.attendance,
              home_team_won = (CASE WHEN (u.home_team_pts > u.away_team_pts) THEN TRUE ELSE FALSE END),
              over_under = (CASE WHEN (u.home_team_pts + u.away_team_pts) > g.total_pred THEN 'O' ELSE 'U' END)
            FROM (VALUES${updateListStr}) 
            AS u(game_id, away_team_pts, home_team_pts, away_team_injured, home_team_injured, attendance)
            WHERE u.game_id = g.game_id;`
  },
  updateGameSlugData() {
    return `UPDATE nba_games
            SET game_slug = to_char(game_date, 'YYYY-MM-DD') || '_' || away_team_id || '_' || home_team_id
            WHERE game_slug IS NULL`;
  },
  updateGameSpreadData(spreads) {
    const gameSpreadsMap = [
      {propKey: "gameId"},
      {propKey: "homeSpread"},
      {propKey: "total"},
      {propKey: "awayPredPts"},
      {propKey: "homePredPts"}
    ];

    const updateSpreadsStr = queryUtil.parseArrOfObjs(spreads, gameSpreadsMap);

    return `UPDATE nba_games AS g
            SET
              home_spread = u.home_spread,
              total_pred = u.total_pred,
              away_pred_pts = u.away_pred_pts,
              home_pred_pts = u.home_pred_pts
            FROM (VALUES${updateSpreadsStr}) 
            AS u(game_id, home_spread, total_pred, away_pred_pts, home_pred_pts)
            WHERE u.game_id = g.game_id;`
  }
}
