import pool from './../database/db-connect';
import playerQueries from './../database/queries/playerQueries';

module.exports = {
  create: (req, res) => {
    if (!req.body) {
      res.status(400).send("Missing body data");
    };

    const insertPlayersQuery = playerQueries.insertPlayers(req.body);

    pool.connect(connErr => {
      if (connErr) throw connErr;

      pool.query(
        insertPlayersQuery,
        (queryErr, result) => {
          if (queryErr) throw queryErr;
          res.send(result);
      });
    });
  },
  createIncomplete: (req, res) => {
    if (!req.body) {
      res.status(400).send("Missing body data");
    };

    const insertIncPlayersQuery = playerQueries.insertIncompletePlayers(req.body);

    pool.connect(connErr => {
      if (connErr) throw connErr;

      pool.query(
        insertIncPlayersQuery,
        (queryErr, result) => {
          if (queryErr) throw queryErr;
          res.send(result);
      });
    });
  },
  list: (req, res) => {
    if (!req.body) {
      res.sendStatus(400);
    };

    let limit = req.query.limit;
    let status = req.query.status;

    pool.connect(connErr => {
      if (connErr) throw connErr;
      pool.query(
        playerQueries.getPlayers(limit, status),
        (err, result) => {
          if (err) throw err;
          res.send(result.rows);
      });
    });
  },
  update: (req, res) => {
    if (!req.body) {
      res.status(400).send({err: "No update data"});
    }

    let query = playerQueries.updatePlayer(req.params.playerId, req.body);

    pool.connect((connErr, client, done) => {
      if (connErr) throw connErr;
      pool.query(
        query,
        (err, result) => {
          done();
          if (err) throw err;
          res.send(result);
      });
    });
  },
  updateNotOnRoster: (req, res) => {
    if (!req.body) {
      res.status(400).send({err: "No update data"});
    }

    let query = playerQueries.updateNotOnRoster(req.body);
    // console.log("NOT ON ROSTER", query);
    // res.json({});

    pool.connect((connErr, client, done) => {
      if (connErr) throw connErr;
      pool.query(
        query,
        (err, result) => {
          done();
          if (err) throw err;
          res.send(result);
      });
    });
  },
  updateBio: (req, res) => {
    if (!req.body) {
      res.status(400).send({err: "No update data"});
    }

    let query = playerQueries.updatePlayerBio(req.params.playerId, req.body);

    pool.connect((connErr, client, done) => {
      if (connErr) throw connErr;
      pool.query(
        query,
        (err, result) => {
          done();
          if (err) throw err;
          res.send(result);
      });
    });
  }
};
