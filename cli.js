require('dotenv').config()
const { QueryTypes } = require('sequelize')
const { sequelize } = require('./util/db')

const main = async () => {
  const blogs = await sequelize.query('SELECT * FROM blogs', {
    type: QueryTypes.SELECT
  })

  blogs.forEach((blog) => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
  })

  await sequelize.close()
}

main().catch(async (error) => {
  console.error(error)
  await sequelize.close()
})
