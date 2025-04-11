/**
 * Created by Veirry on 29/09/2017.
 */
import { ApiError } from '../../services/v1/errorHandlingService'
import { getByTrans, getByDetail } from '../../services/Report/cashEntryReportService'

exports.getByTrans = function (req, res, next) {
    const { type, ...other } = req.query
    if (type === 'detail') {
        if (req.query.storeId) {
            getByTrans(other).then((data) => {
                return getByDetail(other).then(detail => {
                    res.xstatus(200).json({
                        success: true,
                        message: 'Ok',
                        total: (data || []).length,
                        data: data || [],
                        detail: detail || []
                    })
                })
            }).catch(err => next(new ApiError(501, err + ` - Couldn't find Report.`, err)))
        } else {
            next(new ApiError(409, `StoreId is required`))
        }
    } else {
        if (req.query.storeId) {
            getByTrans(other).then((data) => {
                res.xstatus(200).json({
                    success: true,
                    message: 'Ok',
                    data: data,
                    total: data.length
                })
            }).catch(err => next(new ApiError(501, err + ` - Couldn't find Adjust Report.`, err)))
        } else {
            next(new ApiError(409, `StoreId is required`))
        }
    }
}