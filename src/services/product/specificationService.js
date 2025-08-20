import { Op } from 'sequelize'
import db from '../../models'
import dbv from '../../models/view'
import sequelize from '../../native/sequelize'

let table = db.tbl_specification
let view = dbv.vw_specification

const Fields = [
  'id',
  'categoryId',
  'categoryCode',
  'categoryName',
  'name',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',

  // [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
  'groupId',
  'groupName',
  'groupCode'
]

export function getDataId (id) {
  return view.findOne({
    attributes: Fields,
    where: {
      id: id
    },
    raw: false
  })
}

export function getDataCode (data) {
  return table.findOne({
    where: {
      categoryId: data.categoryId,
      name: data.name,
      deletedBy: {
        [Op.eq]: null
      },
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
  const { type, field, order, q, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
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
    return view.count({
      where: {
        [Op.or]: querying,
        deletedBy: {
          [Op.eq]: null
        },
        [Op.and]: other
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
  const { type, field, order, q, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'timeIn' || key === 'timeOut' || key === 'transDate' || key === 'woDate') {
      other[key] = { [Op.between]: other[key] }
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
        },
        // [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
        ...(other.groupId ? { [Op.or]: other } : { [Op.and]: other })
      },
      order: [['createdAt']],
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        // [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
        ...(other.groupId ? { [Op.or]: other } : { ...other }),
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
    categoryId: data.categoryId,
    name: data.name,
    createdBy: createdBy,
    updatedBy: '---',

    // [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
    groupId: data.groupId
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    categoryId: data.categoryId,
    name: data.name,
    updatedBy: updateBy,

    // [MASTER STOCKS GROUP]: FERDINAN - 16/06/2025
    groupId: data.groupId
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