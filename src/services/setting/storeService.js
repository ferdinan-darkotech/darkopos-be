import { ApiError } from '../../services/v1/errorHandlingService'
import db from '../../models'
import sequelize from '../../native/sequelize'
import { getNativeQuery } from '../../native/nativeUtils'
import moment from 'moment'
import { Op, Sequelize } from 'sequelize'

const Store = db.tbl_store

const Fields = [
  'id',
  'storeCode',
  'storeName',
  'storeParentId',
  'address01',
  'address02'
]

const nativeField_store007 = `kode_kelurahan as "kode_kelurahan",storeid as "id", storecode as "storeCode",storename as "storeName",storeparentid as "storeParentId",address01 as "address01",address02 as "address02",cityid as "cityId",state as "state",zipcode as "zipCode",mobilenumber as "mobileNumber",phonenumber as "phoneNumber",email as "email",initial as "initial",shortname as "shortName",companyname as "companyName",taxid as "taxID",taxconfirmdate as "taxConfirmDate",taxtype as "taxType",
latitude as "latitude",longitude as "longitude", settingvalue as "settingValue", "icon_url", "website_url",
createdby as "createdBy",createdat as "createdAt",updatedby as "updatedBy",updatedat as "updatedAt"`


const sqlStores = "SELECT id, storecode, storename, storeparentid FROM sch_pos.tbl_store order by coalesce(storeparentid, -1) asc"
const sqlStore = "SELECT * FROM vw_store_001 WHERE lvl2Code = '" + "_BIND01" + "'"
// const sqlStoreById = "SELECT * FROM tbl_store WHERE id = '" + "_BIND01" + "'"
const sqlStoreById = "SELECT "+ nativeField_store007 +" FROM vw_store WHERE storeid = '" + "_BIND01" + "'"
const sqlStoreByCodeV2 = "SELECT * FROM sch_pos.tbl_store WHERE storecode = '" + "_BIND01" + "'"

const sqlUserStoresTree = "SELECT userStore, defaultStoreName FROM vw_user_store_list " +
  "WHERE userId = '" + "_BIND01" + "'"
// const sqlUserStoresLOV = "SELECT userStoreId as value, storeName as label " +
//   "FROM vwi_store_004 " +
//   "WHERE userId = '" + "_BIND01" + "' " +
//   "ORDER BY storeCodeLong"
//simplify this
// const sqlUserStoresLOV = `SELECT userStoreId as value, storeName as label, storeCode as code, storeCodeLong as longCode,
//   address01, address02, mobileNumber as "mobileNumber",
//   companyAddress01 as "companyAddress01", companyAddress02 as "companyAddress02", companyMobileNumber as "companyMobileNumber", companyPhoneNumber as "companyPhoneNumber",
//   taxID as "taxID", taxConfirmDate as "taxConfirmDate", taxType as "taxType", initial, shortname
//   FROM vwi_store_004
//   WHERE userId = '_BIND01'
//   ORDER BY storeCodeLong`

const sqlUserStoresLOV = `
  select storeid as value, storecode as code, storename as label, address01, address02, mobileNumber as "mobileNumber", taxID as "taxID", taxConfirmDate as "taxConfirmDate",
  companyAddress01 as "companyAddress01", companyAddress02 as "companyAddress02", companyMobileNumber as "companyMobileNumber", companyPhoneNumber as "companyPhoneNumber",
  companyName as "companyName", taxType as "taxType", initial, shortName as "shortName", level from sch_pos.vw_store_tree WHERE userId = '_BIND01'
`

const sqlUpdateDefaultStore = "UPDATE tbl_user_store SET defaultStore=0 WHERE userId = '" + "_BIND01" + "';" +
  "UPDATE tbl_user_store SET defaultStore=1 " +
  "WHERE userId = '" + "_BIND01" + "'" + " AND userStoreId = " +
  "(SELECT lvl2Id FROM vw_store_003 " +
  "WHERE lvl2AllCode = '" + "_BIND02" + "');"
const sqlDefaultStore = "SELECT defaultStoreName FROM vwi_store_006 " +
  "WHERE userId = '" + "_BIND01" + "'"
