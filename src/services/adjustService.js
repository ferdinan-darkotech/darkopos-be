import db from '../models'
import dbv from '../models/viewR'
import moment from 'moment'
import { ApiError } from '../services/v1/errorHandlingService'
import sequelize from '../native/sequelize'
import { getDataByStoreAndCode, increaseSequence } from './sequencesService'
import { srvInsertApprovalAdjustment } from '../services/v2/monitoring/srvApproval'
import { getStockMinusAlert } from './Report/fifoReportService'
import { getSequenceFormatByCode } from './sequenceService'
import { calculateTax } from '../utils/operate/objOpr'

const vwAdjust = dbv.vw_adjust
const Adjust = db.tbl_adjust
const tblAdjustDetail = db.tbl_adjust_detail
const AdjustDetail = dbv.vw_adjust_detail

const adjust = ['storeId', 'storeCode', 'storeName', 'transNo', 'transDate', 'pic', 'picId', 'reference', 'memo',
    'transType', 'createdBy', 'updatedBy', 'transtypename', 'supplierid', 'suppliercode',
    'suppliername', 'returnstatus', 'returnstatustext','referencedate'
]

const adjustDetail = ['id', 'storeId', 'transNo', 'transType', 'productId', 'productCode', 'productName', 'adjInQty',
    'adjOutQty', 'sellingPrice', 'recapDate', 'createdBy', 'updatedBy',
]

//getAdjustByCode,
export function getAdjustByCode (transNo, storeId) {
    return vwAdjust.findOne({
        attributes: adjust,
        where: {
            transNo: transNo,
            storeId: storeId
        },
        raw: false
    })
}

export function adjustExists (transNo, storeId) {
    return getAdjustByCode(transNo, storeId).then(data => {
        if (data === null) {
            return false;
        }
        else {
            return true;
        }
    })
}

export function getAdjustByCustomeCondition (condition = {}) {
    return vwAdjust.findOne({
        where: condition,
        raw: true
    })
}

export function getAdjustData (query) {
    for (let key in query) {
        if (key === 'createdAt') {
            query[key] = { between: query[key] }
        } else if (key === 'transDate') {
            query[key] = { between: query[key] }
        }
    }
    if (query) {
        // if (query.hasOwnProperty('id')) {
        //     let str = JSON.stringify(query)
        //     str = str.replace(/id/g, 'transNo')
        //     query = JSON.parse(str)
        // }
        return vwAdjust.findAll({
            attributes: adjust,
            where: query,
            order: ['transdate']
        })
    } else {
        return vwAdjust.findAll({
            attributes: adjust,
            order: ['transdate']
        })
    }
}

export function getAdjustDetail (query) {
    for (let key in query) {
        if (key === 'createdAt') {
            query[key] = { between: query[key] }
        }
    }
    if (query) {
        if (query.hasOwnProperty('id')) {
            let str = JSON.stringify(query)
            str = str.replace(/id/g, 'transNo')
            query = JSON.parse(str)
        }
        return AdjustDetail.findAll({
            attributes: adjustDetail,
            where: query
        })
    } else {
        return AdjustDetail.findAll({
            attributes: adjustDetail
        })
    }
}

//when insert new Adjust
export function setAdjustInfo (request) {
    const getAdjustDetail = {
        transNo: request.transNo,
        transDate: moment(),
        referencedate: request.referencedate,
        reference: request.reference,
        picId: request.picId,
        pic: request.pic,
        memo: request.memo,
        transType: request.transType,
        createdBy: request.createdBy,
    }
    return getAdjustDetail
}

export function setAdjustDetailInfo (request) {
    var arrayProd = []
    for (var key = 0; key < request.length; key++) {
        arrayProd.push({
            transNo: request[key].transNo,
            transType: request[key].transType,
            productId: request[key].productId,
            adjInQty: request[key].adjInQty,
            adjOutQty: request[key].adjOutQty,
            sellingPrice: request[key].sellingPrice,
            createdBy: request[key].createdBy,
        })
    }
    return arrayProd
}

export function insertAdjust (transNo, totalPrice, adjust, createdBy, current_time, transaction) {
    return Adjust.create({
        storeId: adjust.storeId,
        transNo: transNo,
        transDate: moment(),
        referencedate: adjust.referencedate,
        reference: adjust.reference,
        picId: adjust.picId,
        pic: adjust.pic,
        memo: adjust.memo,
        transType: adjust.transType,
        supplierid: adjust.transType === 'RBB' ? adjust.supplierid : null,
        totalprice: totalPrice,
        returnstatus: adjust.transType === 'RBB' ? adjust.returnstatus : null,
        totaldiscount: adjust.totaldiscount,
	    totaldpp: adjust.totaldpp,
	    totalppn: adjust.totalppn,
	    totalnetto: adjust.totalnetto,
	    totalrounding: adjust.totalrounding,
        createdBy: createdBy,
        createdAt: current_time
    },
        { transaction })
}

