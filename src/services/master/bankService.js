import db from '../../models'
import { ApiError } from '../../services/v1/errorHandlingService'
import moment from 'moment'

let Bank = db.tbl_bank
let queryFields = [
  'id',
  'bankCode',
  'bankName',
  'chargeFee',
  'chargeFeePercent',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

export function getBankById (id) {
  return Bank.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function getBankByCode (code) {
  return Bank.findOne({
    where: {
      bankCode: code
    },
    raw: false
  })
}

export function countData (query) {
  const { type, field, status, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all') {
      query[key] = { $iRegexp: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in queryFields) {
      const id = Object.assign(queryFields)[key]
      if ((id === 'bankCode' || id === 'bankName')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return Bank.count({
      where: {
        $or: querying,
        status: '1'
      },
    })
  } else {
    return Bank.count({
      where: {
        ...other,
        status: '1'
      }
    })
  }
}

export function getBankData (query, pagination) {
  const { type, field, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (query['q']) {
    for (let key in queryFields) {
      const id = Object.assign(queryFields)[key]
      if ((id === 'bankCode' || id === 'bankName')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return Bank.findAll({
      attributes: queryFields,
      where: {
        $or: querying,
        status: '1'
      },
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return Bank.findAll({
      attributes: query.field ? query.field.split(',') : queryFields,
      where: {
        ...other,
        status: '1'
      },
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function bankExists (code) {
  return getBankByCode(code).then(result => {
    if (result) {
      return true;
    } else {
      return false;
    }
  })
}

export function bankExistsByid (id) {
  return getBankById(id).then(result => {
    if (result) {
      return true;
    } else {
      return false;
    }
  })
}

export function createBank (data, createdBy, next) {
  return Bank.create({
    bankCode: data.bankCode,
    bankName: data.bankName,
    chargeFee: data.chargeFee,
    chargeFeePercent: data.chargeFeePercent,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateBank (id, data, updateBy, next) {
  return Bank.update({
    bankCode: data.bankCode,
    bankName: data.bankName,
    chargeFee: data.chargeFee,
    chargeFeePercent: data.chargeFeePercent,
    updatedBy: updateBy,
    updatedAt: moment()
  },
    {
      where: {
        id: id,
        status: '1'
      }
    }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteBank (id, next) {
  return Bank.update({
    status: 0
  }, {
      where: {
        id: id
      }
    }).catch(err => (next(new ApiError(501, err, err))))
}
