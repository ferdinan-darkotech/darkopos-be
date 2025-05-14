import { Op } from 'sequelize'
import db from '../models'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'
import moment from 'moment'

const PurchaseDetail = db.tbl_purchase_detail
const PurchaseDetailVoid = db.tbl_purchase_detail_cancel
const PurchaseDetailView = dbv.vw_purchase_detail

// [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
const PurchaseServiceView = dbv.vw_purchase_service

const purchaseDetail = ['id', 'supplierId', 'transNo', 'productId', 'productCode',
  'productName', 'qty', 'purchasePrice', 'total', 'discp1', 'discp2', 'discp3', 'discp4', 'discp5',
  'discNominal', 'discInvoice', 'discItem', ['DPP', 'dpp'], ['PPN', 'ppn'], 'totalDiscount', 'roundingItem', 'netto', 'grandtotal',
  'taxPercent', 'invoiceDate', 'dueDate', 'rounding_dpp', 'rounding_ppn', 'rounding_netto'
]
const purchaseDetailLog= ['transNo', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']

// [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
export function getPurchaseDetailService(storeid, productid, pagination, query) {
    const { pageSize, page } = pagination
    let querying = []
    if (query['q']) {
      for (let key in attrMainWo) {
        const id = Object.assign(attrMainWo)[key]
        if (id === 'transNo' || id === 'productId' || id === 'productName') {
          let obj = {}
          obj[id] = { [Op.iRegexp]: query['q'] }
          querying.push(obj)
        }
      }
    }

    const attributes = [...purchaseDetail.filter(x => x !== 'productCode'), 'purchaseType', 'transDate']
    const filtering = {
        storeId: storeid,
        productId: productid,
        purchaseType: '02',
        qty: { [Op.gt]: 0 }
    }

    if (querying.length > 0) {
        return PurchaseServiceView.findAndCountAll({
            attributes,
            where: {
                [Op.or]: querying,
                [Op.and]: filtering
            },
            order: [['transDate']],
            limit: parseInt(pageSize || 10, 10),
            offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
        })
    } else {
        return PurchaseServiceView.findAndCountAll({
            attributes,
            where: { [Op.and]: filtering },
            order: [['transDate']],
            limit: parseInt(pageSize || 10, 10),
            offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
        })
    }
}


//getPurchaseDetailByCode,
export function getPurchaseDetailByCode (number, storeId, showOnly) {
  return PurchaseDetailView.findAll({
    attributes: (showOnly === 'log') ? purchaseDetailLog : purchaseDetail,
    where: {
      [Op.and]: {
        transNo: number,
        storeId: storeId,
        void: '0'
      }
    },
    raw: false
  })
}

export function getPurchaseDetailData (q) {
    let {  endPeriod, startPeriod, activeOnly = false, ...query } = q
    if(endPeriod && startPeriod) {
        query = {
            ...query,
            transDate: [startPeriod, endPeriod]
        } 
    }
    for (let key in query) {
        if (key === 'transDate') {
            query[key] = { [Op.between]: query[key] }
        } else if (key === 'storeId') query[key] = +query[key]
    }

    if (query) {
        if (query.hasOwnProperty('id')) {
            let str = JSON.stringify(query)
            str = str.replace(/id/g, 'transNo')
            query = JSON.parse(str)
        }
        
        return PurchaseDetailView.findAll({
            attributes: purchaseDetail,
            where: {
                void: '0',
                status: '1',
                ...query
            },
            order: [['transdate', 'asc'], ['transno','asc']]
        })
    } else {
        return PurchaseDetailView.findAll({
            attributes: purchaseDetail,
            order: [['transdate', 'asc'], ['transno','asc']]
        })
    }
}
//when insert new purchase
export function setPurchaseDetailInfo (request) {
    const getPurchaseDetail = {
        storeId: request.storeId,
        transNo: request.transNo,
        productId: request.productId,
        productName: request.productName,
        qty: request.qty,
        purchasePrice: request.purchasePrice,
        sellingPrice: request.sellingPrice,
        discPercent: request.discPercent,
        discNominal: request.discNominal,
        DPP: request.DPP,
        PPN: request.PPN,
        createdBy: request.createdBy,
        createdAt: request.createdAt
    }
    return getPurchaseDetail
}

// when insert Return
export function setReturnDetailInfo (request) {
    const getPurchaseDetail = {
        storeId: request.storeId,
        transNo: request.transNo,
        productId: request.productId,
        productName: request.productName,
        qty: request.qty,
        purchasePrice: request.purchasePrice,
        sellingPrice: request.sellingPrice,
        discPercent: request.discPercent,
        discNominal: request.discNominal,
        DPP: request.DPP,
        PPN: request.PPN,
        createdBy: request.createdBy
    }
    return getPurchaseDetail
}

export function createPurchaseDetail (transNo, purchaseDetail, createdBy, transaction) {
    let arrayProd = []
    for (let n = 0; n < purchaseDetail.length; n++) {
        arrayProd.push({
            storeId: purchaseDetail[n].storeId,
            transNo: transNo,
            productId: purchaseDetail[n].productId,
            qty: purchaseDetail[n].qty,
            purchasePrice: +(purchaseDetail[n].purchasePrice || 0),
            sellingPrice: +(purchaseDetail[n].sellingPrice || 0),
            discp1: +(purchaseDetail[n].discp1 || 0),
            discp2: +(purchaseDetail[n].discp2 || 0),
            discp3: +(purchaseDetail[n].discp3 || 0),
            discp4: +(purchaseDetail[n].discp4 || 0),
            discp5: +(purchaseDetail[n].discp5 || 0),
            discNominal: +(purchaseDetail[n].discNominal || 0),
            DPP: +(purchaseDetail[n].DPP || 0) + purchaseDetail[n].rounding_dpp,
            PPN: +(purchaseDetail[n].PPN || 0) + purchaseDetail[n].rounding_ppn,
            void: +(purchaseDetail[n].void || false),
            recapDate: moment(), // temp while <afx>
            createdAt: moment(),
            rounding_netto: purchaseDetail[n].rounding_netto,
            rounding_ppn: purchaseDetail[n].rounding_ppn,
            rounding_dpp: purchaseDetail[n].rounding_dpp,
            createdBy: createdBy,
            updatestock: true,
            updatedBy: '-----'
        })
    }
    
    return PurchaseDetail.bulkCreate(
        arrayProd,
        { transaction }
    )
}

export function createPurchaseVoidDetail (transNo, purchaseDetail, createdBy, next, transaction) {
    let arrayProd = []
    for (let n = 0; n < purchaseDetail.length; n++) {
        arrayProd.push({
            storeId: purchaseDetail[n].storeId,
            transNo: transNo,
            productId: purchaseDetail[n].productId,
            qty: purchaseDetail[n].qty,
            purchasePrice: purchaseDetail[n].purchasePrice,
            sellingPrice: purchaseDetail[n].sellingPrice,
            discp1: +(purchaseDetail[n].discp1 || 0),
            discp2: +(purchaseDetail[n].discp2 || 0),
            discp3: +(purchaseDetail[n].discp3 || 0),
            discp4: +(purchaseDetail[n].discp4 || 0),
            discp5: +(purchaseDetail[n].discp5 || 0),
            discNominal: purchaseDetail[n].discNominal,
            DPP: purchaseDetail[n].DPP,
            PPN: purchaseDetail[n].PPN,
            createdBy: createdBy,
            updatedBy: '-----'
        })
    }
    return PurchaseDetailVoid.bulkCreate(
        arrayProd,
        {
            transaction
        }
    ).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const { parent, original, sql, ...other } = errObj
        next(new ApiError(400, other, err))
    })
}

