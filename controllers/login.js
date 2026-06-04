const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (req, res) => {
  const { username } = req.body
  const user = await User.findOne({
    where: { username }
  })

  if (!user) {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  if (user.disabled) {
    return res.status(401).json({ error: 'account disabled' })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
    sessionId: crypto.randomUUID()
  }

  const token = jwt.sign(userForToken, SECRET)
  await Session.create({ token, userId: user.id })

  return res.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = router
