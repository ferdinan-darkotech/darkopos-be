import db from '../../../../models/view'
import { setDefaultQuery } from '../../../../utils/setQuery'
const sequelize = require('sequelize')
const Op = sequelize.Op
const stocksCategory = db.vw_stock_category

const fullAtributes = [ 'id', 'categoryCode', 'categoryName', 'categoryImage', 'categoryParentId',
'categoryParentCode', 'categoryParentName', 'max_disc', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt' ]

const mode = {
  lov: ['id', 'categoryCode','categoryName', 'max_disc'],
  bf: ['id','categoryCode','categoryName','categoryImage','categoryParentId', 'categoryParentName','max_disc','max_disc_nominal'],
  mf: [
       'id','categoryCode','categoryName','categoryImage','categoryParentId', 'categoryParentCode',
       'categoryParentName', 'categoryParentImage', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt',
       'max_disc', 'max_disc_nominal'
  ]
}

export async function srvGetStocksCategory (query) {
  const { m, items, type, ...other } = query
  let tmpAttrs = mode[m || 'lov']
  let queryDefault = setDefaultQuery(tmpAttrs, { ...other }, !((m || 'lov') === 'lov'))
  queryDefault.where = { 
    ...queryDefault.where,
    ...(type && type === 'parent' ? { categoryparentid: { $eq: null } } : {})
  }
  return stocksCategory.findAndCountAll({
    attributes: mode[m || 'lov'],
    ...queryDefault,
    raw: false,
    order: [['id', 'DESC']]
  })
}

exports.srvGetStocksCategoryByCode = function (categoryCode) {
  return stocksCategory.findOne({
    attributes: fullAtributes,
    where: { categoryCode },
    raw: false
  })
}