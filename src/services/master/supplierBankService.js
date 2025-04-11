import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'

let SupplierBank = db.tbl_supplier_bank
let BankView = dbv.vw_supplier_bank

let queryFields = [
  'id',
  'supplierId',
  'supplierCode',
  'supplierName',
  'accountNo',
  'accountName',
  'bankId',
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
  return BankView.findOne({
    attributes: queryFields,
    where: {
      id: id
    },
    raw: false
  })
}

export function getBankSupplierId (id) {
  return BankView.findAll({
    attributes: queryFields,
    where: {
      supplierId: id
    },
    raw: false
  })
}

export function getBankByName (name) {
  return BankView.findOne({
    attributes: queryFields,
    where: {
      bankName: name
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
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || id === 'type' || id === 'status')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return BankView.count({
      where: {
        $or: querying,
        status: 1
      },
    })
  } else {
    return BankView.count({
      where: {
        ...other,
        status: 1
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
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || id === 'type' || id === 'status')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return BankView.findAll({
      attributes: queryFields,
      where: {
        $or: querying,
        status: 1
      },
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return BankView.findAll({
      attributes: query.field ? query.field.split(',') : queryFields,
      where: {
        ...other,
        status: 1
      },
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function bankExists (name) {
  return getBankByName(name).then(result => {
    if (result) {
      return true;
    } else {
      return false;
    }
  })
}

export function createBank (data, createdBy, next) {
  return SupplierBank.create({
    supplierId: data.supplierId,
    bankId: data.bankId,
    accountNo: data.accountNo,
    accountName: data.accountName,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateBank (id, data, updateBy, next) {
  return SupplierBank.update({
    bankName: data.bankName,
    chargeFee: data.chargeFee,
    chargeFeePercent: data.chargeFeePercent,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteBank (id, updatedBy, next) {
  return SupplierBank.update({
    status: 0,
    updatedBy: updatedBy
  },
    {
      where: {
        id: id
      }
    }
  ).catch(err => (next(new ApiError(501, err, err))))
}
