import project from '../../../config/project.config'
import {
    ApiError
} from '../../services/v1/errorHandlingService'
import {
    getTransById,
    getTransByNo,
    getPurchaseTransByNo,
    ReceivableQuery,
    checkPayment,
    PosTransExists,
    getTransBySplit,
    getTransByNo5,
    getTransByNo6,
    createPayment,
    createBulkPayment,
    cancelPayment,
} from '../../services/payment/paymentPayableService'
import {
    extractTokenProfile
} from '../../services/v1/securityService'

// Get Payment By TransNo
exports.getTransBySplit = function (req, res, next) {
    console.log('Requesting-getTransBySplit: ' + JSON.stringify(req.params) + ' ...')
    var transNo = req.query.transNo
    var storeId = req.query.storeId
    getTransBySplit(transNo, storeId).then((Payment) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: Payment
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${transNo}.`, err)))
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
    console.log('Requesting-getTransByNoWithPOS2: ' + JSON.stringify(req.params) + ' ...')
    getTransByNo5(req.query).then((Payment) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            total: Payment.length,
            data: Payment
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
}
exports.getTransByNoWithBank = function (req, res, next) {
    console.log('Requesting-getTransByNoWithBank: ' + JSON.stringify(req.params) + ' ...')
    getTransByNo6(req.query).then((Payment) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            total: Payment.length,
            data: Payment
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${req.query.transNo}.`, err)))
}

// Get Purchase By TransNo
exports.getPurchaseByNo = function (req, res, next) {
    console.log('Requesting-getPurchaseByNo: ' + JSON.stringify(req.params) + ' ...')
    getPurchaseTransByNo(req.query).then((Payment) => {
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
            next(new ApiError(409, `Transaction doesn't exists.`))
        }
    })
}

// Create a New Payment
exports.insertBulkPayment = function (req, res, next) {
    console.log('Requesting-insertPayment: ' + req.url + ' ...')
    let data = req.body.data
    let head = req.body.head
    let storeId = req.body.head.storeId
    let storeIdPayment = req.body.head.storeIdPayment
    let transNo = req.body.head.transNo
    const userLogIn = extractTokenProfile(req)
    PosTransExists(head).then(exists => {
        if (exists) {
            return ReceivableQuery(transNo, storeId).then((result) => {
                if (result) {
                    return getPosTransByNo(head).then((posHeader) => {
                        const payment = {
                            amount: data.reduce((cnt, o) => cnt + o.amount, 0)
                        }
                        return getTransByNo(transNo, storeId).then((Payment) => {
                            return createBulkPayment(storeId, posHeader[0].id, storeIdPayment, data, userLogIn.userid, next).then((headerCreated) => {
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
                        }).catch(err => next(new ApiError(422, err + ` - Couldn't find Payment ${transNo}.`, err)))
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
        } else {
            next(new ApiError(409, `Transaction doesn't exists or already paid.`))
        }
    })
}
