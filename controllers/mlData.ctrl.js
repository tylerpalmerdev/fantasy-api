import moment from 'moment';
import pool from './../database/db-connect';
import queryUtil from './../util/queryUtil';
import mlQueries from './../database/queries/mlQueries';

module.exports = {
  list(req, res) {
    if (!req.query || !req.query.game_date || !req.query.stat_type) {
      return res.status(400).send({message: 'Game date and stat type required in query params.'});
    }
    // extract query params from req
    const gameDate = req.query.game_date;
    const statType = req.query.stat_type;
    const isTraining = req.query.is_training;

    // build query
    const query = mlQueries.getModelAiDataForDate(gameDate, statType, isTraining);
    console.log(query);

    queryUtil.connectToDbAndRunQuery(query, res);
  }
};