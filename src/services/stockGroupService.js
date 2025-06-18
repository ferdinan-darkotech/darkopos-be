import db from '../models'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import sequelize from '../native/sequelize'
import { getNativeQuery } from '../native/nativeUtils'
import native from '../native/product/sqlStockGroup'
import moment from 'moment'
import { Op } from 'sequelize'

const stringSQL = {
  s00001: native.sqlGroupProducts
}

let StockGroup = db.tbl_stock_group
let vwStockGroup = dbv.vw_stock_group

export function getStockGroupByCode (groupCode) {
  return vwStockGroup.findOne({
    where: { groupCode },
    raw: false
  })
}

export function getStockGroupsData (query) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { [Op.between]: query[key] }
    }
  }
  if (!isEmpty(query)) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'groupCode')
      query = JSON.parse(str)
    }
    return vwStockGroup.findAll({
      where: query
    })
  } else {
    return vwStockGroup.findAll()
  }
}
export function getStockGroupsParent (id) {
  if (id) {
    return vwStockGroup.findAll({
      where: {
        groupParentId: {
          [Op.ne]: id
        },
        id: {
          [Op.ne]: id
        }
      },
    })
  } else if (!id) {
    return vwStockGroup.findAll()
  }
}
export function checkParent (id) {
  // const data = vwStockGroup.findAll({
  //   where: {
  //     groupParentId: id,
  //   }
  // })
  // if (data.length > 0) return false
  // return true
  return vwStockGroup.findAll({
    where: {
      groupParentId: id,
    }
  })
}

export function setStockGroupInfo (request) {
  const getStockGroupInfo = {
    id: request.id,
    groupCode: request.groupCode,
    groupName: request.groupName,
    groupImage: request.groupImage,
    groupParentId: request.groupParentId
  }

  return getStockGroupInfo
}

export function stockGroupExists (stockGroupCode) {
  return getStockGroupByCode(stockGroupCode).then(brand => {
    if (brand == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createStockGroup (groupcode, group, createdBy, next) {
  return StockGroup.create({
    groupCode: groupcode,
    groupName: group.groupName,
    groupImage: group.groupImage,
    groupParentId: group.groupParentId,
    max_disc: group.max_disc,
    max_disc_nominal: group.max_disc_nominal,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateStockGroup (groupcode, group, updateBy, next) {
  return StockGroup.update({
    groupName: group.groupName,
    groupImage: group.groupImage,
    groupParentId: group.groupParentId ? group.groupParentId : null,
    max_disc: group.max_disc,
    max_disc_nominal: group.max_disc_nominal,
    updatedBy: updateBy,
    updatedAt: moment()
  },
    { where: { groupCode: groupcode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteStockGroup (groupcode) {
  return StockGroup.destroy({
    where: {
      groupCode: groupcode
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteStockGroups (group) {
  if (!isEmpty(group)) {
    return StockGroup.destroy({
      where: group
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}

export function srvGroupProducts (groupCode) {
  const sSQL = stringSQL.s00001.replace("_BIND01", groupCode)
  return getNativeQuery(sSQL, false, 'RAW')
}