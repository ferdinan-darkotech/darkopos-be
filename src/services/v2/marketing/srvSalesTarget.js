import db from '../../../models/tableR'
import dbv from '../../../models/viewR'
import { getNativeQuery } from '../../../native/nativeUtils'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { setDefaultQuery } from '../../../utils/setQuery'
const sequelize = require('sequelize')

const fullAttributesHeader = [ 'id', 'storeid', 'storecode', 'storename', 'rangetarget', 'startdate', 'enddate', 'createdby',
                               'createdat', 'updatedby', 'updatedat', 'othertarget' ]

const fullAttributesDetail = [ 'id', 'referenceId', 'storeCode', 'storeName', 'categoryCode', 'categoryName',
                               'brandCode', 'brandName', 'startDate', 'endDate', 'targetSalesQty', 'targetSalesValue' ]


const targetHeader = db.tbh_target
const targetDetail = db.tbd_target
const targetOther = db.tbl_target_other
const vwHeader = dbv.vw_target
const vDTarget003 = dbv.vw_target_detail

exports.srvGetTargetHeader = function (query) {
  const { date: qDate, m, mode, ...other } = query
  let queryDefault = setDefaultQuery(fullAttributesHeader, other, true)
  queryDefault.where = { ...queryDefault.where, startDate: { [sequelize.Op.gte]: qDate } }
  return vwHeader.findAndCountAll({
    attributes: fullAttributesHeader,
    ...queryDefault,
    raw: false
  })
}

exports.srvGetTargetDetail = function (req) {
  let where = {}
  const { storeCode, date } = req.query
  return vDTarget003.findAndCountAll({
    attributes: fullAttributesDetail,
    where: {
      storeCode,
      startDate: { [sequelize.Op.between]: date }
    },
    order: ['startDate', 'endDate'],
    raw: false
  })
}

exports.srvGetTargetDetailByReference = function (params) {
  return vDTarget003.findAndCountAll({
    attributes: fullAttributesDetail,
    where: { referenceId: params.referenceId  },
    raw: false
  })
}

exports.srvCheckExistTargetHeader = function (storeId, rangeTarget, next) {
  return targetHeader.findOne({
    attributes: ['*'],
    where: { storeId, startDate: rangeTarget[0], endDate: rangeTarget[1] },
    raw: false
  })
  .then(target => {
    return (target || {}).id
  })
  .catch(er => next(new ApiError(400, er.message)))
}

exports.srvCreateTargetHeader = function (data, next, transaction) {
  return targetHeader.bulkCreate(data, { transaction, returning: ['id'] })
}

exports.srvCreateTargetDetail = function (data, next, transaction) {
  return targetDetail.bulkCreate(data, { transaction, returning: ['categoryId'] })
}

exports.srvCreateTargetOther = function (data, next, transaction) {
  return targetOther.bulkCreate(data, { transaction })
}

export function srvModifyTarget (data, userid) {
  let { headerid, TARGET_UNIT = 0, TARGET_SERVICE = 0, detail = [] } = data 
  const otherTarget = JSON.stringify({ TARGET_SERVICE, TARGET_UNIT })
  const tmpDetail = JSON.stringify(detail)
  const modifyTargetQuery = `select * from sch_pos.fn_modify_detail_target('${otherTarget}', '${tmpDetail}', ${headerid}, '${userid}') value`
  return getNativeQuery(modifyTargetQuery, true, 'CALL')
}