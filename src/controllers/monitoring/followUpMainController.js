import { ApiError } from '../../services/v1/errorHandlingService'
import {
  insertData, updateDataCall, updateStatusCall, dataExistsByPosIdFollow,
  dataExists, dataExistsByPosId,
  updateStatusAcceptOffering,
  updateStatusDenyOffering,
  updateStatusPendingCall
} from '../../services/monitoring/followUpMainService'
import {
  getDataPosId
} from '../../services/monitoring/followUpHeaderService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Create a new data
exports.insertDataView = function (req, res, next) {
  console.log('Requesting-insertData-FLWUPM: ' + req.url + ' ...')
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  dataExistsByPosId(data.posId).then(exists => {
    if (!exists) {
      next(new ApiError(422, `Pos of ${data.posId} not exists.`))
      return dataExistsByPosIdFollow(data.posId).then(exists => {

      })
    } else {
      return dataExistsByPosIdFollow(data.posId).then(exists => {
        if (exists) {
          return getDataPosId(data.posId).then(dataResult => {
            let jsonObj = {
              success: true,
              message: 'Success',
              data: dataResult
            }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(501, `Couldn't get data.`, err)))
        } else {
          return insertData(data, userLogIn.userid, next).then((created) => {
            return getDataPosId(data.posId).then(dataResult => {
              let jsonObj = {
                success: true,
                message: `Data already created`,
                data: dataResult
              }
              res.xstatus(200).json(jsonObj)
            }).catch(err => next(new ApiError(501, `Couldn't get data.`, err)))
          }).catch(err => next(new ApiError(501, `Couldn't create data.`, err)))
        }
      }).catch(err => next(new ApiError(501, `Couldn't create data.`, err)))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create data.`, err)))
}

// Update a Data
exports.updateDataCall = function (req, res, next) {
  console.log('Requesting-updateData: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(exists => {
    if (exists) {
      return updateStatusCall(id, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: 'Call in progress',
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

// Create a new data
exports.insertDataCall = function (req, res, next) {
  console.log('Requesting-insertDataCall: ' + req.url + ' ...')
  const header = req.body.header
  const detail = req.body.detail
  const id = req.params.id
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(exists => {
    if (!exists) {
      next(new ApiError(404, `Data ${id} not exists.`))
    } else {
      return updateDataCall(id, header, detail, userLogIn.userid, next).then((dataResult) => {
        let jsonObj = {
          success: true,
          message: 'Call Data Already Updated',
          data: dataResult
        }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(422, `Couldn't create data.`, err)))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create data.`, err)))
}

//Update a updateDataPendingCall
exports.updateDataPendingCall = function (req, res, next) {
  console.log('Requesting-updateDataPendingCall: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body.data
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(exists => {
    if (exists) {
      return updateStatusPendingCall(id, data, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: 'Call is pending',
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

//Update a Deny
exports.updateDataAcceptOffering = function (req, res, next) {
  console.log('Requesting-updateDataAcceptOffering: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body.data
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(exists => {
    if (exists) {
      return updateStatusAcceptOffering(id, data, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: 'Call is done',
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

//Update a Deny
exports.updateDataDenyOffering = function (req, res, next) {
  console.log('Requesting-updateDataDenyOffering: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body.data
  const userLogIn = extractTokenProfile(req)
  dataExists(id).then(exists => {
    if (exists) {
      return updateStatusDenyOffering(id, data, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: 'Call is done',
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}