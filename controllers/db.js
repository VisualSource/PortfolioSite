const DATABASE_URL = process.env.DATABASE_URL || "localhost:5432";
const knex = require('knex')({
    client:"pg",
    connection:{
      host:DATABASE_URL,
      user:"postgres",
      password:"root",
      database:"visualsource"
    }
  });

module.exports = knex;