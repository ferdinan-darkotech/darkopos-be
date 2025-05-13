import moment from 'moment'
import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
	cancelAdjust, getAdjustByCode, adjustExists, getAdjustData, getAdjustByCustomeCondition, createAdjust, createAdjustDetail,
	updateAdjust, deleteAdjust, setAdjustDetailInfo, getAdjustDetail, getAdjustDetailByTransNoAndStoreId,
}
		from '../services/adjustService'
		
import { srvFindDataByPayloadType } from '../services/v2/monitoring/srvApproval'
import { extractTokenProfile } from '../services/v1/securityService'
import { srvGetSomeStockOnHand } from '../services/v2/inventory/srvStocks'
import { checkStockMinus } from '../services/Report/fifoReportService'
import requestApi from '../utils/request'
import { srvGetAccessGrantedByCode, srvGetAccessGrantedByKeyCode } from '../services/v2/setting/srvAccessGranted'
import { Op } from 'sequelize'


async function adjustSenderEmail ({ action, type, trans, username, usercompany, storeId, transtypename, storeName, referencedate, reference }) {
	const accessGranted = await srvGetAccessGrantedByKeyCode('ADJMAIL', storeId.toString())
	const sender = await srvGetAccessGrantedByKeyCode('MAILSENDER', 'DEFAULT')
	if(((accessGranted || {}).accessvar03 || []).length > 0 && ((sender || {}).accessvar03 || {}).email) {
		const _SND = sender.accessvar03
		const _URL = sender.accessvar02
		const _AG = accessGranted.accessvar03
		for(let x in _AG) {
			const payloadRequest = {
				url: _URL,
				method: 'POST',
				data: {
					email: _SND.email,
					password: _SND.psw,
					remail: _AG[x],
					subject: (_SND.adjust || {}).subj
						.replace(':COMPANY', usercompany)
						.replace(':TYPE', type)
						.replace(':TRANS', trans),
					msg: (_SND.adjust || {}).msg
						.replace(':ACTION', action)
						.replace(':TRANS', `${trans}\n`)
						.replace(':USER', `${username}\n`)
						.replace(':TRANSTYPE', `${transtypename}\n`)
						.replace(':STORE', `${storeName}\n`)
						.replace(':REFDATE', `${referencedate}\n`)
						.replace(':REF', `${reference}\n`)
				}
			}
			await requestApi({ ...payloadRequest })
		}
		return { success: true, message: 'Email has been send' }
	} else {
		return { success: false, message: 'Couldn\'t send email' }
	}
}
// Retrive list a adjust
exports.getAdjust = function (req, res, next) {
    console.log('Requesting-getAdjust: ' + JSON.stringify(req.params) + ' ...')
    var transNo = req.params.id
    getAdjustByCode(transNo).then((Adjust) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            purchase: Adjust
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Adjust ${transNo}.`, err)))
}

// Retrive list of adjust
exports.getAllAdjust = function (req, res, next) {
    console.log('Requesting-getAllAdjust01: ' + req.url + ' ...')
    let { pageSize, page, ...other } = req.query
    getAdjustData(other).then((adjust) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(adjust)),
            total: adjust.length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Adjust.`, err)))
}

