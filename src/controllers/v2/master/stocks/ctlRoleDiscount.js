import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import {
  srvGetRolesDiscount, srvModifierRolesDiscount, srvModifierRolesDiscountByImport,
  srvGetLogRolesDiscount
} from '../../../../services/v2/master/stocks/srvRoleDiscount'
import { srvGetStoreByCode } from '../../../../services/setting/storeService'
import { extractTokenProfile } from '../../../../services/v1/securityService'

export function ctlGetLogRolesDiscount (req, res, next) {
  console.log('Requesting-ctlGetLogRolesDiscount: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  return srvGetStoreByCode(req.params.store).then(store => {
    let tmpStore = (JSON.parse(JSON.stringify(store)) || {})
    if(!tmpStore.ho_id) throw new Error('Store not found ...')
    return srvGetLogRolesDiscount(tmpStore.ho_id, req.query).then(rld => {
      res.xstatus(200).json({
        success: true,
        data: rld,
        total: rld.length
      })
    }).catch(err => next(new ApiError(422, `ZSRLD-00000: Couldn't find log roles discount`, err)))
  }).catch(err => next(new ApiError(422, `ZSRLD-000000: Couldn't find log roles discount`, err)))
}

export function ctlGetRolesDiscount (req, res, next) {
  console.log('Requesting-ctlGetRolesDiscount: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  return srvGetStoreByCode(req.query.store).then(store => {
    let tmpStore = (JSON.parse(JSON.stringify(store)) || {})
    if(!tmpStore.ho_id) throw new Error('Store not found ...')
    req.query.storeid = tmpStore.ho_id
    return srvGetRolesDiscount(req.query).then(rld => {
      res.xstatus(200).json({
        success: true,
        data: rld.rows,
        page: +req.query.page || 1,
        pageSize: +req.query.pageSize || 10,
        total: rld.count
      })
    }).catch(err => next(new ApiError(422, `ZSRLD-00001: Couldn't find roles discount`, err)))
  }).catch(err => next(new ApiError(422, `ZSRLD-00001: Couldn't find roles discount`, err)))
}

export function ctlModifierRolesDiscount (req, res, next) {
  console.log('Requesting-ctlModifierRolesDiscount: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  const userLogin = extractTokenProfile(req)

  if(req.params.type === 'manual') {
    return srvModifierRolesDiscount(req.body, userLogin.userid).then(modifier => {
      if(modifier.success) {
        res.xstatus(200).json({
          success: true,
          data: modifier.data,
          message: modifier.message
        })
      } else {
        throw new Error (modifier.message)
      }
    }).catch(err => next(new ApiError(422, `ZSRLD-00004: Couldn't create roles discount`, err)))
  } else if(req.params.type === 'import') {
    return srvModifierRolesDiscountByImport(req.body, userLogin.userid).then(modifier => {
      if(modifier.success) {
        res.xstatus(200).json({
          success: true,
          data: modifier.data,
          message: modifier.message
        })
      } else {
        throw new Error (modifier.message)
      }
    }).catch(err => next(new ApiError(422, `ZSRLD-00004: Couldn't create roles discount`, err)))
  } else {
    next(new ApiError(422, `ZSRLD-00003: Couldn't create roles discount`, 'Type is not defined.'))
  }
}