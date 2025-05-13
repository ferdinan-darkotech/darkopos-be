import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import moment from 'moment'
import { Op } from 'sequelize'

let table = db.tbl_bundling_reward
let view = dbv.vw_bundling_reward
const Fields = [
  'id',
  'type',
  'bundleId',
  'bundleName',
  'productId',
  'serviceId',
  'qty',
  'discount',
  'disc1',
  'disc2',
  'disc3',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

const viewFields = (storeId) => [
  'id',
  'type',
  'bundleId',
  'bundleName',
  'productId',
  'productCode',
  'productName',
  [sequelize.literal(`CASE WHEN type = 'P' THEN fn_stock_001(productId, ${storeId}) ELSE NULL END`), 'stock'],
  'active',
  'qty',
  'sellingPrice',
  'disc1',
  'disc2',
  'disc3',
  'discount',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

// Customize id
let tbl_bundling = db.tbl_bundling

export function getDataId (id) {
  return table.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function getDataCode (code) {
  return tbl_bundling.findOne({
    where: {
      code: code
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
export function dataExistsCode (code) {
  return getDataCode(code).then(exists => {
    if (exists == null) {
      return false
    }
    return true
  })
}

export function countData (query) {
  const { type, field, storeId, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all') {
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
    return view.count({
      where: {
        [Op.or]: querying
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
  console.log(querying)
  if (querying.length > 0) {
    return view.findAll({
      attributes: viewFields(storeId),
      where: {
        [Op.or]: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view.findAll({
      attributes: query.field ? query.field.split(',') : viewFields(storeId),
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
    discount: data.discount,
    disc1: data.disc1,
    disc2: data.disc2,
    disc3: data.disc3,
    createdBy: createdBy,
    createdAt: moment(),
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
    discount: data.discount,
    disc1: data.disc1,
    disc2: data.disc2,
    disc3: data.disc3,
    updatedBy: updateBy,
    updatedAt: moment()
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