import project from '../../../config/project.config'
import {
    ApiError
} from '../../services/v1/errorHandlingService'
import {
    getPaymentOption,
    getTransById,
    getTransByNo,
    getPosTransByNo,
    ReceivableQuery,
    checkPayment,
    PosTransExists,
    getTransBySplit,
    getTransByNo5,
    createPayment,
    createBulkPayment,
    cancelPayment,
    insertHistory
} from '../../services/payment/paymentService'
import {
    extractTokenProfile
} from '../../services/v1/securityService'

// Get Payment By TransNo
exports.getTransBySplit = function (req, res, next) {
    console.log('Requesting-getTransBySplit: ' + JSON.stringify(req.params) + ' ...')
    var transNo = req.query.transNo
    var storeId = req.query.storeId
    if (req.query.transNo && req.query.storeId) {
        getTransBySplit(transNo, storeId).then((Payment) => {
            res.xstatus(200).json({
                success: true,
                message: 'Ok',
                data: Payment
            })
        }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${transNo}.`, err)))
    } else {
        next(new ApiError(422, 'TransNo and StoreId is Required'))
    }
}

// Get Payment By TransNo
exports.getTransByNo = function (req, res, next) {
    console.log('Requesting-getTransByNo: ' + JSON.stringify(req.params) + ' ...')
    getTransByNo(req.query).then((Payment) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: Payment
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
}

// Get Payment By TransNo
exports.getTransByNoWithPOS = function (req, res, next) {
    console.log('Requesting-getTransByNoWithPOS1: ' + JSON.stringify(req.params) + ' ...')
    getTransByNo5(req.query).then((Payment) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            total: Payment.length,
            data: Payment
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
}

// Get Pos By TransNo
exports.getPosByNo = function (req, res, next) {
    console.log('Requesting-getPosByNo: ' + JSON.stringify(req.params) + ' ...')
    getPosTransByNo(req.query).then((Payment) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            total: Payment.length,
            data: Payment
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${transNo}.`, err)))
}

// Create a New Payment
exports.insertPayment = function (req, res, next) {
    console.log('Requesting-insertPayment: ' + req.url + ' ...')
    let data = req.body.data
    let storeId = req.body.data.storeId
    let transNo = req.body.data.transNo
    const userLogIn = extractTokenProfile(req)
    PosTransExists(req.body.data).then(exists => {
        if (exists) {
            return ReceivableQuery(transNo, storeId).then((result) => {
                if (result) {
                    return checkPayment(transNo, storeId, data).then((result) => {
                        if (result) {
                            return createPayment(storeId, data, userLogIn.userid, next).then((headerCreated) => {
                                return getTransByNo(transNo, storeId).then((payment) => {
                                    let jsonObj = {
                                        success: true,
                                        message: `Payment of ${transNo} created`,
                                    }
                                    if (project.message_detail === 'ON') {
                                        Object.assign(jsonObj, {
                                            data: payment,
                                        })
                                    }
                                    res.xstatus(200).json(jsonObj)
                                }).catch(err => next(new ApiError(422, err + `Couldn't find transaction ${transNo}.`, err)))
                            }).catch(err => next(new ApiError(501, `Couldn't create transaction ${transNo}.`, err)))
                        } else {
                            next(new ApiError(409, `Amount is bigger than netto.`))
                        }
                    }).catch(err => next(new ApiError(501, `Couldn't create transaction ${transNo}.`, err)))
                } else {
                    next(new ApiError(409, `Transaction ${transNo} Already Paid.`))
                }
            }).catch(err => next(new ApiError(501, `Couldn't create transaction ${transNo}.`, err)))
        } else {
            next(new ApiError(409, `Transaction ${req.data.transNo} doesn't exists.`))
        }
    })
}

// Create a New Payment
exports.insertBulkPayment = function (req, res, next) {
    console.log('Requesting-insertPayment: ' + req.url + ' ...')
    next(new ApiError(299, 'Deprecated API please refresh.'))
}

exports.cancelPayment = function (req, res, next) {
    console.log('Requesting-cancelPayment: ' + req.url + ' ...')
    let key = req.body.id
    let memoPayment = req.body.memo
    const userLogIn = extractTokenProfile(req)
    getTransById(key).then(exists => {
        if (exists) {
            const {
                updatedBy,
                id,
                reference,
                createdBy,
                memo,
                ...other
            } = exists
            other.memo = memoPayment
            other.id = key
            return insertHistory(key, other, userLogIn.userid, next).then((created) => {
                return cancelPayment(key, memoPayment, userLogIn.userid, next).then((canceled) => {
                    return getTransByNo(req.body.transNo, req.body.storeId).then((payment) => {
                        let jsonObj = {
                            success: true,
                            message: `Payment of ${req.body.transNo} updated`,
                        }
                        if (project.message_detail === 'ON') {
                            Object.assign(jsonObj, {
                                data: exists,
                            })
                        }
                        res.xstatus(200).json(jsonObj)
                    }).catch(err => next(new ApiError(422, err + `Couldn't find transaction ${req.body.transNo}.`, err)))
                }).catch(err => next(new ApiError(501, `Couldn't update transaction ${req.body.transNo}.`, err)))
            }).catch(err => next(new ApiError(501, `Couldn't Insert transaction ${req.body.transNo}.`, err)))
        } else {
            next(new ApiError(409, `Transaction doesn't exists or already paid.`))
        }
    })
}
