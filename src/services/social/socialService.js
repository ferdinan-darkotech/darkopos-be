import db from '../../models/tableR'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import { Op } from 'sequelize'

let table = db.tbl_social_media

// Customized view
const Fields = [
  'id',
  'name',
  'displayName',
  'url',
  'image',
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

export function getDataCode (id) {
  return table.findOne({
    where: {
      name: id
    },
    paranoid: false,
    raw: false
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

export function insertData (data, createdBy, next) {
  return table.create({
    name: data.name,
    displayName: data.displayName,
    url: data.url,
    image: data.image,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    name: data.name,
    displayName: data.displayName,
    url: data.url,
    image: data.image,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}

export async function deleteData (id, deletedBy, next) {
  await table.update({
    deletedBy
  },
    {
      where: {
        id
      }
    }
  )
  return table.destroy({
    where: {
      id
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}
