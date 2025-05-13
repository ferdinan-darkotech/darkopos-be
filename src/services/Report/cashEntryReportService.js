import { Op } from 'sequelize'
import dbv from '../../models/view'
import sequelize from '../../native/sequelize'

const vw_cash_entry_detail = dbv.vw_cash_entry_detail

const grouping02 = [
  'id', 'transnoid', 'accountid', 'description', 'storeid', 'transno', 'transdate', 'reference', 'supplierid', 'suppliercode',
  'suppliername', 'memberid', 'membercode', 'membername', 'type', 'cashiertransid', 'cashierid', 'period', 'status'
]
const reportTransFields = [
  'id',
  'transcreatePosNoId',
  'accountId',
  'amountIn',
  'amountOut',
  'description',
  'storeId',
  'transNo',
  'transDate',
  'reference',
  'supplierId',
  'supplierCode',
  'supplierName',
  'memberId',
  'memberCode',
  'memberName',
  'type',
  'transType',
  'accountCode',
  'typeCode',
  'cashierTransId',
  'cashierId',
  'period',
  'status'
]

const reportTransDetailFields = [
  'id',
  'transNoId',

  'accountId',
  'accountDetailCode',
  'accountName',

  'amountIn',
  'amountOut',
  'description',

  'storeId',
  'transNo',
  'transDate',
  'reference',

  'supplierId',
  'supplierCode',
  'supplierName',

  'memberId',
  'memberCode',
  'memberName',

  'type',

  'cashierTransId',
  'cashierId',
  'period',

  'status'
]

export function getByTrans (query) {
  const { from, to, storeId, field, fielddetail, order, sort, ...other } = query
  let newAttr = fielddetail ? fielddetail.split(',') : reportTransDetailFields
  newAttr[newAttr.indexOf('amountIn')] = [sequelize.literal('sum(amountIn)'), 'amountIn']
  newAttr[newAttr.indexOf('amountOut')] = [sequelize.literal('sum(amountOut)'), 'amountOut']

  if (from && to && storeId) {
    return vw_cash_entry_detail.findAll({
      attributes: newAttr,
      where: {
        transDate: {
          [Op.between]: [from, to]
        },
        storeId: storeId,
        ...other
      },
      group: grouping02,
      order: order ? sequelize.literal(order) : null,
      raw: false
    })
  }
  return vw_cash_entry_detail.findAll({
    attributes: newAttr,
    where: {
      storeId: storeId,
      ...other
    },
    group: grouping02,
    order: order ? sequelize.literal(order) : null,
    raw: false
  })
}

export function getByDetail (query) {
  const { from, to, storeId, field, fielddetail, order, sort, ...other } = query
  let newAttr = fielddetail ? fielddetail.split(',') : reportTransDetailFields
  newAttr[newAttr.indexOf('amountIn')] = [sequelize.literal('sum(amountIn)'), 'amountIn']
  newAttr[newAttr.indexOf('amountOut')] = [sequelize.literal('sum(amountOut)'), 'amountOut']


  if (from && to && storeId) {
    return vw_cash_entry_detail.findAll({
      attributes: newAttr,
      where: {
        transDate: {
          [Op.between]: [from, to]
        },
        storeId: storeId,
        ...other
      },
      group: grouping02,
      order: order ? sequelize.literal(order) : null,
      raw: false
    })
  }
  return vw_cash_entry_detail.findAll({
    attributes: newAttr,
    where: {
      storeId: storeId,
      ...other
    },
    group: grouping02,
    order: order ? sequelize.literal(order) : null,
    raw: false
  })
}