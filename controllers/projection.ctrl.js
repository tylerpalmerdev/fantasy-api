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
    const query = projectionQueries.insertProjections(req.body);
    const today = moment().format('YYYY-MM-DD');
    // console.log(query);
    // res.status(200).json({"added": 434});
    queryUtil.connectToDbAndRunQuery(query, res);

    // pool.connect((err) => {
    //   if (err) throw err;
    //   pool.query(
    //     query,
    //     (insertErr, insertRes) => {
    //       if (insertErr) res.status(500).send({error: insertErr});
    //       // update projs you just entered w/ supplemental data
    //       pool.query(
    //           projectionQueries.updateExtraProjectionData(today)),
    //           (updateErr, updateRes) => {
    //               if (updateErr) res.status(500).send({error: updateErr});
    //               res.status(200).send({"added": insertRes.rows.length, "updated": updateRes});
    //           }
    //     });
    // });
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