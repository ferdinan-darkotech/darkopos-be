// servicesController
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  setServiceInfo, getServiceByCode, serviceExists, countData, getServicesData,
  createService, updateService, deleteService, deleteServices
}
  from '../../services/service/serviceService'

import { srvGetStoreBranch } from '../../services/v2/master/store/srvStore'

// Retrive list a service
exports.getService = function (req, res, next) {
  console.log('Requesting-getService: ' + req.url + ' ...')
  const servicecode = req.params.id
  getServiceByCode(servicecode).then((service) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: service
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Service ${servicecode}.`, err)))
}

// Retrive list of services
exports.getServices = function (req, res, next) {
  console.log('Requesting-getServices: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  const { store } = req.$userAuth
  const pagination = {
    pageSize,
    page
  }
  
  return srvGetStoreBranch(store).then(sbranch => {
    if(!sbranch) throw new Error('Regional is not found.')
    delete other.store
    const newOther = {
      ...other,
      reg_id: sbranch.parent_store_id
    }
    return getServicesData(newOther, pagination).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: data.count,
        data: data.rows
      })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Services.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Services.`, err)))
}

// Create a new service
exports.insertService = function (req, res, next) {
  console.log('Requesting-insertService: ' + req.url + ' ...')
  const servicecode = req.params.id
  let service = req.body
  const userLogIn = req.$userAuth
  return serviceExists(servicecode).then(async exists => {
    const storeBranch = await srvGetStoreBranch(userLogIn.store)
    if (exists) {
      return next(new ApiError(409, `Service '${servicecode}' already exists.`))
    } else if (!storeBranch) {
      return next(new ApiError(404, `Regional is not found.`))
    } else {
      service['reg_id'] = storeBranch.parent_store_id
      return createService(servicecode, service, userLogIn.userid, next).then((serviceCreated) => {
        let jsonObj = {
          success: true,
          message: `Service ${service.serviceName} created`,
        }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(501, `Couldn't create service ${servicecode}.`, err)))
    }
  })
}

//Update Service
exports.updateService = function (req, res, next) {
  console.log('Requesting-updateService: ' + req.url + ' ...')
  const servicecode = req.params.id
  let service = req.body
  const userLogIn = req.$userAuth
  return srvGetStoreBranch(userLogIn.store).then(storeBranch => {
    if (!storeBranch) return next(new ApiError(404, `Regional is not found.`))
    return getServiceByCode(servicecode, storeBranch.parent_store_id).then(_exists => {
      const exists = JSON.parse(JSON.stringify(_exists))
      if (exists) {
        return updateService(exists.id, exists.reg_id, service, userLogIn.userid, next, !exists.sync_at).then((serviceUpdated) => {
          let jsonObj = {
            success: true,
            message: `Service ${service.serviceName} updated`,
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `Couldn't find Service ${serviceCode}.`, err)))
      } else {
        next(new ApiError(422, `Couldn't find Service ${servicecode} .`))
      }
    }).catch(err => next(new ApiError(422, `Couldn't find Service ${service.serviceCode} .`, err)))
  }).catch(err => next(new ApiError(422, `Couldn't find Service ${service.serviceCode} .`, err)))
}

//Delete a Service
exports.deleteService = function (req, res, next) {
  console.log('Requesting-deleteService: ' + req.url + ' ...')
  let servicecode = req.params.id
  serviceExists(servicecode).then(exists => {
    if (exists) {
      deleteService(servicecode).then((serviceDeleted) => {
        if (serviceDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Service ${servicecode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { service: serviceDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Service ${servicecode} fail to delete.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Service ${servicecode}.`, err)))
    } else {
      next(new ApiError(422, `Service ${servicecode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Service ${servicecode} not exists.`, err)))
}

//Delete some Service
exports.deleteServices = function (req, res, next) {
  console.log('Requesting-deleteServices: ' + req.url + ' ...')
  let services = req.body;
  deleteServices(services).then((serviceDeleted) => {
    if (serviceDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Services [ ${services.serviceCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { services: serviceDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Services [ ${services.serviceCode} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Services [ ${services.serviceCode} ].`, err)))
}

// // Daftar Service By Code
// exports.getServiceByCode = function (req, res, next) {
//   console.log('Requesting /api/services/listById ...')
//   const serviceCode = req.params.serviceCode
//
//   getServiceByCode(serviceCode).then((service) => {
//     const serviceToReturn = setServiceInfo(service)
//
//     res.xstatus(200).json({
//       services: serviceToReturn
//     })
//   }).catch(err => next(new ApiError(501, `Couldn't find Service ${serviceCode}.`, err)))
// }
