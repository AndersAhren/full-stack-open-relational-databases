const { rollbackMigration, sequelize } = require('./db')

rollbackMigration()
  .then(() => sequelize.close())
  .catch(async (error) => {
    console.error(error)
    await sequelize.close()
    process.exit(1)
  })
