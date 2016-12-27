import queryUtil from './../../util/queryUtil';

module.exports = {
  insertNewIds(newIdsArr) {
    const newIdsMap = [
      {propKey: "sourceId"},
      {propKey: "playerId", type: "string"},
      {propKey: "playerName", type: "string"}
    ];
    const newIdsStr = queryUtil.parseArrOfObjs(newIdsArr, newIdsMap)
    
    return `INSERT INTO nba_new_ids
            (source_id, new_id, player_name) VALUES
            ${newIdsStr};`;
  }
}
