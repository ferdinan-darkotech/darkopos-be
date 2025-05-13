import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import { Op } from 'sequelize'

let table = db.tbl_mobile_app_image

const Fields = [
  'id',
  'title',
  'body',
  'imageUri',
  'imageType',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
]
const minFields01 = [
  'title',
  'body',
  'imageUri',
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
      title: id
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

export function getData (query, pagination, mode) {
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
    return table.findAndCountAll({
      attributes: Fields,
      where: {
        [Op.or]: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    let attributes = query.field ? query.field.split(',') : Fields
    let order = order ? sequelize.literal(order) : null
    let limit = (type !== 'all') ? parseInt(pageSize || 10, 10) : null
    let offset = (type !== 'all') ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    if (mode === 'mobile') {
      attributes = minFields01
      if (other.hasOwnProperty('imageType')) {
        if (other.imageType === 1) limit = 5
        if (other.imageType === 2) limit = 10
        order = [['id','ASC']]
      }
    }
    return table.findAndCountAll({
      attributes,
      where: {
        ...other
      },
      order,
      limit,
      offset
    })
  }
}

export function insertData (data, createdBy, next) {
  return table.create({
    title: data.title,
    body: data.body,
    imageUri: data.imageUri,
    imageType: data.imageType,
    status: data.status,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    title: data.title,
    body: data.body,
    imageUri: data.imageUri,
    imageType: data.imageType,
    status: data.status,
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