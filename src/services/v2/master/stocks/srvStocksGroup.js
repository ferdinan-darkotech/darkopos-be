// [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
import db from '../../../../models/view'
import { setDefaultQuery } from '../../../../utils/setQuery'
const sequelize = require('sequelize')
const Op = sequelize.Op
const stocksGroup = db.vw_stock_group

const fullAtributes = [ 'id', 'groupCode', 'groupName', 'groupImage', 'groupParentId',
'groupParentCode', 'groupParentName', 'max_disc', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt' ]

const mode = {
  lov: ['id', 'groupCode','groupName', 'max_disc'],
  bf: ['id','groupCode','groupName','groupImage','groupParentId', 'groupParentName','max_disc','max_disc_nominal'],
  mf: [
       'id','groupCode','groupName','groupImage','groupParentId', 'groupParentCode',
       'groupParentName', 'groupParentImage', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt',
       'max_disc', 'max_disc_nominal'
  ]
}

export async function srvGetStocksGroup (query) {
  const { m, items, type, ...other } = query
  let tmpAttrs = mode[m || 'lov']
  let queryDefault = setDefaultQuery(tmpAttrs, { ...other }, !((m || 'lov') === 'lov'))
  queryDefault.where = { 
    ...queryDefault.where,
    ...(type && type === 'parent' ? { groupparentid: { [Op.eq]: null } } : {})
  }
  return stocksGroup.findAndCountAll({
    attributes: mode[m || 'lov'],
    ...queryDefault,
    raw: false,
    order: [['id', 'DESC']]
  })
}

exports.srvGetStocksGroupByCode = function (groupCode) {
  return stocksGroup.findOne({
    attributes: fullAtributes,
    where: { groupCode },
    raw: false
  })
}