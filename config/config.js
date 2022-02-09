module.exports = {
  /**
 * @type {import("sequelize").Config}
 */
  development: {
    dialect: "postgres",
    use_env_variable: "DATABASE_URL",
  },
  /**
   * @type {import("sequelize").Config}
   */
  production: {
    logging: false,
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: true
    }
  }
}
