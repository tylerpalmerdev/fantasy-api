import moment from 'moment';

import pool from './../database/db-connect';
import queryUtil from './../util/queryUtil';
import statQueries from './../database/queries/statQueries';
import playerQueries from './../database/queries/playerQueries';

module.exports = {
  create(req, res) {
    if (!req.body || !req.body.length) {
      res.status(400).send("Missing stats data");
    }

    // parse posted projs into sql insert value rows
    const query = statQueries.insertStats(req.body);
    queryUtil.connectToDbAndRunQuery(query, res);
  },
  list(req, res) {

    let limit = (req.query.limit || 1000);
    const query = statQueries.getStats(limit);

    // queryUtil.connectToDbAndRunQuery(query, res);
  }
};