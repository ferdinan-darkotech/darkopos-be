import { ApiError } from '../../services/v1/errorHandlingService'
import db from '../../models'
import sequelize from '../../native/sequelize'
import { getNativeQuery } from '../../native/nativeUtils'

const Store = db.tbl_store

const Fields = [
  'id',
  'storeCode',
  'storeName',
  'storeParentId',
  'address01',
  'address02'
]

const sqlStores = "SELECT * FROM vw_store_005"
const sqlStore = "SELECT * FROM vw_store_001 WHERE lvl2Code = '" + "_BIND01" + "'"
const sqlStoreById = "SELECT * FROM tbl_store WHERE id = '" + "_BIND01" + "'"

const sqlUserStoresTree = "SELECT userStore, defaultStoreName FROM vw_store_006 " +
  "WHERE userId = '" + "_BIND01" + "'"
//simplify this
const sqlUserStoresLOV = "SELECT userStoreId as value, companyName, storeName as label, " +
  "storeCode as code, address01 as address01, address02 as address02, companyEmail, " +
  "mobileNumber as mobileNumber, companyAddress01, companyAddress02, companyMobileNumber, " +
  "companyPhoneNumber, taxID, taxConfirmDate, taxType, initial FROM vw_store_004 " +
  "WHERE userId = '" + "_BIND01" + "'"

const sqlUpdateDefaultStore = "UPDATE tbl_user_store SET defaultStore=0 WHERE userId = '" + "_BIND01" + "';" +
  "UPDATE tbl_user_store SET defaultStore=1 " +
  "WHERE userId = '" + "_BIND01" + "'" + " AND userStoreId = " +
  "(SELECT lvl2Id FROM vw_store_003 " +
  "WHERE lvl2AllCode = '" + "_BIND02" + "');"
const sqlDefaultStore = "SELECT defaultStoreName FROM vw_store_006 " +
  "WHERE userId = '" + "_BIND01" + "'"
const sqlSaveUserStores = ["DELETE FROM tbl_user_store WHERE userId = '" + "_BIND01" + "'; ",
"\nINSERT tbl_user_store (userId, userStoreId, defaultStore, createdAt, createdBy, updatedAt, updatedBy) " +
"VALUES('" + "_BIND01" + "', " + "(CASE " +
"WHEN LENGTH('" + "_BIND02" + "') = 3 THEN " +
"(SELECT DISTINCT lvl1Id FROM vw_store_001 WHERE lvl1code = '" + "_BIND02" + "')" +
"WHEN LENGTH('" + "_BIND02" + "') = 7 THEN " +
"(SELECT DISTINCT lvl2Id FROM vw_store_001 WHERE lvl2AllCode = '" + "_BIND02" + "')" +
"END)" + ", 0, now(), '-', now(), '-');",
"UPDATE tbl_user_store SET defaultStore=1 " +
"WHERE userId = '" + "_BIND01" + "'" + " AND userStoreId = " +
"(SELECT lvl2Id FROM vw_store_001 " +
"WHERE lvl2AllCode = '" + "_BIND03" + "')"]
const sqlUserStoresSaved = "SELECT b.lvl2Name " +
  "FROM tbl_user_store a INNER JOIN vw_store_003 b " +
  "WHERE a.userId = '" + "_BIND01" + "' " + "AND a.userStoreId = b.lvl2Id " +
  "AND b.lvl2AllCode in (" + "_BIND02" + ")"
const sqlStoresNormal = "SELECT a.lvl1Id AS id, a.lvl1Code AS storeCode, " +
  "a.lvl1Name AS storeName, a.companyName " +
  "FROM vw_store_003 a;"
const sqlStoresCashier = "SELECT a.lvl1Id AS id, a.lvl1Code AS storeCode, " +
  "a.lvl1Name AS storeName, a.companyName " +
  "FROM vw_store_003 a INNER JOIN tbl_user_store b " +
  "ON a.lvl1Id = b.userStoreId " +
  "WHERE b.userId = '" + "_BIND01" + "';"

const stringSQL = {
  s00001: sqlStores,
  s00001a: sqlStoresCashier,
  s00001b: sqlStoresNormal,
  s00002: sqlStore,
  s00002a: sqlStoreById,
  s00003a: sqlUserStoresTree,
  s00003b: sqlUserStoresLOV,
  s00004: sqlUpdateDefaultStore,
  s00005: sqlDefaultStore,
  s00006: sqlSaveUserStores,
  s00007: sqlUserStoresSaved
}

