// UserDatabaseConfiguration.js
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/../env/.env" });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

module.exports = config;
