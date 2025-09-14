module.exports = {
  database: {
    host: process.env.DB_HOST || 'mysql',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'docker_user',
    password: process.env.DB_PASSWORD || 'docker_pass',
    database: process.env.DB_NAME || 'docker_demo'
  },
  server: {
    port: process.env.PORT || 3000
  }
};
