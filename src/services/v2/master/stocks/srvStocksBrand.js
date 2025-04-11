import db from '../../../../models'
const Op = require('sequelize').Op
const stocksBrand = db.tbl_stock_brand

const fullAttributes = [ 'id', 'brandCode', 'brandName', 'brandImage', 'createdBy', 'createdAt', 'updatedBy',
                         'updatedAt' ]

const mode = {
  lov: ['id','brandCode','brandName'],
  bf: ['id','brandCode','brandName', 'brandImage'],
  mf: ['id','brandCode','brandName', 'brandImage', 'createdBy','createdAt','updatedBy','updatedAt']
}

exports.srvGetStocksBrand = function (query) {
  const { m, page, pageSize, ...other } = query
  let limitQuery = {
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
  }
  const getProperty = Object.getOwnPropertyNames(other)
  let where = {}
  if(getProperty.length > 0) {
    const index = (getProperty.indexOf(mode.lov[0]) + getProperty.indexOf(mode.lov[1])) + 1
    where = index !== -1 ? { [getProperty[index]]: {
      [Op.regexp]: other[getProperty[index]]
    }}  : {}
  }

  const checkMode = (['lov','bf','mf']).indexOf(query.m)
  const attributes = mode[checkMode !== -1 ? query.m : 'mf']
  return stocksBrand.findAndCountAll({
    attributes,    
    where,
    ...(m !== 'lov' ? limitQuery : {}),
    raw: false
  })
}

exports.srvGetStocksBrandByCode = function (brandCode, next) {
  return stocksBrand.findOne({
    attributes: fullAttributes,
    where: { brandCode },
    raw: false
  })
}