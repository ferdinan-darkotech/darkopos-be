import { Op } from 'sequelize'
import db from '../../models'
import dbv from '../../models/view'
import sequelize from '../../native/sequelize'
import stringSQL from '../../native/sqlSequence'
import { ApiError } from '../../services/v1/errorHandlingService'

const vwd_change_sellprice = dbv.vwd_change_sellprice
const vwh_change_sellprice = dbv.vwh_change_sellprice
const headerFields = [
  'id', 'transNo', 'transDate', 'description', 'status', 'statusText',
  'employeeId', 'employeeCode', 'employeeName',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const changesFields = [
  'id', 'transNoId', 'transNo', 'transDate', 'productId', 'productCode', 'productName', 'status',
  'categoryId', 'categoryName', 'brandId', 'brandName',
  'prevSellPrice', 'prevDistPrice01', 'prevDistPrice02',
  'distPrice01', 'distPrice02', 'sellPrice',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

export function getChangeSellpriceHeader (query, createdBy) {
  const { type, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in changesFields) {
      const id = Object.assign(changesFields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'status' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if ((querying || []).length > 0) {
    return vwh_change_sellprice.findAll({
      attributes: headerFields,
      where: {
        [Op.or]: querying,
        status: 0
      },
      order: [
        ['createdAt', 'ASC']
      ]
    })
  } else {
    return vwh_change_sellprice.findAll({
      attributes: headerFields,
      where: {
        ...other
      },
      order: [
        ['createdAt', 'ASC']
      ]
    })
  }
}

export function getChangeSellpriceData (query, pagination, createdBy) {
  const { type, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  let querying = []
  const { pageSize, page } = pagination
  if (query['q']) {
    for (let key in changesFields) {
      const id = Object.assign(changesFields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'status' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vwd_change_sellprice.findAll({
      attributes: changesFields,
      where: {
        [Op.or]: querying
      }
    })
  } else {
    return vwd_change_sellprice.findAll({
      attributes: changesFields,
      where: {
        ...other
      },
      limit: pageSize ? parseInt(pageSize || 10, 10) : null,
      offset: pageSize ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}
