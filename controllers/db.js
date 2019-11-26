const DATABASE_URL = process.env.DATABASE_URL;
const DEV = process.env.DEV;

const conn = DEV ? {
  connectionString: DATABASE_URL,
  ssl: true
} : {
  host: "localhost",
  user:"postgres",
  password:"root",
  database:"visualsource",
  port: "5433"
};
const knex = require('knex')({
    client:"pg",
    connection: conn,
    debug: false,
    asyncStackTraces: false
  });
  module.exports = knex;