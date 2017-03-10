import queryUtil from './../../util/queryUtil';

module.exports = {
  insertSalaries(salaries) {
    const insertSalariesMap = [
      {propKey: "playerId"},
      {propKey: "gameDate", type: "date"},
      {propKey: "salary"},
      {propKey: "site", type: "string"} // 'FAN_DUEL', 'DRAFT_KINGS'
    ];

    const salariesListStr = queryUtil.parseArrOfObjs(salaries, insertSalariesMap);

    return `INSERT INTO nba_salaries
            (player_id, game_date, salary, site) VALUES
            ${salariesListStr};`;
  },
}
