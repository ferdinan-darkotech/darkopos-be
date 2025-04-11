import db from '../../models'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'

let table = db.tbl_loyalty

// Customized view

const Fields = [
  'id',
  'startDate',
  'endDate',
  'expirationDate',
  'setValue',
  'newMember',
  'active',
  'minPayment',
  'maxDiscount',
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

export function getDataCode (data) {
  if (data) {
    return table.findOne({
      attributes: Fields,
      where: {
        active: '1',
        $or: {
          startDate: {
            $between: [data.startDate, data.endDate]
          },
          endDate: {
            $between: [data.startDate, data.endDate]
          }
        },
        deletedBy: {
          $eq: null
        },
      },
      raw: false
    })
  } else {
    return table.findOne({
      attributes: Fields,
      where: {
        active: '1',
        startDate: {
          $lte: sequelize.literal('current_date')
        },
        endDate: {
          $gte: sequelize.literal('current_date')
        },
        deletedBy: {
          $eq: null
        },
      },
      raw: false
    })
  }
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
export function dataExistsCode (data) {
  return getDataCode(data).then(exists => {
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
        $or: querying,
        deletedBy: {
          $eq: null
        },
        $and: other
      },
    })
  } else {
    return table.count({
      where: {
        ...other,
        deletedBy: {
          $eq: null
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
    return table.findAll({
      attributes: Fields,
      where: {
        $or: querying,
        deletedBy: {
          $eq: null
        },
        $and: other
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return table.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        ...other,
        deletedBy: {
          $eq: null
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
    startDate: data.startDate,
    endDate: data.endDate,
    expirationDate: data.expirationDate,
    setValue: data.setValue,
    newMember: data.newMember,
    active: data.active,
    minPayment: data.minPayment,
    maxDiscount: data.maxDiscount,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    startDate: data.startDate,
    endDate: data.endDate,
    expirationDate: data.expirationDate,
    setValue: data.setValue,
    newMember: data.newMember,
    active: +data.active,
    minPayment: data.minPayment,
    maxDiscount: data.maxDiscount,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  ).catch(er => console.log(er))
}

export function cancelData (id, updateBy) {
  return table.update({
    active: 0
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