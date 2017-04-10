import queryUtil from './../../util/queryUtil';

module.exports = {
  getProjections(limit) {
    return `SELECT *
            FROM nba_projections
            LIMIT ${(limit || 1000)};`
  },
  insertProjections(projArr) {
    const insertProjsMap = [
      {propKey: "playerId"},
      {propKey: "gameId"},
      {propKey: "sourceId"},
      {propKey: "mins"},
      {propKey: "pts"},
      {propKey: "reb"},
      {propKey: "ast"},
      {propKey: "stl"},
      {propKey: "blk"},
      {propKey: "tpt"},
      {propKey: "tov"}
    ];

    const projListStr = queryUtil.parseArrOfObjs(projArr, insertProjsMap);

    return `INSERT INTO nba_projections 
            (player_id, game_id, source_id, mins, pts, reb, ast, stl, blk, tpt, tov) VALUES
            ${projListStr};`;
  },
  updateExtraProjectionData(gameDate) {
    return `UPDATE nba_projections pr
            SET (team_id, depth_pos, is_starter) = (pl.current_team, pl.current_depth_pos, pl.is_starter)
            FROM nba_players pl
            WHERE pr.player_id = pl.player_id
            AND pr.team_id IS NULL AND pr.depth_pos IS NULL
            AND pr.game_id IN 
              (SELECT game_id FROM nba_games WHERE game_date='${gameDate}');`
  }
}
