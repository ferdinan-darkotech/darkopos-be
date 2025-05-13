import db from '../../../models'
import { ApiError } from '../../../services/v1/errorHandlingService'
import sequelize from '../../../native/sequelize'
import moment from 'moment'
import { Op } from 'sequelize'

let table = db.tbl_member_asset_brand

const Fields = ['id', 'brandCode', 'brandName', 'active', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']

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
      brandName: id,
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
      if (id === 'brandCode' || id === 'brandName') {
        let obj = {}
        obj[id] = { [Op.iRegexp]: other['q'] }
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return table.findAndCountAll({
      attributes: Fields,
      where: {
        [Op.or]: querying,
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
    brandCode: data.brandCode,
    brandName: data.brandName,
    active: data.active,
    createdAt: moment(),
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    brandName: data.brandName,
    active: data.active,
    updatedBy: updateBy,
    updatedAt: moment()
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
