const DATABASE_URL = process.env.DATABASE_URL || "localhost";
const knex = require('knex')({
    client:"pg",
    connection:{
      host: DATABASE_URL,
      user:"postgres",
      password:"root",
      database:"visualsource",
      port: "5433"
    },
    debug: false,
    asyncStackTraces: false
  });
  module.exports = knex;