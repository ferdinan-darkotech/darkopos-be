import db from '../models'
import { ApiError } from '../services/v1/errorHandlingService'
import sequelize from '../native/sequelize'
import Sequelize from 'sequelize'

let table = db.tbl_sequence

const Fields = [
  'id',
  'storeId',
  'seqCode',
  'typeSeq',
  'seqName',
  'seqValue',
  'initialChar',
  'maxNumber',
  'resetType',
  'resetDate',
  'oldValue',
  'createdBy',
  'createdAt',
  'updatedBy',
]

export async function getDataByStoreAndCode (seqCode, type) {
  return table.findOne({
    attributes: Fields,
    where: {
      seqCode,
      storeId: type
    },
    raw: false
  })
}

export async function increaseSequence (seqCode, type, lastSequence, transaction) {
  return table.update({
    seqValue: lastSequence + 1
  }, {
      where: {
        seqCode,
        storeId: type
      },
      transaction
    })
}

export async function increaseSequenceV2 (seqCode, type, transaction) {
  return table.update({
    seqValue: Sequelize.literal('seqvalue + 1')
  }, {
      where: {
        seqCode,
        storeId: type
      },
      transaction
    })
}

export function getDataId (id) {
  return table.findOne({
    attributes: Fields,
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
    seqCode: data.seqCode,
    typeSeq: data.typeSeq,
    seqName: data.seqName,
    seqValue: data.seqValue,
    initialChar: data.initialChar,
    maxNumber: data.maxNumber,
    resetType: data.resetType,
    resetDate: data.resetDate,
    oldValue: data.oldValue,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    storeId: data.storeId,
    seqCode: data.seqCode,
    typeSeq: data.typeSeq,
    seqName: data.seqName,
    seqValue: data.seqValue,
    initialChar: data.initialChar,
    maxNumber: data.maxNumber,
    resetType: data.resetType,
    resetDate: data.resetDate,
    oldValue: data.oldValue,
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