export function createAdjustDetail (transNo, adjust, createdBy, current_time, transaction) {
    var arrayProd = []
    for (var n = 0; n < adjust.length; n++) {
        arrayProd.push({
            storeId: adjust[n].storeId,
            transNo: transNo,
            transType: adjust[n].transType,
            productId: adjust[n].productId,
            adjInQty: adjust[n].adjInQty,
            adjOutQty: adjust[n].adjOutQty,
            sellingPrice: adjust[n].sellingPrice,
            recapDate: adjust[n].recapDate,
            refno: adjust[n].refno,
	        taxtype: adjust[n].taxtype,
	        taxval: adjust[n].taxval,
	        discp01: adjust[n].discp01,
	        discp02: adjust[n].discp02,
	        discp03: adjust[n].discp03,
	        discp04: adjust[n].discp04,
	        discp05: adjust[n].discp05,
	        discnominal: adjust[n].discnominal,
	        dpp: adjust[n].dpp,
	        ppn: adjust[n].ppn,
	        netto: adjust[n].netto,
	        rounding_netto: adjust[n].rounding_netto,
            updateStock: true,
            createdBy: createdBy,
            createdAt: current_time
        })
    }
    return tblAdjustDetail.bulkCreate(
        arrayProd,
        { transaction }
    )
}


export function cancelAdjust (id, status, updatedBy) {
    return Adjust.update({
        status: status,
        updatedBy: updatedBy
    }, {
            where: {
                id: id
            }
        })
}

export function getAdjustDetailByTransNoAndStoreId (transNo, storeId) {
    return AdjustDetail.findAll({
        where: {
            transNo,
            storeId
        },
        raw: false
    })
}

export async function updateAdjustDetail (data, adjust, updatedBy, current_time, transaction) {
    let arrayProd = []
    for (let n = 0; n < adjust.length; n++) {
			const updatedSuccess = await tblAdjustDetail.update(
					{
						adjInQty: adjust[n].adjInQty,
						adjOutQty: adjust[n].adjOutQty,
						sellingPrice: adjust[n].sellingPrice,
						transType: adjust[n].transType,
                        taxtype: adjust[n].taxtype,
                        taxval: adjust[n].taxval,
                        discp01: adjust[n].discp01,
                        discp02: adjust[n].discp02,
                        discp03: adjust[n].discp03,
                        discp04: adjust[n].discp04,
                        discp05: adjust[n].discp05,
                        discnominal: adjust[n].discnominal,
                        dpp: adjust[n].dpp,
                        ppn: adjust[n].ppn,
                        netto: adjust[n].netto,
                        rounding_netto: adjust[n].rounding_netto,
						updateStock: true,
						updatedBy: updatedBy,
						updatedAt: current_time
					},
					{ where: { productId: adjust[n].productId, transNo: data.transNo, storeId: data.storeId } },
					{ transaction }
			)
			if(updatedSuccess[0] === 0) {
				arrayProd.push({
					storeId: data.storeId,
					transNo: data.transNo,
					productId: adjust[n].productId,
					adjInQty: adjust[n].adjInQty,
					adjOutQty: adjust[n].adjOutQty,
					sellingPrice: adjust[n].sellingPrice,
					transType: data.transType,
                    recapDate: adjust[n].recapDate,
                    refno: adjust[n].refno,
                    taxtype: adjust[n].taxtype,
                    taxval: adjust[n].taxval,
                    discp01: adjust[n].discp01,
                    discp02: adjust[n].discp02,
                    discp03: adjust[n].discp03,
                    discp04: adjust[n].discp04,
                    discp05: adjust[n].discp05,
                    discnominal: adjust[n].discnominal,
                    dpp: adjust[n].dpp,
                    ppn: adjust[n].ppn,
                    netto: adjust[n].netto,
                    rounding_netto: adjust[n].rounding_netto,
					updateStock: true,
					createdBy: updatedBy,
					createdAt: current_time
				})
			}
    }
		await tblAdjustDetail.bulkCreate(arrayProd, { transaction })
}

