import project from '../../config/project.config'
import {
    ApiError
} from '../services/v1/errorHandlingService'
import {
    createTransferOutHp
} from '../services/transfer/transferHppService'
import {
    getTransByNoOut,
    getTransByNoOutReceiver,
    transExistsOut,
    transExistsOutCancel,
    getOutData,
    createTransferOutDetail,
    createTransferOut,
    cancelTransferOut
}
    from '../services/mutasiService'
import {
    extractTokenProfile
} from '../services/v1/securityService'
import { srvGetHeaderByTrans } from '../services/v2/monitoring/srvOSRequest'
import { srvGetSomeStockOnHand } from '../services/v2/inventory/srvStocks'
import { checkStockMinus } from '../services/Report/fifoReportService'
import { srvGetEmployeeByEmpId } from '../services/v2/master/humanresource/srvEmployee'

// Get By TransNo
exports.getTransByNoOut = function (req, res, next) {
    console.log('Requesting-getTransByNoOut: ' + JSON.stringify(req.params) + ' ...')
    var transNo = req.query.transNo
    var storeId = req.query.storeId
    getTransByNoOut(transNo, storeId).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi ${transNo}.`, err)))
}

exports.getTransByNoOutReceive = function (req, res, next) {
    console.log('Requesting-getTransByNoOutReceive: ' + JSON.stringify(req.params) + ' ...')
    var transNo = req.query.transNo
    var storeId = req.query.storeId
    getTransByNoOutReceiver(transNo, storeId).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi ${transNo}.`, err)))
}

// Retrive list of transfer
exports.getTransData = function (req, res, next) {
    console.log('Requesting-getTransferOutData: ' + req.url + ' ...')
    let {
        pageSize,
        page,
        start,
        end,
        ...other
    } = req.query
    getOutData(start, end, other).then((data) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: data,
            total: data.length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Mutasi.`, err)))
}

exports.insertTransferOut = function (req, res, next) {
    console.log('Requesting-insertTransferOut: ' + req.url + ' ...')
    let transNo = req.body.transNo
    let data = req.body.data
    let storeId = req.body.storeId
		let mutasiDetail = req.body.detail
		let mappingProduct = {}
		const codeProduct = mutasiDetail.map(i => i.product)
    const userLogIn = extractTokenProfile(req)
    return transExistsOut(transNo, storeId).then(exists => {
			if (exists) {
				next(new ApiError(409, `Transaction ${transNo} already exists.`))
			} else {
				return srvGetSomeStockOnHand(codeProduct, storeId).then(prod => {
					if(prod.length !== codeProduct.length) throw new Error('Please re-check your detail transaction.')
					const tmpTransferDetail = mutasiDetail.map((i, x) => {
						const tmpProduct = prod.filter(n => i.product === n.productcode)[0]
						const { productid, productcode, productname } = tmpProduct
						const { product, ...other } = i
						mappingProduct[productid] = other.qty
						return { 
							...other, productCode: productcode, productId: productid, productName: productname,
							transType: data.transType
						}
					})
					mutasiDetail = tmpTransferDetail
					const packChecking = {
						transno: '',
						storeid: storeId,
						product: mappingProduct,
						mutasiDetail
					}
					return checkStockMinus(packChecking,'TRANSFER_OUT', next).then(async check => {
                            const employeeData = JSON.parse(JSON.stringify(await srvGetEmployeeByEmpId(data.employeeId, {m: 'gid'})))
                            data.employeeId = employeeData.id
                            if(data.employeeId === null || data.employeeId === undefined) throw 'Employee not found.'
                            
							if(check.STATUS === 'Y') {
									let checkHeaderOS = 'Y'
									if(data.requestno) {
                                        const dataOSHeader = await srvGetHeaderByTrans(data.requestno) || {}
                                        checkHeaderOS = dataOSHeader.transno ? 'Y' : 'N'
									}
									if(checkHeaderOS === 'Y') {
										return createTransferOut(data, storeId, mutasiDetail, userLogIn.userid, next, res).then((headerCreated) => {
											if (headerCreated) {
                                                if(!headerCreated.approval) {
                                                    return getTransByNoOut(headerCreated.sequence, storeId).then((mutasi) => {
                                                        let jsonObj = {
                                                            success: true,
                                                            message: `Mutasi of ${transNo} created`,
                                                            data: JSON.parse(JSON.stringify(mutasi)),
                                                            detail: mutasiDetail
                                                        }
                                                        res.xstatus(200).json(jsonObj)
                                                    }).catch(err => next(new ApiError(422, err + `Couldn't find mutasi ${transNo}.`, err)))
                                                } else {
                                                    res.xstatus(200).json({
                                                        success: true,
                                                        message: headerCreated.message,
                                                        approval: true,
                                                        appvno: headerCreated.appvno
                                                    })
                                                }
											}
										}).catch(err => next(new ApiError(501, `Couldn't create mutasi ${transNo}.`, err)))
									} else {
										throw new Error('Cannot find request order')
									}
							} else {
									throw new Error(check.RESULT)
							}
					}).catch(err => next(new ApiError(501, `Couldn't create mutasi ${transNo}.`, err)))
				}).catch(err => next(new ApiError(501, `Couldn't create mutasi ${transNo}.`, err)))
			}
    })
}

exports.cancelTransferOut = function (req, res, next) {
    console.log('Requesting-cancelTransferOut: ' + req.url + ' ...')
    let transNo = req.body.transNo
    let storeId = req.body.storeId
    let memo = req.body.memo
    const data = req.body
    const userLogIn = extractTokenProfile(req)
    return transExistsOutCancel(transNo, storeId).then(exists => {
        if (!exists) {
            next(new ApiError(409, `Transaction ${transNo} not exists or already used.`))
        } else {
            return cancelTransferOut(data, userLogIn.userid, next).then((detailCreated) => {
                return getTransByNoOut(transNo, storeId).then((mutasi) => {
                    let jsonObj = {
                        success: true,
                        message: `Mutasi of ${transNo} updated`,
                    }
                    if (project.message_detail === 'ON') {
                        Object.assign(jsonObj, {
                            data: mutasi,
                        })
                    }
                    res.xstatus(200).json(jsonObj)
                }).catch(err => next(new ApiError(422, err + `Couldn't find mutasi ${transNo}.`, err)))
            }).catch(err => next(new ApiError(501, `Couldn't create mutasi ${transNo}.`, err)))
        }
    })
}
