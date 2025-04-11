import dbv from '../../../models/viewR'
import db from '../../../models/tableR'
import moment from 'moment'
import { Op as _OP } from 'sequelize'
import sequelize from '../../../native/sequelize'
import { getNativeQuery } from '../../../native/nativeUtils'
import { setDefaultQuery } from '../../../utils/setQuery'
import { insertPosHeaderBulk, insertPosDetail } from '../../posService'
import { calculateTax } from '../../../utils/operate/objOpr'
import { getSequenceFormatByCode } from '../../sequenceService'
import { increaseSequenceV2 } from '../../sequencesService'
import { createBulkPaymentV2 } from '../../payment/paymentService'


const tbSalesProductTradeIn = db.tbl_sales_product_trade_in
const tbSalesProductTradeInDetail = db.tbl_sales_product_trade_in_detail
const vwSalesProductTradeIn = dbv.vw_sales_product_trade_in
const vwSalesProductTradeInDetail = dbv.vw_sales_product_trade_in_detail

const attrSalesProductTradeIn = {
  mf: [
    'trans_id', 'trans_no', 'trans_date', 'store_id', 'store_code', 'store_name', 'vendor_id', 'vendor_code',
    'vendor_name', 'address', 'phone_number', 'total_qty', 'total_price', 'total_discount', 'grand_total', 'status',
    'created_by', 'created_at', 'updated_by', 'updated_at', 'pic_id', 'pic_code', 'pic_name', 'pic_phone_number'
  ],
  bf: [
    'trans_id', 'trans_no', 'trans_date', 'store_code', 'store_name', 'vendor_code', 'vendor_name', 'address',
    'phone_number', 'total_qty', 'total_price', 'total_discount', 'grand_total', 'status',
    'created_by', 'created_at', 'updated_by', 'updated_at', 'pic_code', 'pic_name', 'pic_phone_number'
  ],
  mnf: [
    'trans_id', 'trans_no', 'trans_date', 'store_name', 'vendor_name', 'address', 'phone_number', 'total_qty',
    'total_price', 'total_discount', 'grand_total', 'status', 'pic_code', 'pic_name', 'pic_phone_number'
  ]
}

const attrSalesProductTradeInDetail = {
  mf: [
    'trans_dtl_id', 'trans_id', 'trans_no', 'so_no', 'sales_no', 'trans_date', 'buy_date', 'store_id', 'store_code', 'store_name', 'store_src_id',
    'store_src_code', 'store_src_name', 'product_id', 'product_code', 'product_name', 'qty', 'price', 'disc_p', 'disc_n', 'status', 'created_by',
    'created_at', 'updated_by', 'updated_at', 'conditions', 'weight'
  ],
  bf: [
    'trans_dtl_id', 'trans_no', 'so_no', 'sales_no', 'trans_date', 'buy_date', 'store_code', 'store_name', 'store_src_code', 'store_src_name',
    'product_code', 'product_name', 'qty', 'price', 'disc_p', 'disc_n', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at',
    'conditions', 'weight'
  ],
  mnf: [
    'trans_dtl_id', 'trans_no', 'so_no', 'sales_no', 'trans_date', 'buy_date', 'store_name', 'store_src_name',
    'product_name', 'qty', 'price', 'disc_p', 'disc_n', 'status', 'conditions', 'weight'
  ]
}