export async function createAdjust (adjust, totalPrice, adjustDetail, createdBy, approvals = true, refTransaction = null) {
    let transaction
    try {
        transaction = refTransaction ?  refTransaction : await sequelize.transaction()
        const current_time = moment()
        let sequence = null
        let returnObj = {}
        let newDetail = []

        // Recalculate tax, which the transaction is included type of RBB (Retur Beli)
        for (let x in adjustDetail) {
            const items = adjustDetail[x]
            const { price: calculatePrice, ...otherCalculate } = calculateTax(
                {
                    price: items.sellingPrice,
                    qty: adjust.transType === 'AJIN' ? items.adjInQty : items.adjOutQty,
                    disc1: items.discp01,
                    disc2: items.discp02,
                    disc3: items.discp03,
                    disc4: items.discp04,
                    disc5: items.discp05,
                    discnominal: items.discnominal,
                }, items.taxtype, items.taxval)
            
            // const newNetto = otherCalculate.netto
            const totalDiscount = (calculatePrice - otherCalculate.netto)
            newDetail.push({ ...items, ...otherCalculate, totalDiscount })
        }
        
        const sumTotal = newDetail.reduce(
            (x, { dpp, ppn, netto, rounding = 0, totalDiscount }) => ({
                totaldpp: x.totaldpp + dpp,
                totalppn: x.totalppn + ppn,
                totalnetto: x.totalnetto + netto,
                totalrounding: x.totalrounding + rounding,
                totaldiscount: x.totaldiscount + totalDiscount
            }),
        { totaldpp: 0, totalppn: 0, totalnetto: 0, totalrounding: 0, totaldiscount: 0 })

        // Check & Create Approval
        let dataApproval = null 
        
        if(approvals) {
            dataApproval = await srvInsertApprovalAdjustment({ ...{ ...adjust, ...sumTotal }, totalPrice, tg_op: 'INSERT' }, newDetail, createdBy, current_time, transaction)
            if(!dataApproval.success) throw dataApproval.message
        } else {
            dataApproval = { success: true, active: false }
        }

        if(dataApproval.success && !dataApproval.active) {
            // Prepare Data
            const typeSeq = adjust.transType === 'AJIN' ? 'AI' : 'AO'
            sequence = await getSequenceFormatByCode({ seqCode: typeSeq, type: adjust.storeId })
            if(!sequence) throw 'Cannot Find Sequence'
            const lastSequence = await getDataByStoreAndCode(typeSeq, adjust.storeId)
            adjust.totalprice = totalPrice
            
            await insertAdjust(sequence, totalPrice, { ...adjust, ...sumTotal }, createdBy, current_time, transaction)
            await createAdjustDetail(sequence, newDetail, createdBy, current_time, transaction)
            await increaseSequence(typeSeq, adjust.storeId, lastSequence.seqValue, transaction)
            returnObj = { sequence, success: true }
        } else {
            returnObj = { sequence, success: true, message: 'Transaction need to be approved ...', approval: true, appvno: dataApproval.appvno }
        }
        refTransaction ? null : await transaction.commit()
        return returnObj
    } catch (error) {
        refTransaction ? null : await transaction.rollback()
        return { success: false, message: error.message }
    }
}

export async function updateAdjust (header, detail, updatedBy, next, res) {
    let transaction
    try {
        let returnObj
        transaction = await sequelize.transaction()
        const current_time = moment()
        const totalPrice = detail.reduce((x, y) => x + (y.sellingPrice * (header.transType === 'AJIN' ? y.adjInQty : y.adjOutQty)),0)
        // Check & Create Approval
        const dataApproval = await srvInsertApprovalAdjustment({ ...header, totalPrice, tg_op: 'UPDATE' }, detail, updatedBy, current_time, transaction)
        if(!dataApproval.success) throw dataApproval.message
        if(dataApproval.success && !dataApproval.active) {
            // Prepare Data
            await Adjust.update({
                reference: header.reference,
                referencedate: header.referencedate,
                picId: header.picId,
                pic: header.pic,
                memo: header.memo,
                supplierid: header.transType === 'RBB' ? header.supplierid : null,
                totalprice: totalPrice,
                returnstatus: header.transType === 'RBB' ? header.returnstatus : null,
                totaldiscount: header.totaldiscount,
                totaldpp: header.totaldpp,
                totalppn: header.totalppn,
                totalnetto: header.totalnetto,
                totalrounding: header.totalrounding,
                updatedBy: updatedBy,
                updatedAt: current_time
            },
            { where: { transNo: header.transNo, storeId: header.storeId } },
            { transaction })
            await updateAdjustDetail(
                header,
                detail,
                updatedBy,
                current_time,
                transaction
            )
            returnObj = { success: true }
        } else {
            returnObj = { success: true, message: 'Transaction need to be approved ...', approval: true, appvno: data.appvno }
        }
        
        await transaction.commit()
        return returnObj
    } catch (error) {
        await transaction.rollback()
        return { status: false, message: error.message }
    }
}

export function deleteAdjust (adjustData) {
    console.log('deleteAdjust', adjustData);
    return Adjust.destroy({
        where: {
            transNo: adjustData
        }
    }).catch(err => (next(new ApiError(501, err, err))))
}
