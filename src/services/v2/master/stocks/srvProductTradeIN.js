import moment from 'moment'
import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import sequelize from '../../../../native/sequelize'
import { getNativeQuery } from '../../../../native/nativeUtils'
import { setDefaultQuery } from '../../../../utils/setQuery'
import { createAdjust } from '../../../adjustService'
import { Sequelize } from 'sequelize'

const Op = require('sequelize').Op

const tbProductTradeIn = db.tbl_product_trade_in
const tbBuyProductTradeIn = db.tbl_buy_product_trade_in


const vwStockProductSecond = dbv.vw_stock_product_second

const vwProductTradeIn = dbv.vw_product_trade_in
const vwStockProductTradeIn = dbv.vw_stock_product_trade_in
const tbLogProductTradeIn = db.tbl_product_trade_in_changelog


const attrProductSecond = ['store_code', 'store_name', 'product_code', 'product_name', 'qty_in', 'qty_out', 'qty_onhand']

const attrProductTradeIN = {
  mf: [
    'product_trd_id', 'product_id', 'product_code', 'product_name', 'category_id', 'category_code', 'category_name', 'brand_id', 'brand_code',
    'brand_name', 'store_id', 'store_code', 'store_name', 'sell_price', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'
  ],
  bf: [
    'product_trd_id', 'product_code', 'product_name', 'category_code', 'category_name', 'brand_code', 'brand_name', 'store_code',
    'store_name', 'sell_price', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'
  ],
  mnf: [
    'product_trd_id', 'product_code', 'product_name', 'category_name', 'brand_name', 'sell_price'
  ],
  lov: [
    'product_trd_id', 'product_code', 'product_name', 'sell_price'
  ]
}

const attrChangeLogs = ['changelog_id', 'product_trd_id', 'sell_price', 'status', 'created_by', 'created_at']

