import {
    ApiError
} from '../services/v1/errorHandlingService'
import {
    createTransferOutHpokok,
    dropOutDetail
} from '../services/transfer/transferHppService'
import { getOutDetail } from '../services/mutasiService'

// Get By TransNo
exports.getOutDetail = function (req, res, next) {
    console.log('Requesting-getOutDetail: ' + JSON.stringify(req.url) + ' ...')
    const { includeHPP, ...otherQuery } = req.query
    getOutDetail(otherQuery).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi Detail ${req.query.transNo}.`, err)))
}

exports.dropOutDetail = function (req, res, next) {
    console.log('Requesting-dropOutDetail: ' + JSON.stringify(req.url) + ' ...')
    dropOutDetail(req.params.id, next).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi Detail .`, err)))
}

exports.insertOutDetail = function (req, res, next) {
    console.log('Requesting-insertOutDetail: ' + JSON.stringify(req.url) + ' ...')
    createTransferOutHpokok(req.params.id, next).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi Detail .`, err)))
}