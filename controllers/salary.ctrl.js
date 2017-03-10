import queryUtil from './../util/queryUtil';
import salaryQueries from './../database/queries/salaryQueries';

module.exports = {
  create(req, res) {
    if (!req.body) {
      res.status(400).send("Missing prediction data");
    }

    const query = salaryQueries.insertSalaries(req.body);
    // console.log(query);

    queryUtil.connectToDbAndRunQuery(query, res);
  }
};