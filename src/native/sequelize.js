import Sequelize from 'sequelize'
import project from '../../config/project.config'
import * as pg from 'pg'



const sequelize = new Sequelize(project.db_name, project.db_user, project.db_pwd,
  {
    host: project.db_host,
    port: project.db_port,
    dialect: project.db_dialect,
    schema: 'sch_pos',
    searchPath: 'sch_pos',
    dialectOptions: {
      decimalNumbers: true,
      multipleStatements: true,
      prependSearchPath: true
    },
    define: {
      freezeTableName: true,
      timestamps: false
    },
    quoteIdentifiers: false,
    timezone: '+07:00',
    // logging: (msg) => {
    //   if (process.env.DEBUG === 'true') {
    //     console.log(`[Sequelize] ${msg}`);
    //   }
    // },
    camelCase: true,
    pool: {
      max: 100,
      min: 0,
      acquire: 40000,
      idle: 10000
    },
  })
pg.types.setTypeParser(1700, parseFloat)

async function checkConnections () {
  try {
    console.log('\nWait for connecting to database.\n')
    await sequelize.authenticate()
    console.log('\nDatabase has been connected.\n')
  } catch (error) {
    await sequelize.close()
    console.error('\nUnable to connect to the database:', error, '\n')
  }
}

checkConnections()

module.exports = sequelize
