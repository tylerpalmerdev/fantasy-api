import pool from './../database/db-connect';
import playerQueries from './../database/queries/playerQueries';
import queryUtil from './../util/queryUtil';

module.exports = {
  create: (req, res) => {
    if (!req.body) {
      res.status(400).send("Missing body data");
    };

    const insertPlayersQuery = playerQueries.insertPlayers(req.body);

    queryUtil.connectToDbAndRunQuery(insertPlayersQuery, res);
  },
  createIncomplete: (req, res) => {
    if (!req.body) {
      res.status(400).send("Missing body data");
    };

    const insertIncPlayersQuery = playerQueries.insertIncompletePlayers(req.body);
    
    queryUtil.connectToDbAndRunQuery(insertIncPlayersQuery, res);
  },
  list: (req, res) => {
    if (!req.body) {
      res.sendStatus(400);
    };

    let limit = req.query.limit;
    let status = req.query.status;
    let query = playerQueries.getPlayers(limit, status)

    queryUtil.connectToDbAndRunQuery(query, res);
  },
  update: (req, res) => {
    if (!req.body) {
      res.status(400).send({err: "No update data"});
    }

    let query = playerQueries.updatePlayer(req.params.playerId, req.body);

    queryUtil.connectToDbAndRunQuery(query, res);
  },
  updateNotOnRoster: (req, res) => {
    if (!req.body) {
      res.status(400).send({err: "No update data"});
    }

    let query = playerQueries.updateNotOnRoster(req.body);
    queryUtil.connectToDbAndRunQuery(query, res);
  },
  updateBio: (req, res) => {
    if (!req.body) {
      res.status(400).send({err: "No update data"});
    }

    let query = playerQueries.updatePlayerBio(req.params.playerId, req.body);
    queryUtil.connectToDbAndRunQuery(query, res);
  },
  listNewSourceIds: (req, res) => {
    let query = playerQueries.listPendingSourceIds();
    queryUtil.connectToDbAndRunQuery(query, res);
  },
  updatePlayerSourceIds: (req, res) => {
    if (!req.body) {
      res.status(400).send({err: "No update data"});
    }

    let query = playerQueries.updatePlayerSourceIds(req.params.playerId, req.body);
    // console.log(query);
    // res.json({});
    queryUtil.connectToDbAndRunQuery(query, res);
  },
  listPendingManualUpdates: (req, res) => {
    let query = playerQueries.getPendingPlayerUpdateCounts();
    queryUtil.connectToDbAndRunQuery(query, res);
  } 
};
