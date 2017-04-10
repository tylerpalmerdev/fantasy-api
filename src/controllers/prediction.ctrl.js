import queryUtil from './../util/queryUtil';
import predictionQueries from './../database/queries/predictionQueries';

module.exports = {
  create(req, res) {
    if (!req.body || !req.body.predictions) {
      res.status(400).send("Missing prediction data");
    }

    const finalPredictions = req.body.predictions.map(elem => {
      elem.predictionSrc = req.body.source;
      elem.gameDate = req.body.gameDate;
      elem.statType = req.body.statType;
      return elem;
    });

    const query = predictionQueries.insertPredictions(finalPredictions);

    queryUtil.connectToDbAndRunQuery(query, res);
  },
  list(req, res) {
    if (!req.query || !req.query.date || !req.query.source) {
      res.status(400).send("Missing query params");
    }

    const query = predictionQueries.getFanDuelPredActualForDate(req.query.date, req.query.source);

    queryUtil.connectToDbAndRunQuery(query, res);
  }
};