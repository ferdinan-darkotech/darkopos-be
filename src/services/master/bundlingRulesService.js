import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import Sequelize from 'sequelize'

let table = db.tbl_bundling_rules
let view = dbv.vw_bundling_rules
const Fields = [
  'id',
  'type',
  'bundleId',
  'productId',
  'serviceId',
  'qty',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

const viewFields = [
  'id',
  'type',
  'bundleId',
  'productId',
  'productCode',
  'productName',
  'sellingPrice',
  'qty',
  [Sequelize.literal('0::NUMERIC(19, 2)'), 'disc1'],
  [Sequelize.literal('0::NUMERIC(19, 2)'), 'disc2'],
  [Sequelize.literal('0::NUMERIC(19, 2)'), 'disc3'],
  [Sequelize.literal('0::NUMERIC(19, 2)'), 'discount'],
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

export function getDataId (id) {
  return table.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function getDataCode (id) {
  return table.findOne({
    where: {
      accountCode: id
    },
    raw: false
  })
}

export function dataExists (id) {
  return getDataId(id).then(exists => {
    if (exists == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function countData (query) {
  const { type, field, storeId, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all') {
      query[key] = { $iRegexp: query[key] }
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
    return view.count({
      where: {
        $or: querying
      },
    })
  } else {
    return view.count({
      where: {
        ...other
      }
    })
  }
}

export function getData (query, pagination) {
  const { type, field, storeId, order, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
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
    return view.findAll({
      attributes: viewFields,
      where: {
        $or: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view.findAll({
      attributes: query.field ? query.field.split(',') : viewFields,
      where: {
        ...other
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function insertData (data, createdBy, next) {
  return table.create({
    type: data.type,
    bundleId: data.bundleId,
    productId: data.productId,
    serviceId: data.serviceId,
    qty: data.qty,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    type: data.type,
    bundleId: data.bundleId,
    productId: data.productId,
    serviceId: data.serviceId,
    qty: data.qty,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}

export function deleteData (id, next) {
  return table.destroy({
    where: {
      id: id
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}