import pool from './../database/db-connect';
import queryUtil from './../util/queryUtil';
import newIdQueries from './../database/queries/newIdQueries';

module.exports = {
  create(req, res) {
    if (!req.body) {
      res.status(400).send("Missing newId data");
    }

    // parse posted projs into sql insert value rows
    const query = newIdQueries.insertSourceIds(req.body);
    queryUtil.connectToDbAndRunQuery(query, res);
  },
  list(req, res) {
    let query = newIdQueries.getNewIds(req.body);
    queryUtil.connectToDbAndRunQuery(query, res);
  },
  delete(req, res) {
    let query = newIdQueries.deleteSourceIds(req.params.playerId);
    // console.log(query)
    // res.json({});
    queryUtil.connectToDbAndRunQuery(query, res);
  }
};