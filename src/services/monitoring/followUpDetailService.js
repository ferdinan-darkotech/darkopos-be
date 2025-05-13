import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import { Op } from 'sequelize'

let table = db.tbl_follow_up_detail

// Customized view
let view = dbv.vw_follow_up_detail_002

const Fields = [
  'followUpDetailId',
  'followUpId',
  'posDetailId',
  'productId',
  'productCode',
  'productName',
  'customerSatisfaction',
  'code',
  'posId',
  'memberId',
  'memberCode',
  'memberName',
  'phoneNumber',
  'mobileNumber',
  'policeNo',
  'policeNoId',
  'lastMeter',
  'transNoId',
  'transNo',
  'transDate',
  'transTime',
  'transNoStatus',
  'total',
  'totalDiscount',
  'DPP',
  'PPN',
  'nettoTotal',
  'status',
  'lastCaller',
  'lastCall',
  'customerSatisfaction',
  'postService',
  // 'postServiceReason',
  'nextCall',
  'pendingReason',
  'denyOfferingReason',
  'acceptOfferingDate',
  'acceptOfferingReason',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
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
      accountCode: id
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
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt' || key === 'transDate' || key === 'lastCall' || key === 'nextCall' || key === 'postService') {
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
    return view.count({
      where: {
        [Op.or]: querying
      },
    })
  } else {
    return view.count({
      where: {
        ...other
      }
    })
  }
}

export function getData (query, pagination) {
  let { type, field, order, ...other } = query
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
        [Op.or]: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return view.findAll({
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
    followUpId: data.followUpId,
    posDetailId: data.posDetailId,
    customerSatisfaction: data.customerSatisfaction,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    followUpId: data.followUpId,
    posDetailId: data.posDetailId,
    customerSatisfaction: data.customerSatisfaction,
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