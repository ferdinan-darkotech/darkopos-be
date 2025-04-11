/**
 * Created by Veirry on 29/09/2017.
 */
import { ApiError} from '../../services/v1/errorHandlingService'
import { getReportAdjInTrans, getReportAdjOutTrans, getReportReturnOutTrans } from '../../services/Report/adjustReportService'

exports.getAdjInReport = function (req, res, next) {
    let { ...other } = req.query
    getReportAdjInTrans(other).then((pos) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(pos)),
            total: pos.length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Adjust Report.`, err)))
}

exports.getAdjOutReport = function (req, res, next) {
    let { ...other } = req.query
    getReportAdjOutTrans(other).then((pos) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(pos)),
            total: pos.length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Adjust Report.`, err)))
}

exports.getReturnOutTrans = function (req, res, next) {
    let { ...other } = req.query
    getReportReturnOutTrans(other).then((pos) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: JSON.parse(JSON.stringify(pos)),
            total: pos.length
        })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Return Report.`, err)))
}