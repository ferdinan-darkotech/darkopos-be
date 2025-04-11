import project from '../../config/project.config'
import {
    ApiError
} from '../services/v1/errorHandlingService'
import {
    getInDetail
}
    from '../services/mutasiService'
import {
    createTransferInHp,
    dropInDetail
} from '../services/transfer/transferHppService'
import {
    extractTokenProfile
} from '../services/v1/securityService'

// Get By TransNo
exports.getInDetail = function (req, res, next) {
    console.log('Requesting-getInDetail: ' + JSON.stringify(req.url) + ' ...')
    getInDetail(req.query).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi Detail ${transNo}.`, err)))
}

// Insert By Id
exports.insertDetail = function (req, res, next) {
    console.log('Requesting-insertTransferInDetail: ' + JSON.stringify(req.url) + ' ...')
    createTransferInHp(req.params.id, next).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi Detail ${transNo}.`, err)))
}

exports.dropInDetail = function (req, res, next) {
    console.log('Requesting-dropInDetail: ' + JSON.stringify(req.url) + ' ...')
    dropInDetail(req.params.id, next).then((Mutasi) => {
        res.xstatus(200).json({
            success: true,
            message: 'Ok',
            mutasi: Mutasi
        })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Mutasi Detail ${transNo}.`, err)))
}