const attrBuyProductTradeIn = {
  mf: ['stock_buy_id', 'sales_no', 'product_id', 'store_id', 'qty', 'price', 'disc_p', 'disc_n', 'conditions', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'],
  mnf: ['stock_buy_id', 'sales_no', 'product_id', 'store_id', 'qty', 'price', 'disc_p', 'disc_n', 'conditions', 'status']
}

const attrStockProductTradeIN = {
  mf: [
    'stock_id', 'sales_no', 'store_id', 'store_code', 'store_name', 'product_id', 'product_code', 'product_name', 'qty', 'sell_price',
    'price', 'disc_n', 'disc_p', 'conditions', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at', 'ref_id'
  ],
  bf: [
    'stock_id', 'sales_no', 'store_code', 'store_name', 'product_code', 'product_name', 'qty', 'price', 'disc_n', 'disc_p', 'sell_price',
    'conditions', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at', 'ref_id'
  ],
  mnf: [
    'stock_id', 'sales_no', 'store_code', 'store_name', 'product_code', 'product_name', 'qty', 'price', 'disc_n', 'disc_p', 'sell_price',
    'conditions', 'status', 'ref_id'
  ]
}



export function srvGetLogProductTradeIn (product_trd_id = null) {
  // const { brand, category, product } = query
  return tbLogProductTradeIn.findAll({
    attributes: attrChangeLogs,
    where: { product_trd_id },
    order: [['created_at', 'DESC']],
    raw: true
  })
}

export function srvGetStockTradeInPerInvoices ({ store, product }) {
  return vwStockProductTradeIn.findAll({
    attributes: ['stock_id', [Sequelize.literal('concat(sales_no, \' (\', conditions::numeric(16,2), \' Ah)\')'), 'sales_no']],
    where: { store_code: store, product_code: product, status: '01' },
    raw: true
  })
}

export function srvGetExistsTradeInByStoreProducts (clause = [{ store: null, product: null }]) {
  const filtering = clause.map(x => ({ product_id: x.product, store_id: x.store }))

  return tbProductTradeIn.findAll({
    attributes: ['product_trd_id', 'store_id', 'product_id'],
    where: { $or: filtering },
    raw: true
  })
}

export function srvGetExistsTradeInByIdStore (clause = [{ id: null, store: null }], activeOnly = false) {
  const filtering = clause.map(x => ({ product_trd_id: x.id, store_code: x.store }))

  return vwProductTradeIn.findAll({
    attributes: ['product_trd_id', 'store_id', 'product_id'],
    where: {
      $and: [{ $or: filtering }, ...((activeOnly || false).toString() === 'true' ? [{ status: true }] : [])]
    },
    raw: true
  })
}


export function srvGetProductTradeIn (query = {}, store = null) {
  const { mode, activeOnly = false, ...other } = query
  const tmpAttr = attrProductTradeIN[mode] || attrProductTradeIN.mnf
  let queryDefault = setDefaultQuery(attrProductTradeIN.bf, { ...other }, true)
  queryDefault.where = {
    ...queryDefault.where,
    store_code: store,
    ...((activeOnly || false).toString() === 'true' ? { status: { $eq: true } } : {})
  }

  return vwProductTradeIn.findAndCountAll({
    attributes: tmpAttr,
    ...queryDefault,
    raw: true
  })
}

export async function srvModifierProductTradeIn (data = [], userid) {
  const transaction = await sequelize.transaction()
  const timeNow = moment()
  try {
    let addNew = []
    let updateExisting = []

    for(let k in data) {
      const items = data[k]
      if(typeof items.product_trd_id === 'string') {
        updateExisting.push(
          tbProductTradeIn.update({
            sell_price: items.sell_price,
            status: items.status,
            updated_by: userid,
            updated_at: timeNow
          }, { where: { product_trd_id: items.product_trd_id }, transaction })
        )
      } else {
        addNew.push({
          product_id: items.product,
          store_id: items.store,
          sell_price: items.sell_price,
          status: items.status,
          created_by: userid,
          created_at: timeNow
        })
      }
    }

    const bulkCreateData = tbProductTradeIn.bulkCreate(addNew, { transaction })

    await Promise.all([bulkCreateData, ...updateExisting])
    
    await transaction.commit()
      
    return { success: true, message: 'Data has been modified.' }
  } catch (er) {
    await transaction.rollback()
    throw new Error(er.message)
  }
}

export async function srvCreateBulkBuyProductTradeIn (data = [], info = {}, transaction) {

  const automate = (info.automate || {})
  const tmpData = Array.isArray(data) ? data : []
  
  // Prepare the automate transaction of adjustment-in
  let totalPrice = 0
  let totalQty = 0

  let adjustHeader = {
    storeId: info.store,
    transDate: info.times,
    reference: info.sales_no,
    picId: 'ATTRD01',
    pic: '-',
    memo: `TRADE-IN;${info.sales_no}`,
    transType: 'AJIN',
    totalprice: totalPrice,
    totaldpp: 0,
    totalppn: 0,
    totalnetto: 0,
  }
  let adjustDetail = []

  if(data.length > 0) {
    const tradeIn = tmpData.map(x => {
      totalPrice += x.price
      adjustHeader.totalprice += x.price
      adjustHeader.totaldpp += x.price
      adjustHeader.totalnetto += x.price
      totalQty += 1
      
      return {
        product_trade_in_id: x.product_trade_in_id,
        product_id: x.product,
        sales_no: info.sales_no,
        ref_id: x.ref_id,
        store_id: info.store,
        qty: 1,
        price: x.price,
        disc_p: x.disc_p,
        disc_n: x.disc_n,
        conditions: x.conditions,
        created_by: info.users,
        created_at: info.times
      }
    })

    adjustDetail.push({
      storeId: info.store,
      transType: 'AJIN',
      productId: automate.product,
      adjInQty: totalQty,
      adjOutQty: 0,
      sellingPrice: totalPrice,
      refno: info.sales_no,
      taxtype: 'E',
      taxval: 0,
      dpp: adjustHeader.totaldpp,
      ppn: adjustHeader.totalppn,
      netto: adjustHeader.totalnetto
    })

    if(automate.status) {
      await createAdjust(adjustHeader, totalPrice, adjustDetail, info.users, false, transaction)
      console.log(info.automate)
    }
    return tbBuyProductTradeIn.bulkCreate(tradeIn, { transaction })
  } else {
    return null
  }
}


export function srvGetExistingStockProductTradeInById (listID = []) {
  const mappingID = listID.map(x => ({ stock_buy_id: x }))

  return tbBuyProductTradeIn.findAll({
    attributes: attrBuyProductTradeIn.mf,
    where: { $or: mappingID, status: '01' },
    raw: true
  })
}


export function srvGetStockProductTradeIn (query = {}, store = []) {
  const { mode, activeOnly = false, ...other } = query
  const tmpAttr = attrStockProductTradeIN[mode] || attrStockProductTradeIN.mnf
  let queryDefault = setDefaultQuery(attrStockProductTradeIN.bf, { ...other }, true)
  queryDefault.where = {
    ...queryDefault.where,
    store_code: { $in: store },
    ...((activeOnly || false).toString() === 'true' ? { status: '01' } : {})
  }

  return vwStockProductTradeIn.findAndCountAll({
    attributes: tmpAttr,
    ...queryDefault,
    raw: true
  })
}

export function srvGetStockProductSecond (query = {}, store = []) {
  const { mode, onhand = false, ...other } = query
  let queryDefault = setDefaultQuery(attrProductSecond, { ...other }, true)
  queryDefault.where = {
    ...queryDefault.where,
    store_code: { $in: store },
    ...((onhand || false).toString() === 'true' ? { qty_onhand: { $gt: 0 } } : {})
  }

  return vwStockProductSecond.findAndCountAll({
    attributes: attrProductSecond,
    ...queryDefault,
    raw: true
  })
}

export function srvGetAllStockProductTradeIn (salesNo = '', refId = [], mode = null) {
  let tmpRef = Array.isArray(refId) ? refId : []
  return vwStockProductTradeIn.findAll({
    attributes: (attrStockProductTradeIN[mode] || attrStockProductTradeIN.mnf),
    where: {
      sales_no: salesNo,
      ref_id: { in: tmpRef }
    },
    raw: true
  })
}