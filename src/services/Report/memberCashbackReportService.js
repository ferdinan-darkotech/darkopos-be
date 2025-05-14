import { Op } from 'sequelize'
import dbv from '../../models/view'
import sequelize from '../../native/sequelize'

let table = dbv.vw_member_cashback

const Fields = [
  'id',
  'loyaltyId',
  'posId',
  'transNo',
  'posDate',
  'expirationDate',
  'cashbackIn',
  'cashbackOut',
  'memo'
]

export function countData (query) {
  const { type, field, order, expirationDate, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'posDate') {
      query[key] = { [Op.between]: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { [Op.iRegexp]: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return table.count({
      where: {
        [Op.or]: querying,
        expirationDate: {
          [Op.gte]: expirationDate
        },
        deletedBy: {
          [Op.eq]: null
        },
        [Op.and]: other
      },
    })
  } else {
    return table.count({
      where: {
        ...other,
        expirationDate: {
          [Op.gte]: expirationDate
        },
        deletedBy: {
          [Op.eq]: null
        }
      }
    })
  }
}

export function getData (query, pagination) {
  const { type, field, order, expirationDate, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'posDate') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return table.findAll({
      attributes: Fields,
      where: {
        [Op.or]: querying,
        expirationDate: {
          [Op.gte]: expirationDate
        },
        deletedBy: {
          [Op.eq]: null
        },
        [Op.and]: other
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return table.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other,
        expirationDate: {
          [Op.gte]: expirationDate
        },
        deletedBy: {
          [Op.eq]: null
        }
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}