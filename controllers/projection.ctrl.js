import moment from 'moment';

import pool from './../database/db-connect';
import queryUtil from './../util/queryUtil';
import projectionQueries from './../database/queries/projectionQueries';
import playerQueries from './../database/queries/playerQueries';

module.exports = {
  create(req, res) {
    if (!req.body) {
      res.status(400).send("Missing projection data");
    }

    // parse posted projs into sql insert value rows
    const postQuery = projectionQueries.insertProjections(req.body);
    let projectionsDate;
    // check if a date was passed w/ query params
    if (req.query.gameDate) {
      projectionsDate = req.query.gameDate;
    } else {
      // if not, use today
      projectionsDate = moment().format('YYYY-MM-DD');
    }

    const updateQuery = projectionQueries.updateExtraProjectionData(projectionsDate);

    // https://github.com/brianc/node-pg-pool
    pool
      .connect()
      .then(client => {
        return client
          .query(postQuery)
          .then(() => client);
      })
      .then(client => {
        return client
          .query(updateQuery)
          .then(() => client); // returns client   
      })
      .then(client => {
        client.release();
        res.json({});
      })
      .catch(err => {
        res.status(500).json({error: err.error});
      });
  },
  list(req, res) {

    let limit = (req.query.limit || 1000);

    pool.connect((err) => {
      if (err) throw err;
      pool.query(
        projectionQueries.getProjections(limit),
        (err, result) => {
          if (err) res.status(500).send({error: err});
          console.log("GET RESULT", result.rows);
          res.send(result.rows);
      });
    });
  }
};