exports.getAllAdjustDetail = function (req, res, next) {
    console.log('Requesting-getAllAdjust02: ' + req.url + ' ...')
    let { pageSize, page, ...other } = req.query
    getAdjustDetail(other).then((adjust) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(adjust)),
            total: adjust.length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Adjust.`, err)))
}


// Create a new adjust
exports.insertAdjust = function (req, res, next) {
    console.log('Requesting-insertAdjust: ' + req.url + ' ...')
    let adjust = req.body.data
    let storeId = req.body.storeId
    let adjustDetail = req.body.detail
    let mappingProduct = {}
		const userLogIn = extractTokenProfile(req)
		const qtyType = adjust.transType === 'AJIN' ? 'adjInQty' : 'adjOutQty'
		const totalPrice = adjustDetail.reduce((x, y) => x + (y.sellingPrice * (y[qtyType] || 1)), 0)
		const codeProduct = adjustDetail.map(i => i.product)
		const condition = { reference: adjust.reference, transtype: adjust.transType }
		return srvFindDataByPayloadType ('ADJUSTMENT', 'reference', adjust.reference, ['P']).then(approvalExists => {
			if(approvalExists) {
				throw new Error(`The transaction is pending approval, please contact the related person`)
			} else {
				return getAdjustByCustomeCondition(condition).then(exists => {
					if(exists) throw new Error('Data Adjust has been exists')
					else {
						return srvGetSomeStockOnHand(codeProduct, storeId).then(prod => {
							if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
							const tmpAdjustDetail = adjustDetail.map((i, x) => {
								const tmpProduct = prod.filter(n => i.product === n.productcode)[0]
								const { productid, productcode, productname } = tmpProduct
								const { product, ...other } = i
								mappingProduct[productid] = adjust.transType === 'AJIN' ? other.adjInQty : other.adjOutQty
								return { ...other, productCode: productcode, productId: productid, productName: productname }
							})
							adjustDetail = tmpAdjustDetail
							const checkType = adjust.transType === 'AJIN' ? 'ADJUST_IN' : 'ADJUST_OUT'
							const packChecking = {
									transno: '',
									storeid: storeId,
									product: mappingProduct,
							}
							return checkStockMinus(packChecking,checkType, next).then(check => {
								if(check.STATUS === 'Y') {
									return createAdjust(adjust, totalPrice, adjustDetail, userLogIn.userid).then(async (created) => {
										if (created.success) {
											const { sequence: sequenceCreated } = created
											if(!created.approval) {
												const resultAdjust = await getAdjustByCode(sequenceCreated, storeId)
												const dataAdjust = JSON.parse(JSON.stringify(resultAdjust))
												await adjustSenderEmail({ type: 'ditambahkan', type: 'ADD', trans: sequenceCreated, ...userLogIn, ...dataAdjust })
											}
											let jsonObj = {
												success: true,
												data: { transno: sequenceCreated },
												message: `Adjust of ${sequenceCreated} created`,
												approval: created.approval,
												appvno: created.appvno
											}
											res.xstatus(200).json(jsonObj)
										} else {
											throw new Error(created.message)
										}
									}).catch(err => next(new ApiError(501, `Couldn't create adjust.`, err)))
								} else {
									throw new Error(check.RESULT)
								}
							}).catch(err => next(new ApiError(501, `Couldn't create adjust.`, err)))
						}).catch(err => next(new ApiError(501, `Couldn't create adjust.`, err)))
					}
				}) .catch(err => next(new ApiError(501, `Couldn't create adjust.`, err)))
			}
		}).catch(err => next(new ApiError(501, `Couldn't create adjust.`, err)))
}

