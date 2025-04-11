import db from '../models'
import { ApiError } from '../services/v1/errorHandlingService'
import sequelize from '../native/sequelize'

let table = db.tbl_beginning_balance

const Fields = [
  'id',
  'storeId',
  'transNo',
  'productId',
  'productName',
  'qty',
  'purchasePrice',
  'sellingPrice',
  'discPercent',
  'discNominal',
  'DPP',
  'PPN',
  'closed',
  'recapDate',
  'transDate',
  'insertStatus',
  'startPeriod',
  'endPeriod',
  'updatedBy',
]

export function getDataId (id) {
  return table.findOne({
    where: {
      id: id
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
  const { type, field, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { $iRegexp: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return table.count({
      where: {
        $or: querying
      },
    })
  } else {
    return table.count({
      where: {
        ...other
      }
    })
  }
}

export function getData (query, pagination) {
  const { type, field, order, ...other } = query
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
      if (!(id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
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
        $or: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return table.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
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
    storeId: data.storeId,
    transNo: data.transNo,
    productId: data.productId,
    productName: data.productName,
    qty: data.qty,
    purchasePrice: data.purchasePrice,
    sellingPrice: data.sellingPrice,
    discPercent: data.discPercent,
    discNominal: data.discNominal,
    DPP: data.DPP,
    PPN: data.PPN,
    closed: data.closed,
    recapDate: data.recapDate,
    transDate: data.transDate,
    insertStatus: data.insertStatus,
    startPeriod: data.startPeriod,
    endPeriod: data.endPeriod,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    storeId: data.storeId,
    transNo: data.transNo,
    productId: data.productId,
    productName: data.productName,
    qty: data.qty,
    purchasePrice: data.purchasePrice,
    sellingPrice: data.sellingPrice,
    discPercent: data.discPercent,
    discNominal: data.discNominal,
    DPP: data.DPP,
    PPN: data.PPN
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