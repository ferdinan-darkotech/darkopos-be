import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import sequelize from '../../../../native/sequelize'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { getMiscByCodeName } from '../../../v1/miscService'
import { srvGetFinancialProviderByCode } from '../finance/srvFinancialProvider'
const Op = require('sequelize').Op

const table = db.tbm_payment_option
const view = dbv.vwi_payment_option

// SELECT parentCode, code, paymentTypeName, providerName,
// concat(paymentTypeName,if(parentCode is null,'',concat('-',providerName))) as name
// FROM vwi_payment_option_003
// SELECT parentCode, code, paymentTypeName, providerName,
//        concat(if(parentCode IS NULL, '', parentCode),
//               if(parentCode IS NULL, paymentTypeName, concat('-', providerName))
//              ) AS name
// FROM vwi_payment_option_003;
const idField = ['id']
const minFields01 = [
  'code',
  'parentCode',
  [sequelize.literal(`
    (
      case 
        when parentCode is not null then concat(parentCode, ':',providerName)
        else paymentTypeName end
    )`)
    ,'name'
  ]
]
const minFields02 = [
  'parentCode',
  'code',
  'paymentTypeCode',
  'paymentTypeName',
  'providerTypeCode',
  'providerTypeName',
  'providerCode',
  'providerName',
  'status'
]
const minFields03 = [
  'code',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]
const mainFields = [
  'id',
  'parentId',
  'parentCode',
  'code',
  'paymentTypeCode',
  'paymentTypeName',
  'providerTypeCode',
  'providerTypeName',
  'providerCode',
  'providerName',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

export function srvGetSomePaymentOptionByCode (listCode) {
  return table.findAll({
    attributes: [ 'id', 'code' ],
    where: { code: { $in: listCode } },
    raw: true
  })
}

export function srvGetPaymentOptions (query) {
  let { pageSize, page, order, searchText, ...other } = query
  let sort = (order) ? getSelectOrder(order) : null

  let modeField = 'min'
  let limitQuery = {
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
  }

  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (mode.includes('mf')) modeField = 'main'
    if (mode.includes('ar')) limitQuery = {}
    if (mode.includes('lov')) { modeField = 'lov'; limitQuery = {}; sort = ['paymentTypeId','code'] }
  }

  let attributes = minFields02
  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'min': attributes = minFields02; break
    case 'lov': attributes = minFields01; break
    default: attributes = minFields02
  }
  return view.findAndCountAll({
    attributes,
    order: sort,
    where: { code: { [Op.regexp]: searchText ? searchText : '' } },
    ...limitQuery,
    raw: false
  })
}

export async function srvGetPaymentOptionByCode (code, mode) {
  // only get id for next operation (save parentId to child record)
  const attributes = (mode==='getid') ? idField : minFields02
  return view.findOne({
    attributes,
    where: { code },
    raw: false
  })
}

export async function srvGetPaymentOptionById (id) {
  return table.findOne({
    attributes: minFields03,
    where: { id },
    raw: false
  })
}

export function srvPaymentOptionExist (code) {
  return srvGetPaymentOptionByCode(code).then(data => {
    return (data) ? true : false
  })
}

export async function srvCreatePaymentOption (data, createdBy, next) {
  const parent = (data.parentCode) ? await srvGetPaymentOptionByCode(data.parentCode,'getid') : null
  const paymentType =  (data.paymentType) ? await getMiscByCodeName('FINPAYMENT', data.paymentType) : null
  const provider = (data.providerCode) ?  await srvGetFinancialProviderByCode(data.providerCode, 'main') : null
  return table.create({
    parentId: (parent) ? parent.id : null,
    code: data.code,
    paymentTypeId: (paymentType) ? paymentType.id : null,
    providerId: (provider) ? provider.id : null,
    status: +data.status,
    createdBy: createdBy,
    updatedBy: null
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const {
      parent,
      original,
      sql,
      ...other
    } = errObj
    next(new ApiError(400, other, err))
  })
}

export function srvUpdatePaymentOption (data, updatedBy, next) {
  return table.update({
      status: +data.status,
      updatedBy: updatedBy
    }, {
      where: { code: data.code }
    }).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const {
        parent,
        original,
        sql,
        ...other
      } = errObj
      next(new ApiError(501, other, err))
    })
}

export function srvDeletePaymentOption (code) {
  return table.destroy({
    where: { code }
  }).catch(err => (next(new ApiError(501, err, err))))
}

