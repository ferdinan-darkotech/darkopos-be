import moment from 'moment'
import db from '../models'
import dbv from '../models/view'
import sequelizes from 'sequelize'
import { getPurchaseDetailByCode, createPurchaseDetail, createPurchaseVoidDetail, updatePurchaseDetail } from './purchaseDetailService'
import { getStockMinusAlert } from './Report/fifoReportService'
import { simpleInsertTransferOutHpokok, getExistsTransferOutHpokok } from './mutasiService'
import { srvInsertApprovalPurchase } from '../services/v2/monitoring/srvApproval'
import { getSequenceFormatByCode } from './sequenceService'
import { getDataByStoreAndCode, increaseSequence } from './sequencesService'
import { dropOutDetailByProduct } from './transfer/transferHppService'
import { ApiError } from './v1/errorHandlingService'
import sequelize from '../native/sequelize'
import { checkJSONNested } from '../utils/operate/objOpr'


const Purchase = db.tbl_purchase
const PurchaseView = dbv.vw_purchase
const PurchaseViewDetail = dbv.vw_purchase_013
const Op = sequelizes.Op

const purchase = ['id', 'storeId', 'transNo', 'transDate', 'receiveDate', 'supplierId', 'supplierCode',
    'supplierName', 'taxType', 'reference', 'memo',
    'transType', 'discInvoiceNominal', 'discInvoicePercent', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt',
    'printNo', 'tempo', 'dueDate', 'invoiceType', 'taxId', 'rounding', 'taxPercent', 'invoiceDate'
]

