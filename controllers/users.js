const router = require('express').Router()
const { Blog, User } = require('../models')

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['id', 'title', 'author', 'url', 'likes', 'year']
    }
  })

  res.json(users)
})

router.get('/:id', async (req, res) => {
  const include = {
    model: Blog,
    as: 'readings',
    attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
    through: {
      attributes: ['id', 'read']
    }
  }

  if (req.query.read === 'true' || req.query.read === 'false') {
    include.through.where = {
      read: req.query.read === 'true'
    }
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include
  })

  if (!user) {
    return res.status(404).end()
  }

  return res.json(user)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username
    })

    return res.status(201).json(user)
  } catch (error) {
    return next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })

    if (!user) {
      return res.status(404).end()
    }

    user.name = req.body.name
    await user.save()

    return res.json(user)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
