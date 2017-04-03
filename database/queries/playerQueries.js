import queryUtil from './../../util/queryUtil';

module.exports = {
  getPlayers(limit, status) {
    if (status) {
      return `SELECT *
              FROM nba_players
              WHERE status='${status}'
              LIMIT ${(limit || 10000)};`
    } else {
      return `SELECT *
              FROM nba_players
              LIMIT ${(limit || 10000)};`
    }
  },
  insertPlayers(playersArr) {
    const insertPlayersMap = [
      {propKey: "playerName", type: "string"},
      {propKey: "playerPosition", type: "string"},
      {propKey: "team"},
      {propKey: "rw_id"},
      {propKey: "isStarting"},
      {propKey: "inactive"},
      {propKey: "depthPos"},
      {propKey: "currentDepth"},
      {propKey: "status", type: "string"},
      {propKey: "bref_id", type: "string"},
      {propKey: "birthdate", type: "date"},
      {propKey: "debutDate", type: "date"},
      {propKey: "drafted"},
      {propKey: "salary"},
      {propKey: "height"},
      {propKey: "weight"},
      {propKey: "gamesPlayed"}
    ];

    const playersListStr = queryUtil.parseArrOfObjs(playersArr, insertPlayersMap);

    return `INSERT INTO nba_players
            (player_name, player_position, current_team, rw_id, is_starter, 
            inactive, usual_depth_pos, current_depth_pos, status, bref_id, dob, debut_date, 
            draft_pick, current_salary, height, weight, games_played) VALUES
            ${playersListStr}`;
  },
  insertIncompletePlayers(playersArr) {
    const insertIncompletePlayersMap = [
      {propKey: "playerName", type: "string"},
      {propKey: "team"},
      {propKey: "rw_id"},
      {propKey: "isStarting"},
      {propKey: "inactive"},
      {propKey: "depthPos"},
      {propKey: "currentDepth"},
      {propKey: "status", type: "string"}
    ];

    const incompletePlayersListStr = queryUtil.parseArrOfObjs(playersArr, insertIncompletePlayersMap);

    return `INSERT INTO nba_players
            (player_name, current_team, rw_id, is_starter, 
            inactive, usual_depth_pos, current_depth_pos, status) VALUES
            ${incompletePlayersListStr}`;
  },
  updatePlayer(playerId, updateObj) {
    return `UPDATE nba_players
            SET
              current_depth_pos = ${updateObj.currentDepth},
              usual_depth_pos = ${updateObj.depthPos},
              current_team = ${updateObj.team},
              is_starter = ${updateObj.isStarting},
              inactive = ${updateObj.inactive},
              status = '${updateObj.status}'
            WHERE player_id=${playerId};`;
  },
  updateNotOnRoster(playerIdsArr) {
    const playerIdsList = queryUtil.convertArrToForInList(playerIdsArr);

    return `UPDATE nba_players
            SET 
              status = 'NOT_ON_ROSTER',
              current_depth_pos = NULL,
              usual_depth_pos = NULL,
              current_team = NULL,
              is_starter = false,
              inactive = true
              
            WHERE player_id IN ${playerIdsList};`
  },
  updatePlayerBio(playerId, updateObj) {
    return `UPDATE nba_players
            SET
              bref_id = '${updateObj.brefId}',
              height = ${updateObj.height},
              weight = ${updateObj.weight},
              dob = '${updateObj.birthdate}',
              debut_date = '${updateObj.debutDate}',
              draft_pick = ${updateObj.drafted},
              games_played = ${updateObj.gamesPlayed},
              current_salary = ${updateObj.salary},
              player_position = '${updateObj.playerPosition}',
              status = 'PENDING'
            WHERE player_id=${playerId};`;
  },
  listPendingSourceIds() {
    return `SELECT player_name,
            MAX(CASE WHEN source_id = 1 THEN new_id END) nf,
            MAX(CASE WHEN source_id = 2 THEN new_id END) bm,
            MAX(CASE WHEN source_id = 3 THEN new_id END) rw,
            MAX(CASE WHEN source_id = 4 THEN new_id END) fp,
            MAX(CASE WHEN source_id = 5 THEN new_id END) fc
            FROM nba_new_ids
            GROUP BY player_name ORDER BY 1;`;
  },
  updatePlayerSourceIds(playerId, updateObj) {
    return `UPDATE nba_players
            SET
              nf_id = ${updateObj.nf_id ? "'" + updateObj.nf_id + "'" : 'NULL'},
              rw_id = ${updateObj.rw_id ? "'" + updateObj.rw_id + "'" : 'NULL'},
              bm_id = ${updateObj.bm_id ? "'" + updateObj.bm_id + "'" : 'NULL'},
              fp_id = ${updateObj.fp_id ? "'" + updateObj.fp_id + "'" : 'NULL'},
              fc_id = ${updateObj.fc_id ? "'" + updateObj.fc_id + "'" : 'NULL'}
            WHERE player_id=${playerId};`;
  },
  getPendingPlayerUpdateCounts() {
    return `SELECT  (
              SELECT count(*) FROM 
                (
                SELECT player_name,
                MAX(CASE WHEN source_id = 1 THEN new_id END) nf_id,
                MAX(CASE WHEN source_id = 2 THEN new_id END) bm_id,
                MAX(CASE WHEN source_id = 3 THEN new_id END) rw_id,
                MAX(CASE WHEN source_id = 4 THEN new_id END) fp_id,
                MAX(CASE WHEN source_id = 5 THEN new_id END) fc_id
                FROM nba_new_ids
                GROUP BY player_name ORDER BY 1
                ) AS grouped_source_ids
              ) AS new_source_id_players,
              (
              SELECT count(*)
              FROM nba_players
              WHERE status = 'INCOMPLETE'
              ) AS incomplete_players;`
  }
}
