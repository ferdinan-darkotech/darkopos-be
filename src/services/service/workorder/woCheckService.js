import { Op } from 'sequelize'
import db from '../../../models'
import dbv from '../../../models/view'
import sequelize from '../../../native/sequelize'

let table = db.tbl_wo_check
let view = dbv.vw_wo_check_002

const Fields = ['id', 'woId', 'checkId', 'categoryCode', 'categoryName', 'categoryImage', 'categoryParentId', 'categoryParentCode', 'categoryParentName', 'categoryParentImage', 'value', 'memo']

export function getDataId (id) {
  return table.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function getDataCode (data) {
  return table.findOne({
    where: {
      woId: data.woId,
      checkId: data.checkId,
      deletedBy: {
        [Op.eq]: null
      }
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
      if (!(id === 'createdBy' || id === 'deletedBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return view.count({
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        }
      },
    })
  } else {
    return view.count({
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
    return view.findAll({
      attributes: Fields,
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        }
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view.findAll({
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

export function insertData (data, createdBy, next) {
  return table.create({
    woId: data.woId,
    checkId: data.checkId,
    value: data.value,
    memo: data.memo,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    woId: data.woId,
    checkId: data.checkId,
    value: data.value,
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

export function deleteData (id, updateBy) {
  return table.update({
    deletedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}