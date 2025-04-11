/**
 * Created by pan d a .h a s .m y .id on 2018-06-08.
 */
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  srvSetCounterInfo, srvCounterNameExists, countData, srvCounterIdExists,
  srvGetCounterByName, srvGetCounterById, srvGetCounters,
  srvCreateCounter, srvUpdateCounter, srvDeleteCounter
} from '../../services/cashier/counterService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve list a counter
exports.getCounter = function (req, res, next) {
  console.log('Requesting-getCounter: ' + req.url + ' ...')
  const counterId = req.params.id
  srvGetCounterById(counterId).then((counter) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: counter
    })
  }).catch(err => next(new ApiError(404, `ZCCC-00001: Couldn't find Counter ${counterId}.`, err)))
}

// Retrieve list of counters
exports.getCounters = function (req, res, next) {
  console.log('Requesting-getCounters: ' + req.url + ' ...')
  let { pageSize, page, order, ...other } = req.query
  const pagination = { pageSize, page, order }
  countData(other, pagination).then((count) => {
    return srvGetCounters(other, pagination).then((counters) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: count,
        data: counters
      })
    }).catch(err => next(new ApiError(404, `ZCCC-00002: Couldn't find Counters.`, err)))
  }).catch(err => next(new ApiError(404, `COUNTZCCC-00002: Couldn't count Counters.`, err)))
}

// Create a new counter
exports.insertCounter = function (req, res, next) {
  console.log('Requesting-insertCounter: ' + req.url + ' ...')
  const counter = req.body
  const userLogIn = extractTokenProfile(req)
  srvCounterNameExists(counter.name).then(exists => {
    if (exists) {
      next(new ApiError(409, `ZCCC-00003: Counter ${counter.name} already available.`))
    } else {
      srvCreateCounter(counter, userLogIn.userid, next).then((created) => {
        srvGetCounterByName(created.counterName).then((results) => {
          const counterInfo = srvSetCounterInfo(results)
          let jsonObj = {
            success: true,
            message: `Counter ${counterInfo.name} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { counter: counterInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCCC-00004: Couldn't find counter ${counter.name}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCCC-00005: Couldn't create counter ${counter.name}.`, err)))
    }
  })
}

//Update a Counter
exports.updateCounter = function (req, res, next) {
  console.log('Requesting-updateCounter: ' + req.url + ' ...')
  const counterId = req.params.id
  let counter = req.body
  const userLogIn = extractTokenProfile(req)
  srvCounterIdExists(counterId).then(exists => {
    if (exists) {
      return srvUpdateCounter(counterId, counter, userLogIn.userid, next).then((updated) => {
        return srvGetCounterById(counterId).then((results) => {
          const counterInfo = srvSetCounterInfo(results)
          let jsonObj = {
            success: true,
            message: `Counter ${counterInfo.name} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { counter: counterInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCCC-00006: Couldn't update Counter ${counterId}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCCC-00007: Couldn't update Counter ${counterId}.`, err)))
    } else {
      next(new ApiError(404, `ZCCC-00008: Couldn't find Counter ${counterId}.`))
    }
  }).catch(err => next(new ApiError(422, `ZCCC-00009: Couldn't find Counter ${counterId}.`, err)))
}

//Delete a Counter
exports.deleteCounter = function (req, res, next) {
  console.log('Requesting-deleteCounter: ' + req.url + ' ...')
  const counterId = req.params.id
  srvCounterIdExists(counterId).then(exists => {
    if (exists) {
      return srvDeleteCounter(counterId, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Counter ${counterId} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { counters: deleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCCC-00010: Couldn't delete Counter ${counterId}.`))
        }
      }).catch(err => next(new ApiError(422, `ZCCC-00011: Couldn't delete Counter ${counterId}}.`, err)))
    } else {
      next(new ApiError(422, `ZCCC-00012: Counter ${counterId} not available.`))
    }
  }).catch(err => next(new ApiError(422, `ZCCC-00013: Counter ${counterId} not available.`, err)))
}