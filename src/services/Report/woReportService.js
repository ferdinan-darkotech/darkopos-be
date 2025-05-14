import { Op } from 'sequelize'
import dbv from '../../models/view'
import sequelize from '../../native/sequelize'

let view001 = dbv.vw_wo_002
let view003 = dbv.vw_wo_003
let view004 = dbv.vw_wo_004
const Fields = [
  'id',
  'storeId',
  'woNo',
  'woReference',
  'transNo',
  'woDate',
  'transDate',
  'cashierName',
  'technicianName',
  'memberId',
  'memberCode',
  'address01',
  'memberTypeId',
  'memberSellPrice',
  'showAsDiscount',
  'memberPendingPayment',
  'gender',
  'mobileNumber',
  'phoneNumber',
  'memberName',
  'policeNoId',
  'policeNo',
  'merk',
  'model',
  'type',
  'year',
  'expired',
  'chassisNo',
  'machineNo',
  'takeAway',
  'timeIn',
  'timeOut',
  'posStatus',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt'
]

const Fields3 = [
  'id',
  'storeId',
  'woNo',
  'woReference',
  'transNo',
  'fieldId',
  'fieldName',
  'value',
  'valueName',
  'memo',
  'woDate',
  'transDate',
  'cashierName',
  'technicianName',
  'memberId',
  'memberCode',
  'address01',
  'memberTypeId',
  'memberTypeName',
  'memberSellPrice',
  'showAsDiscount',
  'memberPendingPayment',
  'gender',
  'mobileNumber',
  'phoneNumber',
  'memberName',
  'cashback',
  'policeNoId',
  'policeNo',
  'merk',
  'model',
  'type',
  'year',
  'expired',
  'chassisNo',
  'machineNo',
  'takeAway',
  'timeIn',
  'timeOut',
  'transTime',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt'
]

const Fields4 = [
  'id',
  'storeId',
  'woNo',
  'woReference',
  'transNo',
  'categoryId',
  'categoryCode',
  'categoryName',
  'value',
  'valueName',
  'memo',
  'woDate',
  'transDate',
  'cashierName',
  'technicianName',
  'memberId',
  'memberCode',
  'address01',
  'memberTypeId',
  'memberTypeName',
  'memberSellPrice',
  'showAsDiscount',
  'memberPendingPayment',
  'gender',
  'mobileNumber',
  'phoneNumber',
  'memberName',
  'cashback',
  'policeNoId',
  'policeNo',
  'merk',
  'model',
  'type',
  'year',
  'expired',
  'chassisNo',
  'machineNo',
  'takeAway',
  'timeIn',
  'timeOut',
  'transTime',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt'
]

export function countData (query) {
  const { type, field, order, q, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { [Op.iRegexp]: other[key] }
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
    return view001.count({
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        },
        ...other
      },
    })
  } else {
    return view001.count({
      where: {
        ...other,
        deletedBy: {
          [Op.eq]: null
        }
      }
    })
  }
}

export function getData (query, pagination) {
  const { type, field, order, q, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { [Op.iRegexp]: other[key] }
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
    return view001.findAll({
      attributes: Fields,
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        },
        ...other
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view001.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other,
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

export function countDataView3 (query) {
  const { type, field, order, q, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { [Op.iRegexp]: other[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields3) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return view003.count({
      where: {
        [Op.or]: querying,
        ...other
      },
    })
  } else {
    return view003.count({
      where: {
        ...other,
      }
    })
  }
}

export function getDataView3 (query, pagination) {
  const { type, field, order, q, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { [Op.iRegexp]: other[key] }
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in Fields3) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return view003.findAll({
      attributes: Fields3,
      where: {
        [Op.or]: querying,
        ...other
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view003.findAll({
      attributes: query.field ? query.field.split(',') : Fields3,
      where: {
        ...other,
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function countDataView4 (query) {
  const { type, field, order, q, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { [Op.iRegexp]: other[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields4) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return view004.count({
      where: {
        [Op.or]: querying,
        ...other
      },
    })
  } else {
    return view004.count({
      where: {
        ...other,
      }
    })
  }
}

export function getDataView4 (query, pagination) {
  const { type, field, order, q, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
    } else if (type !== 'all' && query['q']) {
      other[key] = { [Op.iRegexp]: other[key] }
    }
  }

  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in Fields4) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return view004.findAll({
      attributes: Fields4,
      where: {
        [Op.or]: querying,
        ...other
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view004.findAll({
      attributes: query.field ? query.field.split(',') : Fields4,
      where: {
        ...other
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}