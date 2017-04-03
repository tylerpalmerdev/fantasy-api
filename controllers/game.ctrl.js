import pool from './../database/db-connect';
import queryUtil from './../util/queryUtil';
import gameQueries from './../database/queries/gameQueries';

const updateTypeMap = {
  game_date: "date"
}

// const updatePostGameMap = {
//   gameId: {
//     order: 1
//   },
//   awayTeamPts: {
//     order: 2
//   },
//   homeTeamPts: {
//     order: 3
//   },
//   awayTeamInjured: {
//     order: 4,
//     type: "array"
//   },
//   homeTeamInjured: {
//     order: 4,
//     type: "array"
//   },
//   attendance: {
//     order: 5
//   }
// }



module.exports = {
  create(req, res) {
    if (!req.body) {
      res.status(400).send("Missing game data");
    }

    // parse posted games into sql insert value rows
    const insertTypeMap = {
      day_of_week: "string",
      game_slug: "string"
    }

    const gameRows = queryUtil.parseArrToInsert(req.body.games);
    const query = gameQueries.insertGames(gameRows);
    // console.log(query);

    pool.connect((err) => {
        if (err) throw err;
        pool.query(
            query,
            (insertErr, insertRes) => {
            if (insertErr) res.status(500).send({error: insertErr});
            pool.query(
                gameQueries.updateGameSlugData(),
                (updateErr, updateRes) => {
                  if (updateErr) res.status(500).send({error: updateErr});
                  res.status(200).send({"games_added": insertRes.rows.length, "updated": updateRes});
            })
        });
    }); 
  },
  list(req, res) {
    const queryParams = req.query;
    const query = gameQueries.getGames((req.query.game_date || req.query.min_date), req.query.max_date);
    pool.connect((err) => {
        if (err) throw err;
        pool.query(
            query,
            (getErr, getRes) => {
            if (getErr) res.status(500).send({error: getErr});
            res.status(200).json(getRes.rows);
        });
    }); 
  },
  updatePostGame(req, res) {
    if (!req.body) {
      res.status(400).send("Missing game data");
    }

    /*
    req.body will look like this:
    [
      {gameId: 123413, awayTeamPts: 123, homeTeamPts: 111, ..},
      {gameId: 123413, awayTeamPts: 123, homeTeamPts: 111, ..}
    ]
    * NOTE: the objs will not always be posted in order, but need to be for inserting into DB
    */

    const updatePostGameMap = [
      {propKey: "gameId"},
      {propKey: "awayTeamPts"},
      {propKey: "homeTeamPts"},
      {propKey: "awayTeamInjured", type: "array"},
      {propKey: "homeTeamInjured", type: "array"},
      {propKey: "attendance"}
    ];

    const updateGameRowsStr = queryUtil.parseArrOfObjs(req.body, updatePostGameMap);
    const updateGamesQuery = gameQueries.updatePostGameData(updateGameRowsStr);

    console.log("POSTGAME UPDATE QUERY", updateGamesQuery);

    res.status(200).json({gamesUpdated: 35});
  },
  updateGameSpreads(req, res) {
    if (!req.body) {
      res.status(400).send("Missing game data");
    }

    const query = gameQueries.updateGameSpreadData(req.body);
    // console.log("QUERY", query);
    // res.json({});

    queryUtil.connectToDbAndRunQuery(query, res);

  }
};