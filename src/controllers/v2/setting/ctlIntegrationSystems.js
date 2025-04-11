import {
  srvGetAllIntegrationSystems, srvGetOneIntegrationSystems, srvGetSomeIntegrationSystems
} from '../../../services/v2/setting/srvIntegrationSystems'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'

export function ctlGetAllIntegrationSystems (req, res, next) {
  console.log('Requesting-ctlGetAllIntegrationSystems: ' + JSON.stringify(req.query) + ' ...')
  return srvGetAllIntegrationSystems(req.query).then(integration => {
    res.xstatus(200).json({
      success: true,
      data: integration.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: integration.count
    })
  }).catch(err => next(new ApiError(422, `ZCINTSYS-00001: Couldn't find config.`, err)))
}

export function ctlGetSomeIntegrationSystems (req, res, next) {
  console.log('Requesting-ctlGetSomeIntegrationSystems: ' + JSON.stringify(req.query) + ' ...')
  return srvGetSomeIntegrationSystems(req.params.code).then(integration => {
    res.xstatus(200).json({
      success: true,
      data: integration,
      total: integration.length
    })
  }).catch(err => next(new ApiError(422, `ZCINTSYS-00002: Couldn't find config.`, err)))
}

export function ctlGetOneIntegrationSystems (req, res, next) {
  console.log('Requesting-ctlGetOneIntegrationSystems: ' + JSON.stringify(req.query) + ' ...')
  return srvGetOneIntegrationSystems(req.params.code, req.params.key).then(integration => {
    res.xstatus(200).json({
      success: true,
      data: integration
    })
  }).catch(err => next(new ApiError(422, `ZCINTSYS-00003: Couldn't find config.`, err)))
}