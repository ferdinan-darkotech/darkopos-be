import project from '../../config/project.config'
import {
  ApiError
} from '../services/v1/errorHandlingService'
import {
  getSequenceFormatByCode,
  getSequenceByCode,
  getSequenceFormatById,
  getSequenceFormatData,
  updateResetSequenceFormat,
  InsertSequenceFormat,
  sequenceExists
}
  from '../services/sequenceService'
import {
  extractTokenProfile
} from '../services/v1/securityService'

exports.getSequenceFormat = function (req, res, next) {
  console.log('Requesting-getSequence: ' + req.url + ' ...')
  const query = req.query
  console.log('getSequence', query)
  return sequenceExists(query.seqCode, query.type).then((sequence) => {
    if (sequence) {
      return getSequenceFormatByCode(query, next).then((sequence) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: sequence
        })
      }).catch(err => next(new ApiError(422, err + ` - Couldn't find Sequence ${seqCode}.`, err)))
    } else {
      res.xstatus(501).json({
        success: false,
        message: `Couldn't find Sequence`,
      })
    }
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Sequence ${seqCode}.`, err)))
}

exports.increaseSequence = function (req, res, next) {
  console.log('Requesting-increaseSequence: ' + req.url + ' ...')
  const {
    seqCode,
    type
  } = req.query
  console.log('req.query', req.query)
  const userLogIn = extractTokenProfile(req)
  return getSequenceByCode(seqCode, type).then((sequence) => {
    let yearNumber = sequence
    yearNumber.seqValue = yearNumber.seqValue + 1
    return updateResetSequenceFormat(yearNumber, userLogIn.userid, next).then((yearUpdate) => {
      return getSequenceByCode(yearNumber.seqCode, type).then((sequenceById) => {
        let jsonObj = {
          success: true,
          message: 'Ok',
          data: sequenceById
        }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(501, `Couldn't update Member ${yearNumber.seqName}.`, err)))
    }).catch(err => next(new ApiError(500, `Couldn't save Transaction.`, err)))
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Sequence ${seqCode}.`, err)))
}

exports.insertSequence = function (req, res, next) {
  console.log('Requesting-createSequence: ' + req.url + ' ...')
  let id = req.params.id
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  sequenceExists(id, data.storeId).then(exists => {
    if (exists) {
      next(new ApiError(409, `Sequence '${id}' already exists.`))
    } else {
      return InsertSequenceFormat(id, data, userLogIn.userid, next).then((sequenceCreated) => {
        return getSequenceByCode(id, data.storeId).then((sequence) => {
          res.xstatus(200).json({
            success: true,
            message: `Sequence ${sequence.seqName} created`,
            data: sequence,
          })
        }).catch(err => next(new ApiError(422, err + ` - Couldn't find Sequence ${id}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create Sequence ${id}.`, err)))
    }
  })
}

//Update Sequence
exports.updateSequence = function (req, res, next) {
  console.log('Requesting-updateSequence: ' + req.url + ' ...')
  const { seqCode, type } = req.query
  const userLogIn = extractTokenProfile(req)
  sequenceExists(seqCode, type).then(exists => {
    if (exists) {
      return getSequenceByCode(seqCode, type).then((sequence) => {
        req.body.id = sequence.id
        return updateResetSequenceFormat(req.body, userLogIn.userid, next).then((yearUpdate) => {
          return getSequenceByCode(seqCode, type).then((sequenceById) => {
            let jsonObj = {
              success: true,
              message: 'Ok',
              data: sequenceById
            }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(501, `Couldn't find Sequence ${yearNumber.seqName}.`, err)))
        }).catch(err => next(new ApiError(500, `Couldn't update Sequence.`, err)))
      }).catch(err => next(new ApiError(422, err + ` - Couldn't find Sequence ${seqCode}.`, err)))
    } else {
      next(new ApiError(409, `Sequence '${seqCode}' is not exists.`))
    }
  })
}
