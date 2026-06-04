require('dotenv').config()

const PORT = process.env.PORT || 3001
const SECRET = process.env.SECRET || 'secret'
const DATABASE_URL = process.env.TESTING === 'true'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL || process.env.TEST_DATABASE_URL

module.exports = {
  PORT,
  SECRET,
  DATABASE_URL,
  TESTING: process.env.TESTING === 'true'
}
