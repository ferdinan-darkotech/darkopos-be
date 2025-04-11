import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'

let table = db.tbl_follow_up

// Customized view
let view = dbv.vwh_follow_up

const Fields = [
  'id',
  'code',
  'posId',
  'storeId',
  'storeCode',
  'storeName',

  'cashierTransId',
  'technicianId',
  'technicianCode',
  'technicianName',
  'cashierId',
  'cashierName',

  'memberId',
  'memberCode',
  'memberName',
  'mobileNumber',
  'phoneNumber',
  'gender',
  'birthDate',
  'address01',
  'address02',
  'cityId',
  'cityName',

  'policeNo',
  'policeNoId',
  'lastMeter',

  'transNoId',
  'transNo',
  'transDate',
  'transTime',
  'transNoStatus',
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
  return view.findOne({
    attributes: Fields,
    where: {
      id: id
    },
    raw: false
  })
}

export function getDataPosId (posId) {
  return view.findOne({
    attributes: Fields,
    where: {
      posId: posId
    },
    raw: false
  })
}

export function getDataCode (code) {
  return table.findOne({
    where: {
      code: code
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
  for (let key in other) {
    if (key === 'transDate') {
      other[key] = { $between: other[key] }
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
        $or: querying
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
  const { type, field, order, q, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  for (let key in other) {
    if (key === 'transDate') {
      other[key] = { $between: other[key] }
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || id === 'storeId')) {
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
        $or: querying,
        $and: other
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
    code: data.code,
    posId: data.posId,
    status: data.status,
    lastCaller: data.lastCaller,
    lastCall: data.lastCall,
    customerSatisfaction: data.customerSatisfaction,
    postService: data.postService,
    // postServiceReason: data.postServiceReason,
    nextCall: data.nextCall,
    pendingReason: data.pendingReason,
    denyOfferingReason: data.denyOfferingReason,
    acceptOfferingDate: data.acceptOfferingDate,
    acceptOfferingReason: data.acceptOfferingReason,
    createdBy: createdBy,
    updatedBy: '---'
  })
}

export function updateData (id, data, updateBy) {
  return table.update({
    code: data.code,
    posId: data.posId,
    status: data.status,
    lastCaller: data.lastCaller,
    lastCall: data.lastCall,
    customerSatisfaction: data.customerSatisfaction,
    postService: data.postService,
    // postServiceReason: data.postServiceReason,
    nextCall: data.nextCall,
    pendingReason: data.pendingReason,
    denyOfferingReason: data.denyOfferingReason,
    acceptOfferingDate: data.acceptOfferingDate,
    acceptOfferingDate: data.acceptOfferingDate,
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