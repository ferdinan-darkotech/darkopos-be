import Sequelize from 'sequelize'

const Op = Sequelize.Op

// clone and modified from { renameObjectKey } from '../utils/operate/objOpr'
// without newKeys
const renameOperator = (obj/* , newKeys */) => {
  const keyValues = Object.keys(obj).map(key => {
    // const newKey = newKeys[key] || key
    const newKey = Op[key] || key
    return { [newKey]: obj[key] }
  })
  return Object.assign({}, ...keyValues)
}

const replaceOperator = (objKey/*, newKeys*/) => {
  let arr = []
  if (objKey.hasOwnProperty('or')) {
    arr = objKey.or.split(',')
    return { [Op.or]: arr.map((x)=> { return { [Op.eq]: x }} ) }
  } return renameOperator(objKey)
}

const remapFilter = (obj) => {
  return Object.keys(obj).map((key) => {
    return { [key]: replaceOperator(obj[key]) }
  })
}

module.exports = { Op, remapFilter }
