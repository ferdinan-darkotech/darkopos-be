import db from '../../../models'
import { ApiError } from '../../../services/v1/errorHandlingService'
import sequelize from '../../../native/sequelize'
import Sequelize from 'sequelize'
import moment from 'moment'

let table = db.tbl_member_asset_type

const fuelType = [
  Sequelize.literal(`case when fuel_type = '01' then 'Gasoline' when fuel_type = '2' then 'Diesel' else '-' end`),
  'fuel_type_name'
]
const Fields = [
  'id', 'modelId', 'typeCode', 'typeName', 'fuel_type', fuelType, 'active', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'
]

export function getDataId (id, activeOnly = false) {
  return table.findOne({
    attributes: Fields,
    where: {
      id: id,
      ...((activeOnly || '').toString() === 'true' ? { active: true } : {})
    },
    raw: false
  })
}

export function getDataCode (id, activeOnly = false) {
  return table.findOne({
    attributes: Fields,
    where: {
      modelId: id.modelId,
      typeName: id.typeName,
      ...((activeOnly || '').toString() === 'true' ? { active: true } : {})
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
  const { type, field, order, activeOnly, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      other[key] = other[key]
    }
  }

  const { pageSize, page } = pagination
  let querying = []
  if (other['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (id === 'typeCode' || id === 'typeName') {
        let obj = {}
        obj[id] = { $iRegexp: other['q'] }
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return table.findAndCountAll({
      attributes: Fields,
      where: {
        $or: querying,
        ...((activeOnly || '').toString() === 'true' ? { active: true } : {})
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return table.findAndCountAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other,
        ...((activeOnly || '').toString() === 'true' ? { active: true } : {})
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function insertData (data, createdBy, next) {
  return table.create({
    modelId: data.modelId,
    typeCode: data.typeCode,
    typeName: data.typeName,
    fuel_type: data.fuel_type,
    active: data.active,
    createdAt: moment(),
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    modelId: data.modelId,
    typeCode: data.typeCode,
    typeName: data.typeName,
    fuel_type: data.fuel_type,
    active: data.active,
    updatedAt: moment(),
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
