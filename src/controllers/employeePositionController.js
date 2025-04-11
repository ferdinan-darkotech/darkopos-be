import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
  setPositionInfo, getPositionByCode, positionExists,
  getPositionsData, createPosition, updatePosition, deletePosition, deletePositions
}
  from '../services/employeePositionService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrieve list a position
exports.getPosition = function (req, res, next) {
  console.log('Requesting-getPosition: ' + req.url + ' ...')
  const positioncode = req.params.id
  getPositionByCode(positioncode).then((position) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: position
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Position ${positioncode}.`, err)))
}

// Retrieve list of positions
exports.getPositions = function (req, res, next) {
  console.log('Requesting-getPositions: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getPositionsData(other).then((positions) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(positions)),
      total: positions.length
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Positions.`, err)))
}

// Create a new position
exports.insertPosition = function (req, res, next) {
  console.log('Requesting-insertPosition: ' + req.url + ' ...')
  const positioncode = req.params.id
  const position = req.body
  const userLogIn = extractTokenProfile(req)
  positionExists(positioncode).then(exists => {
    if (exists) {
      next(new ApiError(409, `Employee Position ${positioncode} already exists.`))
    } else {
      return createPosition(positioncode, position, userLogIn.userid, next).then((positionCreated) => {
        return getPositionByCode(positionCreated.positionCode).then((positionGetByCode) => {
          const positionInfo = setPositionInfo(positionGetByCode)
          let jsonObj = {
            success: true,
            message: `Employee Position ${positionInfo.positionCode} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { position: positionInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find Employee Position ${positioncode}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create Employee Position ${positioncode}.`, err)))
    }
  })
}

//Update a Position
exports.updatePosition = function (req, res, next) {
  console.log('Requesting-updatePosition: ' + req.url + ' ...')
  const positioncode = req.params.id
  let position = req.body
  const userLogIn = extractTokenProfile(req)
  positionExists(positioncode).then(exists => {
    if (exists) {
      return updatePosition(positioncode, position, userLogIn.userid, next).then((positionUpdated) => {
        return getPositionByCode(positioncode).then((positionGetByCode) => {
          const positionInfo = setPositionInfo(positionGetByCode)
          let jsonObj = {
            success: true,
            message: `Employee Position ${positionGetByCode.positionCode} - ${positionGetByCode.positionName} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { position: positionInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Employee Position ${positioncode}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update Employee Position ${positioncode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Employee Position ${positioncode}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Employee Position ${positioncode}.`, err)))
}

//Delete a Position
exports.deletePosition = function (req, res, next) {
  console.log('Requesting-deletePosition: ' + req.url + ' ...')
  const positioncode = req.params.id
  positionExists(positioncode).then(exists => {
    if (exists) {
      return deletePosition(positioncode, next).then((positionDeleted) => {
        if (positionDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Employee Position ${positioncode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { positions: positionDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Employee Position ${positioncode}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Employee Position ${positioncode}.`, err)))
    } else {
      next(new ApiError(422, `Employee Position ${positioncode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Employee Position ${positioncode} not exists.`, err)))
}

//Delete some Position
exports.deletePositions = function (req, res, next) {
  console.log('Requesting-deletePositions: ' + req.url + ' ...')
  let positions = req.body;
  deletePositions(positions, next).then((positionDeleted) => {
    if (positionDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Employee Positions [ ${positions.positionCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { positions: positionDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Employee Positions [ ${positions.positionCode} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Employee Positions [ ${positions.positionCode} ].`, err)))
}
