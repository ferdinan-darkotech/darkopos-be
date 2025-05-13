import db from '../../models'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import { updateMemberUnitById } from '../member/memberUnitService'
import { Op } from 'sequelize'

let table = db.tba_member_unit

const Fields = [
  'id',
  'memberUnitId',
  'memberId',
  'policeNo',
  'merk',
  'model',
  'type',
  'year',
  'chassisNo',
  'machineNo',
  'expired',
  'memo',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt'
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
        [Op.or]: querying
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
        [Op.or]: querying
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

export async function insertData (data, createdBy, next) {
  await updateMemberUnitById(data.memberUnitId, data, createdBy, next)
  return table.create({
    memberUnitId: data.memberUnitId,
    memberId: data.memberId,
    policeNo: data.policeNo,
    merk: data.merk,
    model: data.model,
    type: data.type,
    year: data.year,
    chassisNo: data.chassisNo,
    machineNo: data.machineNo,
    expired: data.expired,
    memo: data.memo,
    createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    memberUnitId: data.memberUnitId,
    memberId: data.memberId,
    policeNo: data.policeNo,
    merk: data.merk,
    model: data.model,
    type: data.type,
    year: data.year,
    chassisNo: data.chassisNo,
    machineNo: data.machineNo,
    expired: data.expired,
    memo: data.memo,
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