//Update Adjust
exports.updateAdjust = function (req, res, next) {
    console.log('Requesting-updateAdjust: ' + req.url + ' ...')
    var transNo = req.body.data.transNo
    var data = req.body.data
    let adjustDetail = req.body.detail
		let storeId = req.body.data.storeId
		let mappingProduct = {}
		const userLogIn = extractTokenProfile(req)
		const codeProduct = adjustDetail.map(i => i.product)
		return srvFindDataByPayloadType ('ADJUSTMENT', 'reference', data.reference, ['P']).then(approvalExists => {
			if(approvalExists) {
				throw new Error(`The transaction is pending approval, please contact the related person`)
			} else {
				return getAdjustByCustomeCondition({ transNo, storeId }).then(exists => {
					const restrict = moment(moment(exists.transdate).format('YYYY-MM')).diff(moment().format('YYYY-MM'), 'month') === 0
					exists = !restrict && exists ? null : exists
					if (exists) {
						const condition = { reference: data.reference, transtype: data.transType, transno: { [Op.ne]: transNo } }
						return getAdjustByCustomeCondition(condition).then(async exists => {
							if(exists) throw new Error('Reference has been exists')
							else {
								return srvGetSomeStockOnHand(codeProduct, storeId).then(prod => {
									if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
									const tmpAdjustDetail = adjustDetail.map((i, x) => {
										const tmpProduct = prod.filter(n => i.product === n.productcode)[0]
										const { productid, productcode, productname } = tmpProduct
										const { product, ...other } = i
										mappingProduct[productid] = data.transType === 'AJIN' ? other.adjInQty : other.adjOutQty
										return { ...other, productCode: productcode, productId: productid, productName: productname }
									})
									adjustDetail = tmpAdjustDetail
									const checkType = data.transType === 'AJIN' ? 'ADJUST_IN' : 'ADJUST_OUT'
									const packChecking = {
										transno: transNo,
										storeid: storeId,
										product: mappingProduct,
									}
									return checkStockMinus(packChecking,checkType, next).then(check => {
										if(check.STATUS === 'Y') {
											return updateAdjust(data, adjustDetail, userLogIn.userid, next, res).then(async (adjustUpdated) => {
												if (adjustUpdated.success) {
													if(!adjustUpdated.approval) {
														const resultAdjust = await getAdjustByCode(transNo, storeId)
														const dataAdjust = JSON.parse(JSON.stringify(resultAdjust))
														await adjustSenderEmail({ type: 'direvisi', type: 'REVISION', trans: transNo, ...userLogIn, ...dataAdjust })
													}
													let jsonObj = {
														success: true,
														data: { transno: transNo },
														message: `Adjust of ${transNo} updated`,
														approval: adjustUpdated.approval,
														appvno: adjustUpdated.appvno
													}
													res.xstatus(200).json(jsonObj)
												} else {
													throw new Error(adjustUpdated.message)
												}
											}).catch(err => next(new ApiError(501, `Couldn't update adjust.`, err)))
										} else {
											throw new Error(check.RESULT)
										}
									}).catch(err => next(new ApiError(501, `Couldn't update adjust ${transNo}.`, err)))
								}).catch(err => next(new ApiError(501, `Couldn't update adjust ${transNo}.`, err)))	
							}
						}).catch(err => next(new ApiError(422, `Couldn't update Adjust item ${transNo} .`, err)))
					} else {
						throw new Error(!restrict ? 'Out of month' : 'Data doesn\'t exists')
					}
			}).catch(err => next(new ApiError(422, `Couldn't find Adjust item ${transNo} .`, err)))
			}
		}).catch(err => next(new ApiError(501, `Couldn't create adjust.`, err)))
}

// Cancel Adjust
exports.cancelAdjust = function (req, res, next) {
    console.log('Requesting-cancelAdjust: ' + req.url + ' ...')
    let id = req.params.id
    let status = req.params.status
    const userLogIn = extractTokenProfile(req)
    return cancelAdjust(id, status, userLogIn.userid).then((adjustUpdated) => {
        let jsonObj = {
            success: true,
            message: 'Adjust has been canceled',
        }
        res.xstatus(200).json(jsonObj)
    }).catch(err => next(new ApiError(422, `Couldn't find Adjust.`, err)))
}

//Delete a Adjust
exports.deleteAdjust = function (req, res, next) {
    console.log('Requesting-deletePurchase: ' + req.url + ' ...')
    let transNo = req.params.id
    let storeId = req.body.storeId
    adjustExists(transNo, storeId).then(exists => {
        if (exists) {
            deleteAdjust(transNo).then((adjustDeleted) => {
                if (adjustDeleted === 1) {
                    let jsonObj = {
                        success: true,
                        message: `Adjust ${transNo} deleted`,
                    }
                    if (project.message_detail === 'ON') {
                        Object.assign(jsonObj, { purchase: adjustDeleted })
                    }
                    res.xstatus(200).json(jsonObj)
                } else {
                    next(new ApiError(422, `Adjust ${transNo} fail to delete.`))
                }
            }).catch(err => next(new ApiError(500, `Couldn't delete Adjust ${transNo}.`, err)))
        } else {
            next(new ApiError(422, `Adjust ${transNo} not exists.`))
        }
    }).catch(err => next(new ApiError(422, `Adjust ${transNo} not exists.`, err)))
}