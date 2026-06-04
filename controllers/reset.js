const router = require('express').Router()
const { sequelize } = require('../util/db')

router.post('/', async (_req, res) => {
  await sequelize.query('TRUNCATE TABLE sessions, reading_lists, blogs, users RESTART IDENTITY CASCADE')
  res.status(204).end()
})

module.exports = router
