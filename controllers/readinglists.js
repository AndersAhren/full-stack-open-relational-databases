const router = require('express').Router()
const { Blog, ReadingList, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    if (!req.body.userId || !req.body.blogId) {
      return res.status(400).json({ error: 'userId and blogId are required' })
    }

    const user = await User.findByPk(req.body.userId)
    const blog = await Blog.findByPk(req.body.blogId)

    if (!blog || !user) {
      return res.status(404).json({ error: 'user or blog not found' })
    }

    const readingList = await ReadingList.create({
      userId: req.body.userId,
      blogId: req.body.blogId
    })

    return res.status(201).json({
      ...readingList.toJSON(),
      blog_id: readingList.blogId,
      user_id: readingList.userId
    })
  } catch (error) {
    return next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)

    if (!readingList) {
      return res.status(404).end()
    }

    if (readingList.userId !== req.user.id) {
      return res.status(401).json({ error: 'only the owner can update this reading list entry' })
    }

    readingList.read = req.body.read
    await readingList.save()

    return res.json(readingList)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
