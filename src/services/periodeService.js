/**
 * Created by Veirry on 22/09/2017.
 */
import db from '../models'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'

const sequelize = require('sequelize')

let Period = db.tbl_period
let vwPeriod = dbv.vw_period
const periodField = ['id', 'storeCode', 'storeName', 'storeId', 'transNo', 'startPeriod', 'endPeriod', 'memo', 'active', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']

export function getPeriodLastCode (query) {
    for (let key in query) {
        if (key === 'createdAt') {
            query[key] = { between: query[key] }
        }
    }
    return Period.findAll({
        attributes: [
            [sequelize.fn('max', sequelize.col('transNo')), 'transNo'],
        ]
    })
}

export function getPeriodByCode (account, storeId) {
    return Period.findOne({
        where: {
            storeId: storeId,
            transNo: account
        },
        raw: false
    })
}

export function getPeriodActive (storeId) {
    return Period.findAll({
        where: {
            storeId: storeId,
            active: 'O',
        },
        raw: false
    })
}

export function getOnePeriodActive (storeId) {
    return Period.findOne({
        where: {
            storeId: storeId,
            active: 'O',
        },
        raw: false
    })
}

export function getPeriodData (query) {
    for (let key in query) {
        if (key === 'createdAt') {
            query[key] = { between: query[key] }
        }
    }
    return vwPeriod.findAll({
        attributes: periodField,
        where: {
            active: 'O'
        },
        order: [
            ['storeId']
        ]
    })
}

export function setPeriodInfo (request) {
    const getPeriodInfo = {
        transNo: request.transNo,
        startPeriod: request.startPeriod,
        endPeriod: request.endPeriod,
        memo: request.memo,
        createdBy: request.createdBy,
    }

    return getPeriodInfo
}

export function periodExists (account, storeId) {
    return getPeriodByCode(account, storeId).then(account => {
        if (account === null) {
            return false;
        }
        else {
            return true;
        }
    })
}

export function periodActive (storeId) {
    return getPeriodActive(storeId).then(account => {
        if (account.length > 0) {
            return true;
        } else {
            return false;
        }
    })
}

export function createPeriod (account, period, createdBy, next) {
    return Period.create({
        transNo: account,
        storeId: period.storeId,
        startPeriod: period.startPeriod,
        endPeriod: period.endPeriod,
        createdBy: createdBy,
        updatedBy: '---'
    }).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const { parent, original, sql, ...other } = errObj
        next(new ApiError(400, other, err))
    })
}

export function updatePeriod (account, period, updatedBy, next) {
    return Period.update({
        memo: period.memo,
        reference: period.reference,
        active: 'C',
        updatedBy: updatedBy
    },
        { where: { transNo: account, storeId: period.storeId } }
    ).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const { parent, original, sql, ...other } = errObj
        next(new ApiError(400, other, err))
    })
}