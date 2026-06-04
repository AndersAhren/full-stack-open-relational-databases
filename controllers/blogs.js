const { Op } = require('sequelize')
const router = require('express').Router()
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }

  const blogs = await Blog.findAll({
    where,
    order: [['likes', 'DESC']],
    include: {
      model: User,
      attributes: ['name', 'username']
    }
  })

  res.json(blogs)
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    include: {
      model: User,
      attributes: ['name', 'username']
    }
  })

  if (!blog) {
    return res.status(404).end()
  }

  return res.json(blog)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      userId: req.user.id
    })

    return res.status(201).json(blog)
  } catch (error) {
    return next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)

    if (!blog) {
      return res.status(404).end()
    }

    blog.likes = req.body.likes
    await blog.save()

    return res.json(blog)
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (!blog) {
    return res.status(404).end()
  }

  if (blog.userId !== req.user.id) {
    return res.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await blog.destroy()
  return res.status(204).end()
})

module.exports = router
