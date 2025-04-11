import { ApiError } from '../../services/v1/errorHandlingService'
import db from '../../models'
import sequelize from '../../native/sequelize'

const tbl_store = db.tbl_store

const sqlStores = "SELECT lvl2Name as storeName, shortName,address01,address02,mobileNumber,latitude,longitude " +
  "FROM vw_store_001 ORDER BY lvl2Code"

const stringSQL = {
  s00001: sqlStores,
}

export function getStoreQuery (query, mode) {
  let sSQL
  switch (mode) {
    case 'alloutlet':
      sSQL = stringSQL.s00001
      break
    default: sSQL = stringSQL.s00001; break          //all outlets
  }

  console.log('sSQL', sSQL)
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, { type: sequelize.QueryTypes.SELECT })
      .then(data => {
        resolve(data)
      })
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function getStore (id) {
  return tbl_store.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function updateStore (id, data, updateBy, next) {
  return tbl_store.update({
    storeCode: data.storeCode,
    storeName: data.storeName,
    storeParentId: data.storeParentId,
    address01: data.address01,
    address02: data.address02,
    cityId: data.cityId,
    state: data.state,
    zipCode: data.zipCode,
    mobileNumber: data.mobileNumber,
    phoneNumber: data.phoneNumber,
    email: data.email,
    companyName: data.companyName,
    taxID: data.taxID,
    taxConfirmDate: data.taxConfirmDate,
    taxType: data.taxType,
    initial: data.initial,
    updatedBy: updateBy
  },
    { where: { id: id } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}