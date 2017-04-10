import queryUtil from './../../util/queryUtil';

module.exports = {
  insertSourceIds(newIdsArr) {
    const newIdsMap = [
      {propKey: "sourceId"},
      {propKey: "playerId", type: "string"},
      {propKey: "playerName", type: "string"},
      {propKey: "uniqueId", type: "string"}
    ];

    const newIdsStr = queryUtil.parseArrOfObjs(newIdsArr, newIdsMap)
    
    return `INSERT INTO nba_new_ids
            (source_id, new_id, player_name, id) VALUES
            ${newIdsStr}
            ON CONFLICT (id) DO NOTHING;`;
  },
  getNewIds() {
    return `SELECT player_name,
            MAX(CASE WHEN source_id = 1 THEN new_id END) nf_id,
            MAX(CASE WHEN source_id = 2 THEN new_id END) bm_id,
            MAX(CASE WHEN source_id = 3 THEN new_id END) rw_id,
            MAX(CASE WHEN source_id = 4 THEN new_id END) fp_id,
            MAX(CASE WHEN source_id = 5 THEN new_id END) fc_id
            FROM nba_new_ids
            GROUP BY player_name ORDER BY 1;`;
  },
  deleteSourceIds(playerId) {
    return `DELETE FROM nba_new_ids
            WHERE 
              (source_id = 1 AND new_id IN 
                (SELECT nf_id
                FROM nba_players 
                WHERE player_id = ${playerId})
              ) OR (source_id = 2 AND new_id IN 
                (SELECT bm_id
                FROM nba_players 
                WHERE player_id = ${playerId})
              ) OR (source_id = 3 AND new_id IN 
                (SELECT rw_id
                FROM nba_players 
                WHERE player_id = ${playerId})
              ) OR (source_id = 4 AND new_id IN 
                (SELECT fp_id
                FROM nba_players 
                WHERE player_id = ${playerId})
              ) OR (source_id = 5 AND new_id IN 
                (SELECT fc_id
                FROM nba_players 
                WHERE player_id = ${playerId})
              );`;
  }
};
