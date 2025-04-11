import project from '../../config/project.config'
import {
    ApiError
} from '../services/v1/errorHandlingService'
import {
    createTransferInHp
} from '../services/transfer/transferHppService'
import {
    getTransByNoIn,
    transExistsIn,
    getTransByNoOutForInsertIn,
    transExistsOutStatus,
    getInData,
    createTransferIn,
    // createTransferInDetail,
    updateStatusTransferOut,
    updateStatusTransferOutCancel,
    cancelTransferIn,
    getTransByNoInForCancel,
    transExistsInForCancel,
}
    from '../services/mutasiService'
import {
    extractTokenProfile
} from '../services/v1/securityService'
import { srvGetEmployeeByEmpId } from '../services/v2/master/humanresource/srvEmployee'

// Get By TransNo
exports.getTransByNoIn = function (req, res, next) {
    console.log('Requesting-getTransByNoIn: ' + JSON.stringify(req.params) + ' ...')
    let transNo = req.query.transNo
    let data = {
        transNo,
        storeId: req.query.storeId
    }
    getTransByNoIn(data).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi ${transNo}.`, err)))
}

// Retrive list of adjust
exports.getTransData = function (req, res, next) {
    console.log('Requesting-getTransferInData: ' + req.url + ' ...')
    let {
        pageSize,
        page,
        start,
        end,
        ...other
    } = req.query
    getInData(start, end, other).then((data) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: data,
            total: data.length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Mutasi.`, err)))
}

// Create a new mutasi
exports.insertTransferIn = function (req, res, next) {
    console.log('Requesting-insertTransferIn: ' + req.url + ' ...')
    var transNo = req.body.transNo
    let data = req.body.data
    let storeId = req.body.storeId
    const queryData = {
        transNo: transNo.toString(),
        reference: data.reference.toString(),
        active: 1
    }
    const queryTrans = {
        transNo: transNo.toString(),
        storeId,
        active: 1
    }
    let reference = req.body.data.reference
    var mutasiDetail = req.body.detail
    const userLogIn = extractTokenProfile(req)
    transExistsIn(queryTrans).then(exists => {
			if (exists) {
				next(new ApiError(409, `Transaction ${transNo} already exists.`))
			} else {
				return transExistsIn({ reference: data.reference.toString() }).then(exists => {
					if (exists) {
							next(new ApiError(409, `TI-0001-Reference already use.`))
					} else {
						return transExistsOutStatus(reference).then(exists => {
							if (!exists) {
									next(new ApiError(409, `Transaction Mutasi Out id: ${reference} not exists.`))
							} else {
								return getTransByNoOutForInsertIn(reference).then(async result => {
                                    const employeeData = JSON.parse(JSON.stringify(await srvGetEmployeeByEmpId(data.employeeId, {m: 'gid'})))
                                    data.employeeId = employeeData.id
                                    if(data.employeeId === null || data.employeeId === undefined) throw 'Employee not found.'

									return createTransferIn(transNo, data, mutasiDetail, result, storeId, userLogIn.userid, next).then((headerCreated) => {
										// return createTransferInDetail(transNo, mutasiDetail, storeId, userLogIn.userid, next).then((detailCreated) => {
										// return createTransferInHp(reference, next).then((detail) => {
										// return updateStatusTransferOut(reference, 1, data, userLogIn.userid, next).then((status) => {
                                        if(!headerCreated.success) {
                                            throw new Error(headerCreated.message)
                                        } else {
                                            return getTransByNoIn(queryData).then((mutasi) => {
                                                let jsonObj = {
                                                    success: true,
                                                    message: `Mutasi of ${transNo} created`,
                                                }
                                                if (project.message_detail === 'ON') {
                                                    Object.assign(jsonObj, {
                                                        data: mutasi,
                                                        detail: mutasiDetail
                                                    })
                                                }
                                                res.xstatus(200).json(jsonObj)
                                            }).catch(err => next(new ApiError(422, err + `Couldn't find mutasi ${transNo}.`, err)))
                                        }
										// }).catch(err => next(new ApiError(501, `Couldn't update status mutasi out ${transNo}.`, err)))
										// }).catch(err => next(new ApiError(501, `Couldn't create mutasi detail cogp ${transNo}.`, err)))
										// }).catch(err => next(new ApiError(501, `Couldn't create mutasi detail ${transNo}.`, err)))
									}).catch(err => next(new ApiError(501, `Couldn't create mutasi ${transNo}.`, err)))
								}).catch(err => next(new ApiError(422, err + `Couldn't find mutasi ${transNo}.`, err)))
							}
						})
					}
				})
			}
    })
}

exports.cancelTransferIn = function (req, res, next) {
    console.log('Requesting-cancelTransferIn: ' + req.url + ' ...')
    var transNo = req.body.transNo
    var reference = req.body.reference
    var storeId = req.body.storeId
    var memo = req.body.memo
    const data = req.body
    const queryData = {
        storeId,
        reference: reference
    }
    const userLogIn = extractTokenProfile(req)
    return transExistsInForCancel(transNo, storeId).then(exists => {
        console.log('checkExists', exists)
        if (!exists) {
            next(new ApiError(409, `Transaction ${transNo} not exists or already used.`))
        } else {
            return cancelTransferIn(data, userLogIn.userid, next, res).then((detailCreated) => {
                if (detailCreated) {
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
                }
            }).catch(err => next(new ApiError(501, `Couldn't update mutasi in ${transNo}.`, err)))
        }
    })
}