import { posTotal } from '../../utils/pos'
import { calculateTax as calculate_tax } from '../../utils/operate/objOpr'
import moment from 'moment'


export async function getTotalPos (posDetail) {
  let totalPos = posDetail
    .map(x => ({ totalPos: posTotal(x) }))
    .reduce((prev, next) => prev + next.totalPos, 0)
  return totalPos
}

export function reArrangedBundling (posBundling, result, createdBy) {
  return (posBundling || [])
    .map(dataBundling => ({
      sort: dataBundling.no,
      posId: result.dataValues.id,
      bundlingId: dataBundling.bundleId,
      qty: dataBundling.qty,
      createdBy: createdBy,
      updatedBy: '---'
    }))
}

export function reArrangedPosDetail (sequence, pos, posDetail, createdBy, detailQueue, salesTax = {}) {
  // console.log('>>', pos)
  const tradeIn = Array.isArray(pos.tradeIn) ? pos.tradeIn : [] 
  return (posDetail || [])
    .map(dataPosDetail => {
      const _DQ = detailQueue.filter(x => 
        (
          x.product === dataPosDetail.productCode &&
          x.typecode === dataPosDetail.typeCode &&
          x.total === dataPosDetail.DPP 
        ))[0] || {}
      
      // sum trade in values
      const {
        tradeIn_qty,
        tradeIn_price,
        tradeIn_ttl_price
      } = tradeIn.reduce((val, { ref_id, ...y }) => ({
        tradeIn_qty: val.tradeIn_qty + (dataPosDetail.trade_in === ref_id ? 1 : 0), // (dataPosDetail.trade_in === ref_id ? (y.qty || 0) : 0),
        tradeIn_price: val.tradeIn_price + (dataPosDetail.trade_in === ref_id ? (y.price || 0) : 0),
        tradeIn_ttl_price: val.tradeIn_ttl_price + (dataPosDetail.trade_in === ref_id ? (y.price || 0) : 0)
      }), { tradeIn_qty: 0, tradeIn_price: 0, tradeIn_ttl_price: 0 })
      
      if(tradeIn_qty > dataPosDetail.qty) {
        throw 'Qty trade-in can\'t be greater than products.'
      }
      
      let newDpp = dataPosDetail.DPP
      let newPpn = dataPosDetail.PPN
      const newPrice = calculate_tax({
        product: dataPosDetail.productCode,
        price: dataPosDetail.sellingPrice + (dataPosDetail.additionalpricenominal || 0), // [NEW]: FERDINAN - 2025-03-26
        qty: dataPosDetail.qty,
        disc1: dataPosDetail.disc1,
        disc2: dataPosDetail.disc2,
        disc3: dataPosDetail.disc3,
        disc4: dataPosDetail.disc4,
        disc5: dataPosDetail.disc5,
        discnominal: (dataPosDetail.discount + tradeIn_ttl_price)
      }, (salesTax.type || 'E'), (salesTax.percent || 0))
      
      // if(dataPosDetail.typeCode === 'P') {
      newDpp = newPrice.dpp
      newPpn = newPrice.ppn
      // }
      return {
        storeId: pos.storeId,
        trade_in_id: (dataPosDetail.trade_in || null),
        trade_in_qty: tradeIn_qty,
        trade_in_price: tradeIn_price,
        trade_in_ttl_price: tradeIn_ttl_price,
        bundlingId: dataPosDetail.bundleId,
        employeeId: dataPosDetail.employeeId,
        voucherid: dataPosDetail.voucherid,
        transNo: sequence,
        productId: dataPosDetail.productId,
        productCode: dataPosDetail.productCode,
        qty: dataPosDetail.qty,
        typeCode: dataPosDetail.typeCode,
        sellPrice: dataPosDetail.sellprice,
        sellingPrice: dataPosDetail.sellingPrice,
        DPP: newDpp,
        PPN: newPpn,
        discountLoyalty: dataPosDetail.discountLoyalty,
        discount: (dataPosDetail.discount + tradeIn_ttl_price),
        disc1: dataPosDetail.disc1,
        disc2: dataPosDetail.disc2,
        disc3: dataPosDetail.disc3,
        max_disc_percent: dataPosDetail.max_disc_percent,
        max_disc_nominal: dataPosDetail.max_disc_nominal,
        updatestock: dataPosDetail.typeCode === 'P' ? true : false,
        createdBy: createdBy,
        updatedBy: '---',
        createdAt: moment(),
        updatedAt: moment(),
        appdata: _DQ.appdata || false, // [please check first]
        appmemo: _DQ.appmemo,
        appstatus: _DQ.appstatus,
        appby: _DQ.appby,
        appdt: _DQ.appdt,
        queue_no: pos.queue_no,
        indentid: dataPosDetail.indentDetailId,
        keterangan: dataPosDetail.keterangan || null,

        // [NEW]: FERDINAN - 2025-03-25
        salestype: dataPosDetail.salestype || 'I',
        additionalpricenominal: dataPosDetail.additionalpricenominal || 0,
        additionalpricepercent: dataPosDetail.additionalpricepercent || 0,
        additionalpriceroundingdigit: dataPosDetail.additionalpriceroundingdigit || 0,

        // [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
        transnopurchase: dataPosDetail.transnopurchase || null,

        // [HPP VALIDATION]: FERDINAN - 2025-05-23
        hppperiod: dataPosDetail.hppperiod || '',
        hppprice: dataPosDetail.hppprice || 0
      }
  })
}
