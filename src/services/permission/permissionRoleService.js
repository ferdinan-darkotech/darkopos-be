import db from '../../models'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import { create } from 'domain';

let table = db.tbl_permission_role
let Role = db.tbl_role
let Permission = db.tbl_permission

table.belongsTo(Permission, { as: 'Permission', foreignKey: 'permissionId', targetKey: 'id' })
table.belongsTo(Role, { as: 'Role', foreignKey: 'roleId', targetKey: 'id' })
const include = (whereClause = {}) => {
  return ([
    { model: Role, where: whereClause, required: true, as: 'Role', paranoid: false },
    { model: Permission, required: true, as: 'Permission', paranoid: false }
  ])
}

// Customized view
const Fields = [
  'id',
  'permissionId',
  'roleId',
  'allow',
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
    raw: false,
    include: include()
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
  const { type, field, order, name, ...other } = query
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
        $or: querying
      },
      include: name ? include({ name }) : include()
    })
  } else {
    return table.count({
      where: {
        ...other
      },
      include: name ? include({ name }) : include()
    })
  }
}

export function getData (query, pagination) {
  const { type, field, order, name, ...other } = query
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
        $or: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10),
      raw: false,
      include: name ? include({ name }) : include()
    })
  } else {
    return table.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null,
      raw: false,
      include: name ? include({ name }) : include()
    })
  }
}

export function updateData (data, createdBy) {
  data = data.map(x => ({ ...x, createdBy, updatedBy: createdBy }))
  return table.bulkCreate(data, {
    fields: ['id', 'permissionId', 'roleId', 'allow', 'createdBy'],
    updateOnDuplicate: ['allow', 'updatedBy']
  })
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