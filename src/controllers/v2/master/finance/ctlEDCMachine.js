import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import {
  srvGetEDCMachines, srvEDCMachineExist,
  srvGetEDCMachineById, srvGetEDCMachineByCode,
  srvCreateEDCMachine, srvDeleteEDCMachine, srvUpdateEDCMachine
  } from '../../../../services/v2/master/finance/srvEDCMachine'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get EDC Machines
exports.getEDCMachines = function (req, res, next) {
  console.log('Requesting-getEDCMachines: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }
  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
  }

  srvGetEDCMachines(req.query).then((option) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: option.count,
      data: option.rows
    })
  }).catch(err => next(new ApiError(422, `ZCEM-00001: Couldn't find EDC Machines`, err)))
}

// Create a new edc machine
exports.insertEDCMachine = function (req, res, next) {
  console.log('Requesting-insertEDCMachine: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  srvEDCMachineExist(data.code).then(exists => {
    if (exists)
      next(new ApiError(409, `ZCEM-00002-EDC Machine '${data.code}' already exists.`))
    else {
      return srvCreateEDCMachine(data, userLogIn.userid, next).then((created) => {
        return srvGetEDCMachineById(created.id).then((result) => {
          let jsonObj = {
            success: true,
            message: `EDC Machine ${result.code} created`,
          }
          // if (project.message_detail === 'ON')
          { Object.assign(jsonObj, { edc: result }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCEM-00003: Couldn't find EDC Machine ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCEM-00004: Couldn't create EDC Machine ${data.code}.`, err)))
    }
  })
}

//Update a EDC Machine
exports.updateEDCMachine = function (req, res, next) {
  console.log('Requesting-updateEDCMachine: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvEDCMachineExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateEDCMachine(data, userLogIn.userid, next).then((updated) => {
        return srvGetEDCMachineByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `EDC Machine ${result.code} updated`,
          }
          { Object.assign(jsonObj, { edc: result }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCEM-00005: Couldn't update EDC Machine ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCEM-00006: Couldn't update EDC Machine ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCEM-00007: Couldn't find EDC Machine ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCEM-00008: Couldn't find EDC Machine ${data.code} .`, err)))
}

//Delete a EDC Machine
exports.deleteEDCMachine = function (req, res, next) {
  console.log('Requesting-deleteEDCMachine: ' + req.url + ' ...')
  let code = req.params.code
  srvEDCMachineExist(code).then(exists => {
    if (exists) {
      srvDeleteEDCMachine(code).then((optionDeleted) => {
        if (optionDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `EDC Machine ${code} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { edc: optionDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCEM-00009: Couldn't delete EDC Machine ${code}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCEM-00010: Couldn't delete EDC Machine ${code}.`, err)))
    } else {
      next(new ApiError(422, `ZCEM-00011: EDC Machine ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCEM-00012: EDC Machine ${code} not exists.`, err)))
}
