// import dependencies
import pg from 'pg';
import config from './../config';

// set up & connect to postgres db
const dbConfig = {
  host: config.DB_URL,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PW,
  max: 10,
  idleTimeoutMillis: 2000 // close idle clients after 2s
};

const pool = new pg.Pool(dbConfig);

//export the query method for passing queries to the pool
module.exports.query = function (text, values, callback) {
  return pool.query(text, values, callback);
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function (callback) {
  return pool.connect(callback);
};


// export default pool;
