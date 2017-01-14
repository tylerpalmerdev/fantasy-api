import queryUtil from './../../util/queryUtil';

module.exports = {
  getStats(limit) {
    return `SELECT *
            FROM nba_stats
            LIMIT ${(limit || 1000)};`
  },
  insertStats(statArr) {
    const insertStatsMap = [
      {propKey: "playerId"},
      {propKey: "gameId"},
      {propKey: "teamId"},
      {propKey: "mins"},
      {propKey: "pts"},
      {propKey: "reb"},
      {propKey: "ast"},
      {propKey: "stl"},
      {propKey: "blk"},
      {propKey: "tpt"},
      {propKey: "tov"}
    ];

    const statListStr = queryUtil.parseArrOfObjs(statArr, insertStatsMap);

    return `INSERT INTO nba_stats
            (player_id, game_id, team_id, mins, pts, reb, ast, stl, blk, tpt, tov) VALUES
            ${statListStr};`;
  }
}
