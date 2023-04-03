require('dotenv').config()
module.exports = {
  dbURL: process.env.mongoURL,
  dbName: process.env.dbName
}