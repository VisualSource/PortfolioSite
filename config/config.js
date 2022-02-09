module.exports = {
  /**
 * @type {import("sequelize").Config}
 */
  development: {
    dialect: "postgres",
    use_env_variable: "DATABASE_URL",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
