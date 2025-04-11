/**
 * Created by Veirry on 22/09/2017.
 */
import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
    setPeriodInfo, getPeriodByCode, periodExists, periodActive, getPeriodActive,
    getPeriodData, createPeriod, updatePeriod, getPeriodLastCode
} from '../services/periodeService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrieve list a period
exports.getPeriodCode = function (req, res, next) {
    console.log('Requesting-getPeriodCode: ' + req.url + ' ...')
    const account = req.params.id
    getPeriodByCode(account).then((account) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: account
        })
    }).catch(err => next(new ApiError(422, `Couldn't find Period ${account}.`, err)))
}

// Retrieve list of period
exports.getPeriodData = function (req, res, next) {
    console.log('Requesting-getPeriodData: ' + req.url + ' ...')
    let { pageSize, page, ...other } = req.query
    getPeriodData(other).then((period) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(period)),
            total: period.length
        })
    }).catch(err => next(new ApiError(422, `Couldn't find Period.`, err)))
}

// Retrieve list of period
exports.getPeriodActive = function (req, res, next) {
    console.log('Requesting-getPeriodActive: ' + req.url + ' ...')
    let { pageSize, page, ...other } = req.query
    getPeriodActive(other.storeId).then((period) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(period)),
            total: period.length
        })
    }).catch(err => next(new ApiError(422, `Couldn't find Period.`, err)))
}

// Retrieve last of period
exports.getLastNumber = function (req, res, next) {
    console.log('Requesting-getLastNumber: ' + req.url + ' ...')
    let { pageSize, page, ...other } = req.query
    getPeriodLastCode(other).then((period) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(period)),
            total: period.length
        })
    }).catch(err => next(new ApiError(422, `Couldn't find Period.`, err)))
}

//Create New Period
exports.insertPeriod = function (req, res, next) {
    console.log('Requesting-insertPeriod: ' + req.url + ' ...')
    const account = req.params.id
    const period = req.body.data
    const userLogIn = extractTokenProfile(req)
    return periodActive(period.storeId).then(active => {
        if (active) {
            next(new ApiError(409, `Something is Active.`))
        } else {
            return periodExists(account, period.storeId).then(exists => {
                if (exists) {
                    next(new ApiError(409, `Account ID ${account} already exists.`))
                } else {
                    return createPeriod(account, period, userLogIn.userid, next).then((periodCreated) => {
                        return getPeriodByCode(account, period.storeId).then((periodByCode) => {
                            const periodInfo = setPeriodInfo(periodByCode)
                            let jsonObj = {
                                success: true,
                                message: `Period ${account} created`,
                            }
                            if (project.message_detail === 'ON') { Object.assign(jsonObj, { period: periodInfo }) }
                            res.xstatus(200).json(jsonObj)
                        }).catch(err => next(new ApiError(422, err + `Couldn't find Period ${account}.`, err)))
                    }).catch(err => next(new ApiError(501, `Couldn't create Period ${account}.`, err)))
                }
            })
        }
    })
}

//Update New Period
exports.updatePeriod = function (req, res, next) {
    const account = req.params.id
    const storeId = req.body.data.storeId
    const period = req.body.data
    const userLogIn = extractTokenProfile(req)
    return periodActive(storeId).then(active => {
        if (active) {
            return periodExists(account, period.storeId).then(exists => {
                if (exists) {
                    return updatePeriod(account, period, userLogIn.userid, next).then((periodCreated) => {
                        let jsonObj = {
                            success: true,
                            message: `Period ${account} closed`,
                        }
                        res.xstatus(200).json(jsonObj)
                    }).catch(err => next(new ApiError(501, `Couldn't close Period ${account}.`, err)))
                } else {
                    next(new ApiError(409, `Account ID ${account} Not exists.`))
                }
            })
        } else {
            next(new ApiError(409, `Account Active Error.`))
        }
    })
}