const purchaseFields = ['id', 'storeId', 'transNo', 'transDate', 'receiveDate', 'supplierCode',
    'supplierName', 'taxType', 'reference', 'memo', 'status',
    'transType', 'discInvoicePercent', 'discInvoiceNominal', 'rounding', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt',
    'total', 'totalDiscount', 'totalRounding', 'totalDpp', 'totalPpn', 'nettoTotal',
    'printNo', 'tempo', 'dueDate', 'invoiceType', 'taxId', 'taxPercent'
]
const purchaseFieldsLog = ['transNo', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']

function getPurchaseInfo (query) {
    return Purchase.findOne({
        where: query,
        raw: false
    })
}

//getPurchaseByCode,
export function getPurchaseByCode (transNo, query, useTable = false) {
  let where =  { transNo }
  let attributes = purchase
  if (checkJSONNested(query,'showOnly')) {
    if (query.showOnly==='log') attributes = purchaseFieldsLog
  }
  if (checkJSONNested(query,'storeId')) {
    where.storeId = query.storeId
  }
  if(query.intransit) {
    // where.receivestatus = false
    where.receiveDate = { $eq: null }
  }
  return PurchaseView.findOne({
    // attributes: (query.showOnly==='log') ? purchaseFieldsLog : purchaseFields,
        attributes,
        where,
        raw: false
    })
}

export function getPurchaseByReference (reference, transno = null) {
    const extraFilter = transno ? { transno: { $ne: transno } } : {}
    return Purchase.findOne({
        // attributes: purchase,
        where: { reference, ...extraFilter },
        raw: false
    })
}

export function purchaseExists (transNo) {
    return getPurchaseByCode(transNo).then(data => {
        if (data === null) {
            return false;
        }
        else {
            return true;
        }
    })
}

export function getPurchaseData (query) {
	let { storeId, startPeriod, endPeriod, activeOnly = false, ...other } = query
	const dateQuery = ['createdAt', 'updatedAt', 'dueDate', 'invoiceDate', 'transDate', 'receiveDate']
    let querying = []
    if(endPeriod && startPeriod) {
        other = {
            ...other,
            ...((!!startPeriod && !!endPeriod) ? { transDate: [startPeriod, endPeriod] } : {})
        } 
    }
	for(let key in other) {
		if(dateQuery.indexOf(key) !== -1) {
			querying.push({ [key]: { [Op.between]: other[key] } })
		} else if (key === 'supplierId' || key === 'storeId') {
			querying.push({ supplierId: other[key] })
		} else {
			querying.push({ [key]: { [Op.iRegexp]: other[key] } })
		}
	}
  return PurchaseView.findAndCountAll({
        attributes: purchase,
        order: [['transDate', 'ASC'], ['transNo', 'ASC']],
		where: {
            $and: [...querying, { storeId }, { status: '1' }],
            
		}
	})
}

export function getLastTrans (query) {
    return Purchase.findAll({
        attributes: ['transNo']
    })
}

//when insert new purchase
export function setPurchaseInfo (request) {
    const getPurchaseDetail = {
        transNo: request.transNo,
        transDate: request.transDate,
        receiveDate: request.receiveDate,
        supplierCode: request.supplierCode,
        supplierName: request.supplierName,
        taxType: request.taxType,
        reference: request.reference,
        memo: request.memo,
        transType: request.transType,
        printNo: request.printNo,
        tempo: request.tempo,
        dueDate: request.dueDate,
        invoiceType: request.invoiceType,
        taxId: request.taxId,
        createdBy: request.createdBy,
    }
    return getPurchaseDetail
}

function insertPurchaseHeader (transNo, purchase, createdBy, transaction) {
    return Purchase.create({
        transNo: transNo,
        storeId: purchase.storeId,
        transDate: moment(),
        receiveDate: null,
        supplierCode: purchase.supplierCode,
        taxType: purchase.taxType,
        taxPercent: purchase.taxPercent,
        reference: purchase.reference,
        memo: purchase.memo,
        transType: purchase.transType,
        rounding: 0,
        printNo: purchase.printNo,
        tempo: moment(purchase.dueDate || moment()).diff(purchase.invoiceDate || moment(), 'day'),
        invoiceDate: purchase.invoiceDate ? purchase.invoiceDate : null,
        dueDate: purchase.dueDate ? purchase.dueDate : null,
        invoiceType: purchase.invoiceType,
        taxId: purchase.taxId,
        discInvoiceNominal: purchase.discInvoiceNominal || 0,
        discInvoicePercent: purchase.discInvoicePercent || 0,
        createdBy: createdBy,
        // updatedBy: '-----',
        totalprice: purchase.invoiceTotal,
        totaldisc: purchase.discTotal,
        totaldpp: purchase.totalDPP,
        totalppn: purchase.totalPPN,
        totalnetto: purchase.nettoTotal
    }, { transaction })
}

function updatePurchaseHeader (transNo, purchase, updatedBy, transaction) {
    return Purchase.update({
        reference: purchase.reference,
        supplierCode: purchase.supplierCode,
        taxType: purchase.taxType,
        taxPercent: purchase.taxPercent,
        discInvoicePercent: purchase.discInvoicePercent,
        discInvoiceNominal: purchase.discInvoiceNominal,
        rounding: 0,
        // tempo: moment(purchase.dueDate || moment()).diff(purchase.invoiceDate || moment(), 'day'),
        // invoiceDate: purchase.invoiceDate ? purchase.invoiceDate : null,
        // dueDate: purchase.dueDate ? purchase.dueDate : null,
        updatedBy: updatedBy,
        updatedAt: moment(),
        totalprice: purchase.invoiceTotal,
        totaldisc: purchase.discTotal,
        totaldpp: purchase.totalDPP,
        totalppn: purchase.totalPPN,
        totalnetto: purchase.nettoTotal
    },
        {
            where: {
                transNo: transNo,
                storeId: purchase.storeId
            },
            transaction
        }
    )
}

export function deletePurchase (purchaseData) {
    return Purchase.destroy({
        where: {
            transNo: purchaseData
        }
    }).catch(err => (next(new ApiError(501, err, err))))
}

export async function createPurchase (purchaseBody, createdBy, next) {
    const transaction = await sequelize.transaction()
    try {
        const current_time = moment()
        let sequence = null
        let returnObj = {}
        // Check & Create Approval
        const dataApproval = await srvInsertApprovalPurchase({ ...purchaseBody.data, tg_op: 'INSERT' }, purchaseBody, createdBy, current_time, transaction)
        if(!dataApproval.success) throw dataApproval.message
        if(dataApproval.success && !dataApproval.active) {
            // Prepare Data
            sequence = await getSequenceFormatByCode({ seqCode: 'PC', type: purchaseBody.data.storeId }, next)
            if(!sequence) throw 'Cannot Find Sequence'
            const lastSequence = await getDataByStoreAndCode('PC', purchaseBody.data.storeId)
            await insertPurchaseHeader(
                sequence,
                purchaseBody.data,
                createdBy,
                transaction)

            await createPurchaseDetail(
                sequence,
                purchaseBody.add,
                createdBy,
                transaction)
            // const recalculate = await recalculateTransferOut(purchaseBody.add, purchaseBody, { receiveDate: purchaseBody.data.transDate }, createdBy, transaction,next)
            await increaseSequence('PC', purchaseBody.data.storeId, lastSequence.seqValue, transaction)
            returnObj = { sequence, success: true }
        } else {
            returnObj = { sequence, success: true, message: 'Transaction need to be approved ...', approval: true, appvno: dataApproval.appvno }
        }
        await transaction.commit()
        return returnObj
    } catch (error) {
        await transaction.rollback()
        return { success: false, message: error.message }
    }
}

/**
 *
 * @param {array} data
 * @param {string} by
 * @returns {array}
 */
const truncateDuplicate = (data, by) => {
    const mapData = data.map(x => x[by])
    return mapData.filter(
        (item, pos) => mapData.indexOf(item) === pos
    )
}

async function recalculateTransferOut (data, purchaseBody, purchaseInfo, updatedBy, transaction, next) {
    // let transaction
    try {
        // transaction = await sequelize.transaction()
        const productId = data.map(x => x.productId.toString()).toString()
        if (productId.length > 0) {
            if (purchaseInfo) {
                const resultDetail = await getExistsTransferOutHpokok(
                    moment(purchaseInfo.receiveDate, 'YYYY-MM-DD').format('MM'),
                    moment(purchaseInfo.receiveDate, 'YYYY-MM-DD').format('YYYY'),
                    purchaseBody.data.storeId,
                    productId
                )
                const filterTransNo = truncateDuplicate(resultDetail[0], 'transNo')
                const filterProductId = truncateDuplicate(resultDetail[0], 'productId')

                if ((resultDetail[0] || []).length > 0) {
                    await dropOutDetailByProduct({
                        storeId: purchaseBody.data.storeId,
                        transNo: filterTransNo,
                        productId: filterProductId
                    }, transaction)
                    await simpleInsertTransferOutHpokok(resultDetail[0], updatedBy, transaction)
                }
            }
        }
        return { success: true }
    } catch (error) {
        // next(new ApiError(422, `ZSPR-0004: Couldn't edit purchase. ` + error, error))
        return { success: false, data: error }
    }
}

export async function updatePurchase (transNo, purchaseBody, updatedBy, next, res) {
    let transaction = await sequelize.transaction()
    let purchaseInfo
    try {
        const current_time = moment()
        let sequence = null
        let returnObj = {}
        // Check & Create Approval
        const dataApproval = await srvInsertApprovalPurchase({ ...purchaseBody.data, transNo, tg_op: 'UPDATE' }, purchaseBody, updatedBy, current_time, transaction)
        if(!dataApproval.success) throw dataApproval.message
        if(dataApproval.success && !dataApproval.active) {
            // Prepare Data
            // const getData = await getPurchaseByCode(transNo)
            // const data = getData.dataValues
            
            await updatePurchaseHeader(
                transNo,
                purchaseBody.data,
                updatedBy,
                transaction)
            // await createPurchaseVoidDetail(
            //     transNo,
            //     purchaseBody.void,
            //     updatedBy,
            //     next,
            //     transaction)
            await updatePurchaseDetail(
                transNo,
                purchaseBody.edit,
                updatedBy,
                next,
                transaction)
            await createPurchaseDetail(
                transNo,
                purchaseBody.add,
                updatedBy,
                transaction)

            // purchaseInfo = await getPurchaseInfo({
            //     transNo,
            //     storeId: purchaseBody.data.storeId
            // })
            returnObj = { sequence, success: true }
        } else {
            returnObj = { sequence, success: true, message: 'Transaction need to be approved ...', approval: true, appvno: dataApproval.appvno }
        }

        // if (purchaseInfo) {
        //     const tmpPurchaseInfo = JSON.parse(JSON.stringify(purchaseInfo))
        //     await recalculateTransferOut(purchaseBody.edit, purchaseBody, tmpPurchaseInfo, updatedBy, transaction, next)
        //     await recalculateTransferOut(purchaseBody.add, purchaseBody, tmpPurchaseInfo, updatedBy, transaction, next)
        // }
        await transaction.commit()
        return returnObj
    } catch (error) {
        await transaction.rollback()
        next(new ApiError(422, `ZSPR-0005: Couldn't edit purchase. ` + error, error))
    }
}