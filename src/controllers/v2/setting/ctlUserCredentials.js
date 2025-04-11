import * as userCred from '../../../services/v2/setting/srvUserCredentials'
import { getSettingByCode } from '../../../services/settingService'
import { ApiError } from '../../../services/v1/errorHandlingService'


export function ctlGetSomeUsers (req, res, next) {
  console.log('Requesting-ctlGetSomeUsers: ' + JSON.stringify(req.query) + ' ...')
  return userCred.srvGetSomeUsers(req.query).then(items => {
    res.xstatus(200).json({
      success: true,
      data: items.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 10,
      total: items.count
    })
  }).catch(err => next(new ApiError(422,`USRCRD-001: Couldn't find list users.`, err)))
}

export function ctlGetPackOfUserAccess (req, res, next) {
  console.log('Requesting-ctlGetPackOfUserAccess: ' + JSON.stringify(req.query) + ' ...')

  if(req.params.type === 'ROLES') {
    return userCred.srvGetAllUserRoles(req.params.user).then(roles => {
      res.xstatus(200).json({
        success: true,
        data: roles
      })
    }).catch(err => next(new ApiError(422,`USRCRD-002: Couldn't find list of user roles.`, err)))
  } else if(req.params.type === 'STORES') {
    return userCred.srvGetAllUserStores(req.params.user).then(stores => {
      res.xstatus(200).json({
        success: true,
        data: stores
      })
    }).catch(err => next(new ApiError(422,`USRCRD-003: Couldn't find list of user stores.`, err)))
  } else {
    res.xstatus(404).json({
      success: true,
      message: 'Parameters is not found.'
    })
  }
}

export function ctlCreateNewUser (req, res, next) {
  console.log('Requesting-ctlCreateNewUser: ' + JSON.stringify(req.query) + ' ...')
  const userLogIn = req.$userAuth

  return userCred.srvCreateNewUser(req.body, userLogIn).then(created => {
    if(created.success) {
      res.xstatus(200).json({
        success: true,
        message: created.message,
        data: created.data
      })
    } else {
      throw created.message
    }
  }).catch(err => next(new ApiError(422,`USRCRD-004: Couldn't create user.`, err)))
}

export function ctlUpdateUserInfo (req, res, next) {
  console.log('Requesting-ctlUpdateUserInfo: ' + JSON.stringify(req.query) + ' ...')
  const userLogIn = req.$userAuth

  return userCred.srvUpdateUserInfo(req.body, { userid: req.params.user }, userLogIn).then(updated => {
    if(updated.success) {
      res.xstatus(200).json({
        success: true,
        message: updated.message
      })
    } else {
      throw updated.message
    }
  }).catch(err => next(new ApiError(422,`USRCRD-005: Couldn't update user informations.`, err)))
}

export function ctlUpdateUserStoreInfo (req, res, next) {
  console.log('Requesting-ctlUpdateUserStoreInfo: ' + JSON.stringify(req.query) + ' ...')
  const userLogIn = req.$userAuth

  return userCred.srvUpdateUserStoreInfo(req.body, { userid: req.params.user }, userLogIn).then(updated => {
    if(updated.success) {
      res.xstatus(200).json({
        success: true,
        message: updated.message
      })
    } else {
      throw updated.message
    }
  }).catch(err => next(new ApiError(422,`USRCRD-006: Couldn't update user store informations.`, err)))
}

export function ctlUpdateUserRolesInfo (req, res, next) {
  console.log('Requesting-ctlUpdateUserRolesInfo: ' + JSON.stringify(req.query) + ' ...')
  const userLogIn = req.$userAuth

  return userCred.srvUpdateUserRolesInfo(req.body, { userid: req.params.user }, userLogIn).then(updated => {
    if(updated.success) {
      res.xstatus(200).json({
        success: true,
        message: updated.message
      })
    } else {
      throw updated.message
    }
  }).catch(err => next(new ApiError(422,`USRCRD-007: Couldn't update user role informations.`, err)))
}

export function ctlResetPasswordUser (req, res, next) {
  console.log('Requesting-ctlResetPasswordUser: ' + JSON.stringify(req.query) + ' ...')
  const userLogIn = req.$userAuth

  return userCred.srvResetPasswordUser(req.params.user, userLogIn).then(updated => {
    if(updated.success) {
      res.xstatus(200).json({
        success: true,
        message: updated.message,
        data: updated.data
      })
    } else {
      throw updated.message
    }
  }).catch(err => next(new ApiError(422,`USRCRD-008: Couldn't reset user password.`, err)))
}