const sqlSaveUserStores = ["DELETE FROM tbl_user_store WHERE userId = '" + "_BIND01" + "'; ",
"\nINSERT into tbl_user_store (userId, userStoreId, defaultStore, createdAt, createdBy, updatedAt, updatedBy) " +
"VALUES('" + "_BIND01" + "', " + "cast(fnc_store_002('" + "_BIND02" + "') as int)" + ", 0, now(), '-', now(), '-');",
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
const sqlUserStoreExists = `
  select count(1) as countStore from tbl_user_store x join tbl_store y on x.userstoreid = y.id 
  where x.userid='_BIND01' and (y.storecode='_BIND02' or y.id::text='_BIND02');
`
// postgres required
const sqlUserStoreForReport = `
  select string_agg(s.id::text, ',') as storeid, string_agg(s.storecode::text, ',') as storecode from sch_pos.tbl_user_store x
  inner join sch_pos.tbl_store s on x.userstoreid = s.id
  where x.userid = '_BIND01' and s.report_outlet = true;
`
const sqlStoreAge = `
  select
    storename,
    concat(
      date_part('year', age(now(), createdat)) || ' TAHUN ',
      date_part('month', age(now(), createdat)) || ' BULAN '
    ) as agestore
  from sch_pos.tbl_store where id = _BIND01;
`

const settingStore = `
  select x.storecode, x.storename, x.settingvalue as setting, y.settingvalue as settingparent from sch_pos.tbl_store x
  left join sch_pos.tbl_store y on x.storeparentid = y.id
  where x.id = _BIND01;
`

const settingStoreByHO = `
  select x.settingvalue as setting, y.settingvalue as settingparent from sch_pos.tbl_store x
  left join sch_pos.tbl_store y on x.ho_id = y.id
  where x.storecode = '_BIND01';
`

const stringSQL = {
  s00001: sqlStores,
  s00001a: sqlStoresCashier,
  s00001b: sqlStoresNormal,
  s00002: sqlStore,
  s00002a: sqlStoreById,
  s00002ab: sqlStoreByCodeV2,
  s00003a: sqlUserStoresTree,
  s00003b: sqlUserStoresLOV,
  s00004: sqlUpdateDefaultStore,
  s00005: sqlDefaultStore,
  s00006: sqlSaveUserStores,
  s00007: sqlUserStoresSaved,
  s00008: sqlUserStoreExists,
  s00009: sqlUserStoreForReport,
  s00010: sqlStoreAge,
  s00011: settingStore,
  s00012: settingStoreByHO
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
    case 'storebycodeV2':
        sSQL = stringSQL.s00002ab
        sSQL = sSQL.replace("_BIND01", query.storecode)
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
    case 'userstoreexists':
      sSQL = stringSQL.s00008.replace("_BIND01", query.user).replace(/_BIND02/g, query.store)
      break
    case 'userstorereport':
      sSQL = stringSQL.s00009.replace("_BIND01", query.user)
      break
    case 'storeage':
      sSQL = stringSQL.s00010.replace("_BIND01", query.store)
      break
    case 'settingstore':
      sSQL = stringSQL.s00011.replace("_BIND01", query.store)
      break
    case 'settingstorebyho':
      sSQL = stringSQL.s00012.replace("_BIND01", query.store)
      break
    default: sSQL = stringSQL.s00001; break          //all stores
  }

  console.log('\nsSQL\n', sSQL)
  return getNativeQuery(sSQL, false).catch(er => console.log('>>>>>>>>>>>>>>>>', er))
  // return new Promise(function (resolve, reject) {
  //   sequelize.query(sSQL, { type: sequelize.QueryTypes.SELECT })
  //     .then(data => {
  //       resolve(data)
  //     })
  // }).catch(err => (next(new ApiError(501, err, err))))
}

export function getAllStorePositionByPrefix (prefix) {
  return Store.findAll({
    attributes: ['storecode', 'storename', 'latitude', 'longitude'],
    where: {
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
      '': Sequelize.literal(`jsonb_extract_path_text(settingvalue::jsonb, variadic array['notifSetting', 'prefix']) = '${prefix}'`)
    },
    raw: true
  })
}


export function getStore (id) {
  return Store.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function getAllStoreByCode (listStore = []) {
  return Store.findAll({
    where: {
      storecode: { [Op.in]: listStore }
    },
    raw: true
  })
}

export function countData (query) {
  const { type, field, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { [Op.between]: query[key] }
    } else if (type !== 'all') {
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
    return Store.count({
      where: {
        [Op.or]: querying
      },
    })
  } else {
    return Store.count({
      where: {
        ...other,
        storeParentId: {
          [Op.ne]: null
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
        [Op.or]: querying
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
          [Op.ne]: null
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
export function srvGetStoreById (storeId, attributes = []) {
  return Store.findOne({
    ...(attributes.length > 0 ? { attributes } : {}),
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
    settingValue: JSON.stringify(store.settingValue),
    createdBy: createdBy,
    updatedBy: '---',
    createdAt: moment(),

    // [STORE GET REGION]: FERDINAN - 2025-06-11
    kode_kelurahan: store.kode_kelurahan
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
    settingValue: JSON.stringify(store.settingValue), // 22
    updatedBy: updateBy,
    updatedAt: moment(),

    // [STORE GET REGION]: FERDINAN - 2025-06-11
    kode_kelurahan: store.kode_kelurahan
  },
    { where: { id: +storeId } }
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
    settingValue: request.settingValue,
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
