// [NEW]: FERDINAN - 2025-03-06
import { addNewRequestStockOut, changeRequestStockOut, changeStatusCancel, fetchFinishRequestStockOut, fetchRequestStockOut, fetchRequestStockOutByTransNo, fetchTransactionRequestStockOut, removeRequestStockOut } from "../services/requestStockOutService"
import { extractTokenProfile } from "../services/v1/securityService"
import { ApiError } from '../services/v1/errorHandlingService'

exports.createRequestStockOut = async function (req, res, next) {
    console.log('Requesting-createRequestStockOut: ' + req.url + ' ...')
    let data = req.body
    const userLogIn = extractTokenProfile(req)
    console.log("userLogIn", userLogIn)
    return addNewRequestStockOut(data, userLogIn.userid).then((result) => {
        let jsonObj = result
        res.xstatus(200).json(jsonObj)
    }).catch(err => next(new ApiError(422, `Couldn't create request stock out.`, err)))
}

exports.updateRequestStockOut = async function (req, res, next) {
    console.log('Requesting-updateRequestStockOut: ' + req.url + ' ...')
    const transactionnumber = req.params.id
    const userLogIn = extractTokenProfile(req)
    const data = req.body
    return changeRequestStockOut(transactionnumber, userLogIn.userid, data).then((created) => {
        res.xstatus(200).json(created)
    }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}

exports.deleteRequestStockOut = async function (req, res, next) {
    console.log('Requesting-deleteRequestStockOut: ' + req.url + ' ...')
    const transactionnumber = req.params.id
    const userLogIn = extractTokenProfile(req)
    return removeRequestStockOut(transactionnumber, userLogIn.userid).then((created) => {
        res.xstatus(200).json(created)
    }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}

exports.getRequestStockOut = async function (req, res, next) {
    console.log('Requesting-getRequestStockOut: ' + req.url + ' ...')
    const { storeid, search, pageSize, page } = req.query
    const pagination = { pageSize, page }
    return fetchRequestStockOut(storeid, search, pagination).then((result) => {
        res.xstatus(200).json(result)
    }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}

exports.getRequestStockOutDetail = async function (req, res, next) {
    console.log('Requesting-getRequestStockOutDetail: ' + req.url + ' ...')
    const transactionnumber = req.params.id
    return fetchRequestStockOutByTransNo(transactionnumber).then((result) => {
        res.xstatus(200).json(result)
    }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}

exports.getTransactionRequestStockOut = async function (req, res, next) {
    console.log('Requesting-getTransactionRequestStockOut: ' + req.url + ' ...')
    const transactionnumber = req.params.id
    return fetchTransactionRequestStockOut(transactionnumber).then((result) => {
        res.xstatus(200).json(result)
    }).catch(err => next(new ApiError(501, `Couldn't find stock.`, err)))
}

// [NEW]: FERDINAN - 2025-03-28
exports.updateStatusCancelRequestStockOut = async function (req, res, next) {
    console.log('Requesting-UpdateStatusCancelRequestStockOut: ' + req.url + ' ...')
    const transactionnumber = req.params.id
    const userLogIn = extractTokenProfile(req)
    return changeStatusCancel(transactionnumber, req.body, userLogIn.userid).then((result) => {
        res.xstatus(200).json(result)
    }).catch(err => next(new ApiError(501, `Couldn't update stock.`, err)))
}

// [ACCEPT REQUEST STOCK OUT REPORT]: FERDINAN - 2025/06/30
exports.getFinishRequestStockOut = async function (req, res, next) {
    console.log('Requesting-getRequestStockOut: ' + req.url + ' ...')
    const { storeid } = req.query
    return fetchFinishRequestStockOut(storeid, req.query).then((result) => {
        res.xstatus(200).json(result)
    }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}
