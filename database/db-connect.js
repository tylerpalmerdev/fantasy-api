// import dependencies
import pg from 'pg';
import config from './../config';

// set up & connect to postgres db
const dbConfig = {
  host: config.DB_URL,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PW
};

const pool = new pg.Pool(dbConfig);

export default pool;