export function updatePurchaseDetail (transNo, purchaseDetail, updatedBy, next, transaction) {
    let arrayProd = []
    for (let n = 0; n < purchaseDetail.length; n++) {
        arrayProd.push({
            storeId: purchaseDetail[n].storeId,
            transNo: transNo,
            // productId: purchaseDetail[n].productId,
            // productName: purchaseDetail[n].productName,
            qty: purchaseDetail[n].qty,
            purchasePrice: purchaseDetail[n].purchasePrice,
            discp1: +(purchaseDetail[n].discp1 || 0),
            discp2: +(purchaseDetail[n].discp2 || 0),
            discp3: +(purchaseDetail[n].discp3 || 0),
            discp4: +(purchaseDetail[n].discp4 || 0),
            discp5: +(purchaseDetail[n].discp5 || 0),
            discNominal: purchaseDetail[n].discNominal,
            DPP: +(purchaseDetail[n].DPP || 0) + purchaseDetail[n].rounding_dpp,
            PPN: +(purchaseDetail[n].PPN || 0) + purchaseDetail[n].rounding_ppn,
            void: purchaseDetail[n].void,
            rounding_netto: purchaseDetail[n].rounding_netto,
            rounding_ppn: purchaseDetail[n].rounding_ppn,
            rounding_dpp: purchaseDetail[n].rounding_dpp,
            updatestock: false,
            updatedBy: updatedBy,
            updatedAt: moment()
        })
    }
    for (let n = 0; n < arrayProd.length; n++) {
        PurchaseDetail.update(
            arrayProd[n],
            {
                where: {
                    id: purchaseDetail[n].id
                },
                transaction
            }
        ).catch(err => {
            const errObj = JSON.parse(JSON.stringify(err))
            const { parent, original, sql, ...other } = errObj
            next(new ApiError(400, other, err))
        })
    }
    return PurchaseDetail.findAll({
        where: {
            transNo: purchaseDetail[0].transNo,
        }
    })
}
