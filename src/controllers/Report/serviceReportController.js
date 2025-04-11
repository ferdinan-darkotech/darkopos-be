/**
 * Created by Veirry on 17/09/2017.
 */
import { ApiError } from '../../services/v1/errorHandlingService'
import {
    countDataServiceDetail, getDataServiceDetail, getReportServiceTrans, getReportServiceMechanic, getReportServiceByItem
} from '../../services/Report/serviceReportService'

// Retrieve list of stocks
exports.getDataServiceDetail = function (req, res, next) {
    console.log('Requesting-getDataServiceDetail: ' + req.url + ' ...')
    let { pageSize, page, ...other } = req.query
    const pagination = {
        pageSize,
        page
    }
    
    return getReportServiceByItem(other).then(rs => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            params: other,
            pageSize: pageSize || 10,
            page: page || 1,
            total: rs.count,
            data: rs.rows
        })
    })
    // countDataServiceDetail(other).then((count) => {
    //     console.log('count', count, other)
    //     return getDataServiceDetail(other, pagination).then((data) => {
    //         res.xstatus(200).json({
    //             success: true,
    //             message: 'Ok',
    //             params: other,
    //             pageSize: pageSize || 10,
    //             page: page || 1,
    //             total: count,
    //             data: data
    //         })
    //     }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
    // }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

exports.getServiceReportTrans = function (req, res, next) {
    getReportServiceTrans(req.query).then((service) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            total: service.length,
            data: service
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Service Report.`, err)))
}

exports.getServiceReportMechanic = function (req, res, next) {
    getReportServiceMechanic(req.query).then((service) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            total: service.length,
            data: service
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Service Report.`, err)))
}