export function srvGetSalesProductTradeIn (query) {
  const { store, mode, activeOnly, ...other } = query
  let tmpAttrs = attrSalesProductTradeIn[mode] || attrSalesProductTradeIn.mnf

  let queryDefault = setDefaultQuery(attrSalesProductTradeIn.bf, { ...other }, true)
  
  queryDefault.where = {
    ...queryDefault.where,
    store_code: store,
    ...((activeOnly || false).toString() === 'true' ? { status: '01' } : {})
  }
  
  return vwSalesProductTradeIn.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvGetSalesProductTradeInDetail (store = null, trans = null, mode = '') {
  return vwSalesProductTradeInDetail.findAll({
    attributes: attrSalesProductTradeInDetail[mode] || attrSalesProductTradeInDetail.mnf,
    where: {
      trans_id: trans,
      store_code: store
    },
    raw: true
  })
}

export function srvCheckExistSalesProductTradeIn (trans = '', store = null) {
  return tbSalesProductTradeIn.findOne({
    attributes: ['*'],
    where: { trans_id: trans, store_id: store },
    raw: true
  })
}

async function automateTradeOut (data = {}, info = {}, automate = {}, taxes = {}, transaction) {
  // insertPosDetail
  try {
    const details = (data.details || [])

    let listStores= []

    let mappingHeaders = []
    let mappingDetails = []
    let mappingPayments = []

    for (let x in details) {
      const items = details[x]

      let indexs = listStores.indexOf(items.store_src_id)
      if(indexs === -1) {
        const sequence = await getSequenceFormatByCode({ seqCode: 'INV', type: items.store_src_id })
        await increaseSequenceV2('INV', items.store_src_id, transaction)

        listStores.push(items.store_src_id)
        indexs = listStores.length - 1

        mappingDetails.push({
          transNo: sequence,
          storeId: items.store_src_id,
          employeeId: automate.pic,
          productId: automate.product,
          productCode: '-',
          qty: 0,
          typeCode: 'P',
          sellPrice: 0,
          sellingPrice: 0,
          DPP: 0,
          PPN: 0,
          discount: 0,
          disc1: 0,
          updatestock: true,
          creadtedBy: info.users,
          createdAt: info.times
        })

        mappingHeaders.push({
          transNo: sequence,
          storeId: items.store_src_id,
          transDate: data.trans_date,
          technicianId: automate.picCode,
          memberCode: automate.member,
          cashierTransId: -1,
          transTime: moment(info.times).format('HH:mm:ss'),
          taxType: taxes.type,
          taxval: taxes.percent,
          paymentVia: 'C',
          creadtedBy: info.users,
          createdAt: info.times,
          total: 0,
          discount: 0,
          paid: 0,
          total_dpp: 0,
          total_ppn: 0,
          total_netto: 0,
          total_products: 0
        })

        mappingPayments.push({
          storeId: items.store_src_id,
          storeIdPayment: items.store_src_id,
          cashierTransId: null,
          paymentOptionId: 1,
          typeCode: 'C',
          amount: 0,
          printDate: info.times,
          transDate: info.times,
          createdBy: info.users
        })
      }

      const newPrice = calculateTax({
        price: items.price,
        qty: items.qty,
        disc1: items.disc_p,
        discnominal: items.disc_n
      }, (taxes.type || 'E'), (taxes.percent || 0))

      mappingDetails[indexs].qty += items.qty
      mappingDetails[indexs].sellPrice += items.price
      mappingDetails[indexs].sellingPrice += items.price
      mappingDetails[indexs].DPP += newPrice.dpp
      mappingDetails[indexs].PPN += newPrice.ppn
      mappingDetails[indexs].discount += newPrice.discount

      mappingHeaders[indexs].total += newPrice.price
      mappingHeaders[indexs].discount += newPrice.discount
      mappingHeaders[indexs].paid += newPrice.netto
      mappingHeaders[indexs].total_dpp += newPrice.dpp
      mappingHeaders[indexs].total_ppn += newPrice.ppn
      mappingHeaders[indexs].total_netto += newPrice.netto
      mappingHeaders[indexs].total_products += items.qty

      mappingPayments[indexs].amount += newPrice.netto
    }
    
    const createdHeader = await insertPosHeaderBulk(mappingHeaders, transaction)
    const posHeader = JSON.parse(JSON.stringify(createdHeader))

    const newPayments = mappingPayments.map(a => ({
      ...a,
      reference: (posHeader.data.filter(b => b.storeId === a.storeId)[0] || {}).id
    }))

    await insertPosDetail(mappingDetails, transaction)
    await createBulkPaymentV2(newPayments, transaction)

  } catch (er) {
    throw new Error(er.message)
  }
}

export async function srvCreateSalesProductTradeIn (data = {}, info = {}, automate = {}, taxes = {}) {
  const transaction = await sequelize.transaction()
  try {
    const { status: statusAutomate, ...configAutomate } = (automate || {})
    const details = (data.details || [])

    const totals = details.reduce((x, y) => ({
      price: x.price + (parseFloat(new Number(y.price)) * parseInt(new Number(y.qty))),
      qty: x.qty + parseInt(new Number(y.qty)),
      discount: x.discount + (((parseFloat(new Number(y.price)) * parseInt(new Number(y.qty))) * (parseFloat(new Number(y.disc_p)) / 100)) + parseFloat(new Number(y.disc_n)))
    }), { price: 0, qty: 0, discount: 0 })
    
    // create header data
    const createdHeader = await tbSalesProductTradeIn.create({
      trans_date: data.trans_date,
      store_id: info.store,
      vendor_id: data.vendor_id,
      total_qty: totals.qty,
      pic_id: data.pic_id,
      total_price: totals.price,
      total_discount: totals.discount,
      created_by: info.users,
      created_at: info.times,
    }, { transaction, raw: true, returning: ['*'] })

    // create details data
    let newDetails = []

    for (let x in details) {
      const items = details[x]

      newDetails.push({
        trans_date: createdHeader.trans_date,
        buy_date: items.buy_date,
        trans_id: createdHeader.trans_id,
        trans_no: createdHeader.trans_no,
        sales_no: items.sales_no,
        weight: (items.weight || 0.00),
        so_no: (items.so_no || null),
        product_id: items.product_id,
        product_src_id: items.product_src_id,
        store_id: createdHeader.store_id,
        store_src_id: items.store_src_id,
        qty: parseInt(new Number(items.qty)),
        price: parseFloat(new Number(items.price)),
        disc_p: parseFloat(new Number(items.disc_p)),
        disc_n: parseFloat(new Number(items.disc_n)),
        created_by: info.users,
        created_at: info.times,
      })
    }

    statusAutomate ? await automateTradeOut(data, info, configAutomate, taxes, transaction) : null

    await tbSalesProductTradeInDetail.bulkCreate(newDetails, { transaction, raw: true })
    await transaction.commit()
    return { success: true, message: `Transaction has been saved with using ${createdHeader.trans_no}`, trans_no: createdHeader.trans_no }
  } catch (er) {
    console.log(er.message)
    await transaction.rollback()
    throw new Error('Something went wrong, when validate the data.')
  }
}

export async function srvCancelSalesProductTradeIn (store = null, trans = null, info = {}) {
  const transaction = await sequelize.transaction()
  try {

    // cancel header data
    await tbSalesProductTradeIn.update({
      status: '00',
      updated_by: info.users,
      updated_at: info.times,
    }, { where: { store_id: store, trans_id: trans } })

    await transaction.commit()
    return { success: true }
  } catch (er) {
    await transaction.rollback()
    throw new Error(er.message)
  }
}


























