import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import project from '../../../config/project.config'
import sequelize from '../../native/sequelize'

const basename = path.basename(module.filename)
const dbv = {}

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    dbv[model.name] = model
  })

Object.keys(dbv).forEach(modelName => {
  if (dbv[modelName].associate) {
    dbv[modelName].associate(dbv)
  }
})

dbv.sequelize = sequelize
dbv.Sequelize = Sequelize

export default dbv