export function getStoreQuery (query, mode) {
  let sSQL
  switch (mode) {
    case 'allstores':
      sSQL = stringSQL.s00001
      break
    case 'allstores-cashier':
      sSQL = stringSQL.s00001a
      sSQL = sSQL.replace("_BIND01", query.cashier)
      break
    case 'allstores-normal':
      sSQL = stringSQL.s00001b
      break
    case 'store':
      sSQL = stringSQL.s00002
      sSQL = sSQL.replace("_BIND01", query.storeCode)
      break
    case 'storebyid':
      sSQL = stringSQL.s00002a
      sSQL = sSQL.replace("_BIND01", query.id)
      break
    case 'userstorestree':
      sSQL = stringSQL.s00003a
      sSQL = sSQL.replace("_BIND01", query.userId)
      break
    case 'userstoreslov':
      sSQL = stringSQL.s00003b
      sSQL = sSQL.replace("_BIND01", query.userId)
      break
    case 'updatedefaultstore':
      sSQL = stringSQL.s00004
      sSQL = sSQL.replace(/_BIND01/g, query.userId).replace("_BIND02", query.defaultStore)
      break
    case 'defaultstore':
      sSQL = stringSQL.s00005
      sSQL = sSQL.replace("_BIND01", query.userId)
      break
    case 'saveuserstore':
      sSQL = stringSQL.s00006[0].replace("_BIND01", query.userId)
      for (var i in query.store) {
        sSQL = sSQL + stringSQL.s00006[1].replace("_BIND01", query.userId).replace(/_BIND02/g, query.store[i])
      }
      if (query.defaultStore !== undefined) {
        sSQL = sSQL + stringSQL.s00006[2]
        sSQL = sSQL.replace("_BIND01", query.userId).replace("_BIND03", query.defaultStore)
      }
      break
    case 'userstoresaved':
      sSQL = stringSQL.s00007.replace("_BIND01", query.userId).replace("_BIND02", "'" + query.store.join("','") + "'")
      break
    default: sSQL = stringSQL.s00001; break          //all stores
  }

  console.log('sSQL', sSQL)
  return getNativeQuery(sSQL, false)
  // return new Promise(function (resolve, reject) {
  //   sequelize.query(sSQL, { type: sequelize.QueryTypes.SELECT })
  //     .then(data => {
  //       resolve(data)
  //     })
  // }).catch(err => (next(new ApiError(501, err, err))))
}

export function getStore (id) {
  return Store.findOne({
    where: {
      id: id
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
    return Store.count({
      where: {
        $or: querying
      },
    })
  } else {
    return Store.count({
      where: {
        ...other,
        storeParentId: {
          $ne: null
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
    return Store.findAll({
      attributes: query.field ? query.field.split(',') : null,
      where: {
        $or: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return Store.findAll({
      attributes: query.field ? query.field.split(',') : null,
      where: {
        ...other,
        storeParentId: {
          $ne: null
        }
      },
      order: order ? sequelize.literal(order) : null,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function srvStoreCodeExists (storeCode) {
  return srvGetStoreByCode(storeCode).then(store => {
    if (store == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function srvStoreIdExists (storeId) {
  return srvGetStoreById(storeId).then(store => {
    if (store == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function srvGetStoreByCode (storeCode) {
  return Store.findOne({
    where: {
      storeCode: storeCode
    },
    raw: false
  })
}
export function srvGetStoreById (storeId) {
  return Store.findOne({
    where: {
      id: storeId
    },
    raw: false
  })
}


export function srvCreateStore (store, createdBy, next) {
  return Store.create({
    storeCode: store.code,
    storeName: store.name,
    shortName: store.shortName,
    storeParentId: store.parent,
    address01: store.address01,
    address02: store.address02,
    cityId: store.cityId,
    state: store.state,
    zipCode: store.zipCode,
    mobileNumber: store.mobileNumber,
    phoneNumber: store.phoneNumber,
    email: store.email,
    companyName: store.companyName,
    taxID: store.taxID,
    taxConfirmDate: store.taxConfirmDate,
    taxType: store.taxType,
    initial: store.initial,
    latitude: store.latitude,
    longitude: store.longitude,
    cashierShift: store.cashierShift,
    cashierCounter: store.cashierCounter,
    settingValue: store.settingValue,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function srvUpdateStore (storeId, store, updateBy, next) {
  return Store.update({
    storeCode: store.code,
    storeName: store.name,
    storeParentId: store.parent,
    address01: store.address01,
    address02: store.address02,
    cityId: store.cityId,
    state: store.state,
    zipCode: store.zipCode,
    mobileNumber: store.mobileNumber,
    phoneNumber: store.phoneNumber,
    email: store.email,
    companyName: store.companyName,
    taxID: store.taxID,
    taxConfirmDate: store.taxConfirmDate,
    taxType: store.taxType,
    shortName: store.shortName,
    initial: store.initial,
    latitude: store.latitude,
    longitude: store.longitude,
    cashierShift: store.cashierShift,
    cashierCounter: store.cashierCounter,
    settingValue: store.settingValue, // 22
    updatedBy: updateBy
  },
    { where: { id: storeId } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvSetStoreInfo (request) {
  const getStoreInfo = {
    name: request.storeName,
    code: request.storeCode,
    shortName: request.shortName,
    parent: request.storeParentId,
    address01: request.address01,
    address02: request.address02,
    cityId: request.cityId,
    state: request.state,
    zipCode: request.zipCode,
    phoneNumber: request.phoneNumber,
    mobileNumber: request.mobileNumber,
    email: request.email,
    taxID: request.taxID,
    taxConfirmDate: request.taxConfirmDate,
    taxType: request.taxType,
    initial: request.initial,
    latitude: request.latitude,
    longitude: request.longitude,
    cashierShift: request.cashierShift,
    cashierCounter: request.cashierCounter,
    settingValue: JSON.parse(request.settingValue),
    createdBy: request.createdBy,
    createdAt: request.createdAt,
    updatedBy: request.updatedBy,
    updatedAt: request.updatedBy
  }

  return getStoreInfo
}

export function srvDeleteStore (storeId, next) {
  return Store.destroy({
    where: {
      id: storeId
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}