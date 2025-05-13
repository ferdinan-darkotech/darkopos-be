import dbr from '../models/tableR'
import db from '../models'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import moment from 'moment'

let Supplier = db.tbl_supplier
let table = dbv.vw_supplier
let tbSupplierAPI = dbr.tbl_access_granted 
const vwAPISupplier = [["accessname", "accessname"], ["accessvar02", "supplierAPI"]]
const Fields = ['id', 'supplierCode', 'supplierName', 'paymentTempo', 'address01', 'address02',
  'cityId', 'phoneNumber', 'mobileNumber', 'email', 'taxId',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'type_supplier', 'default_tax_type',
  'type_supplier_name', 'default_tax_type_name', 'default_tax_value','prov_nama',
  'kab_nama', 'kec_nama', 'kel_nama', 'kel_id', 'zipcode'
]
const searchField = [ 'supplierCode', 'supplierName', 'address01', 'address02', 'zipCode', 'phoneNumber', 'mobileNumber', 'email', 'taxId',
'createdBy', 'createdAt', 'updatedBy', 'updatedAt' ]

export function srvGetAPISupplier (accesscode, vendorcode) {
  return tbSupplierAPI.findOne({
    attributes: vwAPISupplier,
    where: {
      accesscode: accesscode || '',
      accesskey: vendorcode || ''
    },
    raw: true
  })
}


export function getSupplierByCode (supplierCode) {
  return Supplier.findOne({
    where: {
      supplierCode: supplierCode
    },
    raw: false
  })
}

export function countData (query) {
  const { type, field, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all') {
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
  const { type, field, order, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  const { pageSize, page } = pagination
  let querying = []
  if (Object.getOwnPropertyNames(query).indexOf('q') !== -1) {
    for (let key in searchField) {
      const id = Object.assign(searchField)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = { $iRegexp: query['q'] || '' }
        querying.push(obj)
      }
    }
  }
  
  if (querying.length > 0) {
    return table.findAndCountAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        $or: querying
      },
      order: order ? sequelize.literal(order) : [['id', 'DESC']],
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return table.findAndCountAll({
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

// export function getSuppliersData (query) {
//   for (let key in query) {
//     if (key === 'createdAt') {
//       query[key] = { between: query[key] }
//     }
//   }
//   if (query.userName) {
//     return vwSupplier.findAll({
//       attributes: ['supplierCode', 'supplierName', 'paymentTempo', 'address01', 'address02',
//         'cityId', 'state', 'zipCode', 'phoneNumber', 'mobileNumber', 'email', 'taxId',
//         'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
//       ],
//       where: {
//         $or: [
//           {
//             supplierCode: {
//               $like: `%${query.userName}%`
//             }
//           },
//           {
//             supplierName: {
//               $like: `%${query.userName}%`
//             }
//           },
//         ]
//       }
//     })
//   } else {
//     return Supplier.findAll()
//   }
// }

export function setSupplierInfo (request) {
  const getSupplierInfo = {
    id: request.id,
    supplierCode: request.supplierCode,
    supplierName: request.supplierName,
    address01: request.address01,
    address02: request.address02,
    cityId: request.cityId,
    state: request.state,
    zipCode: request.zipCode,
    phoneNumber: request.phoneNumber,
    mobileNumber: request.mobileNumber,
    email: request.email,
    taxId: request.taxId,
    type_supplier: request.type_supplier,
    default_tax_type: request.default_tax_type,
    default_tax_value: request.default_tax_value
  }

  return getSupplierInfo
}

export function supplierExists (supplierCode) {
  return getSupplierByCode(supplierCode).then(supplier => {
    if (supplier == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createSupplier (suppliercode, supplier, createdBy, next) {
  return Supplier.create({
    supplierCode: suppliercode,
    supplierName: supplier.supplierName,
    paymentTempo: supplier.paymentTempo,
    address01: supplier.address01,
    address02: supplier.address02,
    kelid: supplier.kelid,
    // cityId: supplier.cityId,
    // state: supplier.state,
    // zipCode: supplier.zipCode,
    phoneNumber: supplier.phoneNumber,
    mobileNumber: supplier.mobileNumber,
    email: supplier.email,
    birthDate: supplier.birthDate,
    taxId: supplier.taxId,
    createdBy: createdBy,
    createdAt: moment(),
    type_supplier: supplier.type_supplier,
    default_tax_type: supplier.default_tax_type,
    default_tax_value: supplier.default_tax_value
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateSupplier (suppliercode, supplier, updatedBy, next) {
  return Supplier.update({
    supplierName: supplier.supplierName,
    supplierGroup: supplier.supplierGroup,
    paymentTempo: supplier.paymentTempo,
    address01: supplier.address01,
    address02: supplier.address02,
    kelid: supplier.kelid,
    // cityId: supplier.cityId,
    // state: supplier.state,
    // zipCode: supplier.zipCode,
    phoneNumber: supplier.phoneNumber,
    mobileNumber: supplier.mobileNumber,
    email: supplier.email,
    birthDate: supplier.birthDate,
    taxId: supplier.taxId,
    updatedBy: updatedBy,
    updatedAt: moment(),
    type_supplier: supplier.type_supplier,
    default_tax_type: supplier.default_tax_type,
    default_tax_value: supplier.default_tax_value
  },
    { where: { supplierCode: suppliercode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteSupplier (supplierData) {
  return Supplier.destroy({
    where: {
      supplierCode: supplierData
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteSuppliers (suppliers) {
  if (!isEmpty(suppliers)) {
    return Supplier.destroy({
      where: suppliers
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
