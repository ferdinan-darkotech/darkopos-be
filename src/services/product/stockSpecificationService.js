import db from '../../models'
import sequelize from '../../native/sequelize'
import dbv from '../../models/view'
import { Op } from 'sequelize'

let table = db.tbl_stock_specification
let view = dbv.vw_stock_specification

const Fields = [
  'id',
  'productId',
  'productCode',
  'productName',
  'categoryCode',
  'categoryName',
  'specificationId',
  'name',
  'value',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt'
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
      productId: data.productId,
      specificationId: data.specificationId,
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

export function getDataAllDataExists (productId, specificationId) {
  return table.findAll({
    where: {
      productId: {
        [Op.in]: productId
      },
      specificationId: {
        [Op.in]: specificationId
      },
      deletedBy: {
        [Op.eq]: null
      },
    },
    raw: false
  })
}

export function dataExistsCodeLooping (productId, specificationId) {
  return getDataAllDataExists(productId, specificationId).then(exists => {
    console.log('exists', exists)
    if ((exists || []).length === 0) {
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
        [Op.and]: other
      },
      order: [['createdAt']],
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
  console.log('zzz1', data)
  return table.create({
    productId: data.productId,
    specificationId: data.specificationId,
    value: data.value,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function insertBulkData (data, createdBy, next) {
  var arrayProd = []
  for (var n = 0; n < data.length; n++) {
    arrayProd.push({
      productId: data[n].productId,
      specificationId: data[n].specificationId,
      value: data[n].value,
      createdBy: createdBy,
      updatedBy: '---'
    })
  }
  return table.bulkCreate(
    arrayProd
  )
}

export function updateData (id, data, updateBy) {
  return table.update({
    productId: data.productId,
    specificationId: data.specificationId,
    value: data.value,
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