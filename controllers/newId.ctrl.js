import pool from './../database/db-connect';
import newIdQueries from './../database/queries/newIdQueries';

module.exports = {
  create(req, res) {
    if (!req.body) {
      res.status(400).send("Missing newId data");
    }

    // parse posted projs into sql insert value rows
    const query = newIdQueries.insertNewIds(req.body);
    console.log(query);
    res.status(200).json({});

    // pool.connect((err) => {
    //   if (err) throw err;
    //   pool.query(
    //     query,
    //     (err, result) => {
    //       if (err) res.status(500).send({error: err});
    //       res.status(200).json(result.rows);
    //   });
    // });
  }
};