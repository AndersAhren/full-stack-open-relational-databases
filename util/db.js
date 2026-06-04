const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('./config')

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or TEST_DATABASE_URL must be set')
}

const useSsl = process.env.DATABASE_SSL === 'true' || DATABASE_URL.includes('aivencloud.com')

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}
})

const migrator = new Umzug({
  migrations: {
    glob: 'migrations/*.js'
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, modelName: 'migrations' }),
  logger: console
})

const runMigrations = async () => {
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((migration) => migration.name)
  })
}

const rollbackMigration = async () => {
  await migrator.down()
}

const connectToDatabase = async () => {
  await sequelize.authenticate()
  await runMigrations()
}

module.exports = {
  sequelize,
  connectToDatabase,
  runMigrations,
  rollbackMigration
}
