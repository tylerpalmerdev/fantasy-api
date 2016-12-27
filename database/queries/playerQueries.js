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
  updatePlayerSourceIds(playerId, updateObj) {

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
  }
}
