const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { User, Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const token = authorization.substring(7)

  try {
    const decodedToken = jwt.verify(token, SECRET)
    const session = await Session.findOne({ where: { token } })
    const user = await User.findByPk(decodedToken.id)

    if (!session || !user || user.disabled) {
      return res.status(401).json({ error: 'session invalid' })
    }

    req.decodedToken = decodedToken
    req.token = token
    req.user = user
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'token invalid' })
  }
}

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _req, res, next) => {
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map((err) => err.message) })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: error.errors.map((err) => err.message) })
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'invalid userId or blogId' })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  }

  console.error(error)
  return next(error)
}

module.exports = {
  tokenExtractor,
  unknownEndpoint,
  errorHandler
}
