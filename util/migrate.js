const { runMigrations, sequelize } = require('./db')

runMigrations()
  .then(() => sequelize.close())
  .catch(async (error) => {
    console.error(error)
    await sequelize.close()
    process.exit(1)
  })
