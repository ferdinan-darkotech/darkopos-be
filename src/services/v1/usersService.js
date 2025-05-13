import passport from 'passport'
import db from '../../models'
import dbv from '../../models/view'
import sequelize from '../../native/sequelize'
import native from '../../native/user/sqlUserLogin'
import { ApiError } from '../../services/v1/errorHandlingService'
import { saltHashPassword } from '../../services/v1/securityService'
import { isEmpty } from '../../utils/check'
import { getNativeQuery } from '../../native/nativeUtils'
import moment from 'moment'

const Op = require('sequelize').Op
let User = db.tbl_user
let UserRole = db.tbl_user_role
let vwUserBrowse = dbv.vw_user_browse
let vwRolePermissions = dbv.vw_role_permission
let vwUserRolePermissions = dbv.vw_user_role_permission

export const requireAuth = passport.authenticate('jwt', { session: false })
export const requireLogin = passport.authenticate('local', { session: false })

const stringSQL = {
  s00001: native.sqlUser,
  s00002: native.sqlRolePermission,
  s00003: native.sqlSaveLoginSuccess,
  s00004: native.sqlSaveLogout,
  s00005: native.sqlSaveLoginFail,
  s00006: native.sqlCheckLogout,
  s00007: native.sqlGetLogout,
  s00008: native.sqlSaveLogoutFail,
}

export function countUserRole (userid, listRole = []) {
  return UserRole.findAll({
    where: { userid, userrole: { [Op.in]: listRole } },
    raw: true
  }).then(rs => {
    return rs.length
  }).catch(err => err)
}

export function getUserByUserId (userid) {
  const sSQL = stringSQL.s00001.replace("_BIND01", userid)
  return getNativeQuery(sSQL, true)
}

export function getUserByUserName (username) {
  return User.findOne({
    where: { username: username }
  })
}

export function getUserByEmail (email) {
  return User.findOne({
    where: { email: email }
  })
}

export function getUsersData (query) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { between: query[key] }
    }
  }
  if (query) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'User Id')
      query = JSON.parse(str)
      return vwUserBrowse.findAll({
        attributes: ['User Id', 'User Name', 'Email', 'Full Name', 'Active', 'Is Employee',
          'User Role', 'Created By', 'Created At', 'Updated By', 'Updated At'
        ],
        order: ['id'],
        where: query
      })
    } else {
      return User.findAll({
        attributes: ['userId', 'userName', 'email', 'fullName', 'active', 'isEmployee',
          /*'userRole', 'userRoleCode', 'hash', 'salt',*/'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
        ],
        order: ['id'],
        where: query
      })
    }

  } else {
    return User.findAll({
      attributes: ['userId', 'userName', 'email', 'fullName', 'active', 'isEmployee',
        'userRole', /*'hash', 'salt',*/'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      order: ['id'],
      where: query
    })
  }
}

export function userExists (userid) {
  return getUserByUserId(userid).then(user => {
    //TypeError: Cannot convert undefined or null to object
    // return !!user
    return user
  })
}

export function userExistsByEmail (email) {
  return getUserByEmail(email).then(user => {
    return !!user
  })
}

export function setUserInfo (request) {
  const getUserInfo = {
    id: request.id,
    userId: request.userId,
    userName: request.userName,
    email: request.email,
    fullName: request.fullName,
    active: request.active,
    isTOTP: (request.isTOTP) ? true : ((request.totp) ? true : false),
    createdAt: request.createdAt,
    createdBy: request.createdBy,
    updatedAt: request.updatedAt,
    updatedBy: request.updatedBy
  }
  return getUserInfo
}

export function createUser (userid, user, createdBy, next) {
  let credentials = saltHashPassword(user.password)
  return User.create({
    userId: userid,
    userName: user.userName,
    email: user.email,
    fullName: user.fullName,
    active: +user.active,
    userRole: user.userRole,
    salt: credentials.salt,
    hash: credentials.hash,
    createdBy: createdBy,
    createdAt: moment(),
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateUser (userid, userData, updatedBy, next) {
  let justTotpToUpdate, fieldsToUpdate
  if (userData.hasOwnProperty('totp')) { justTotpToUpdate = { totp: userData.totp } }
  if (userData.hasOwnProperty('userName')) {
    fieldsToUpdate = {
      userName: userData.userName,
      active: +userData.active,
      userRole: userData.userRole,
      email: userData.email,
      fullName: userData.fullName,
      updatedBy: updatedBy,
      updatedAt: moment()
    }
  }
  if (userData.hasOwnProperty('totp')) {
    return User.update(justTotpToUpdate,
      { where: { userId: userid } }
    ).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const { parent, original, sql, ...other } = errObj
      next(new ApiError(501, other, err))
    })
  } else if (userData.password && userData.confirm) {
    if (userData.password === userData.confirm) {
      let credentials = saltHashPassword(userData.password)
      const fieldsPW = {
        salt: credentials.salt,
        hash: credentials.hash
      }
      if (fieldsToUpdate) {
        Object.assign(fieldsToUpdate, fieldsPW)
      } else {
        fieldsToUpdate = fieldsPW
      }
    }
    return User.update(fieldsToUpdate,
      { where: { userId: userid } }
    ).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const { parent, original, sql, ...other } = errObj
      next(new ApiError(501, other, err))
    })
  } else {
    return User.update(fieldsToUpdate,
      { where: { userId: userid } }
    ).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const { parent, original, sql, ...other } = errObj
      next(new ApiError(501, other, err))
    })
  }
}

export function updatePw (userid, userData, updatedBy, next) {
  const fieldsToUpdate = {}
  if (userData.password && userData.confirm) {
    if (userData.password === userData.confirm) {
      let credentials = saltHashPassword(userData.password)
      const fieldsPW = !userData.hasOwnProperty('flag') ? {
        salt: credentials.salt,
        hash: credentials.hash
      } : {
        salt: credentials.salt,
        hash: credentials.hash,
        resetPassword: userData.flag
      }
      Object.assign(fieldsToUpdate, fieldsPW)
    }
  }
  return User.update(fieldsToUpdate,
    { where: { userId: userid } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteUser (userData) {
  return User.destroy({
    where: {
      userId: userData
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteUsers (users) {
  if (!isEmpty(users)) {
    return User.destroy({
      where: users
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}

export function getUserPermission (user) {
  const userVisit = (user.userPermission) ?
    user.userPermission.split(',')
    : ''
  let userPermission = {}
  if (userVisit !== '') { userPermission.visit = userVisit }
  if (user.userRoleCode) { userPermission.role = user.userRoleCode }

  return {
    permissions: userPermission,
    username: user.userName
    , userid: user.userId
  }
}

export function setMiscAs (request, asKey) {
  const asChange = asKey.split(',')
  // const m = { userRole: asChange[0], roleName: asChange[1] }
  const m = { userRole: asChange[0], userRoleName: asChange[1] }
  const getMiscLov = o => Object.assign(...Object.keys(o).map(k => ({ [m[k] || k]: o[k] })))

  function isDefaultRole (role) { return role.defaultRole === 1 }
  const resultMap = request.map(getMiscLov)
  resultMap.forEach(function (v) { delete v.defaultRole })

  let resultDefaultRole = request.find(isDefaultRole)
  resultDefaultRole = resultDefaultRole ? resultDefaultRole.userRole : ''

  const result = { mapped: resultMap, defaultRole: resultDefaultRole }
  return result
}

export function getUserRoles (userid, query) {
  if (query) {
    if (query.hasOwnProperty('as')) {
      const sSQL = stringSQL.s00002.replace("_BIND01", userid)
      return getNativeQuery(sSQL, false)
        .then(findResult => {
          return setMiscAs(findResult, query.as)
        })
      // return vwRolePermissions.findAll({
      //   attributes: ['userRole','roleName'],
      //   where: { userid: userid },
      //   raw: false
      // }).then(findResult => {
      //   return setMiscAs(findResult, query.as)
      // })
    } else {
      return vwRolePermissions.findAll({
        attributes: ['userRole', 'roleName'],
        where: { userid: userid },
        raw: false
      })
    }
  } else {
    return vwRolePermissions.findAll({
      attributes: ['userRole', 'roleName'],
      where: { userid: userid },
      raw: false
    })
  }

}

export function getValidRolePermission (userid, userrole) {
  return vwUserRolePermissions.findOne({
    attributes: ['userName', 'roleName', 'rolePermission', 'isTotp'],
    where: { userId: userid, roleCode: userrole }
  })
}

export function getUserRole (userid, userrole) {
  return vwUserRolePermissions.findOne({
    where: { userid: userid, roleCode: userrole }
  })
}

export function userRoleExists (userid, userrole) {
  return getUserRole(userid, userrole).then(user => {
    return !!user
  })
}

export function createUserRole (userId, userRole, createdBy, next) {
  let bulkRole = []
  for (let index of userRole) {
    bulkRole.push({
      userId: userId,
      userRole: index,
      createdBy: createdBy,
      createdAt: moment()
    })
  }

  return UserRole.bulkCreate(bulkRole, { ignoreDuplicates: true })
    .then((response) => {
      return response
    })
    .catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const { parent, original, sql, ...other } = errObj
      next(new ApiError(400, other, err))
    })
}

export function removeUserRole (userId, userRole, createdBy, next) {
  return UserRole.destroy({
    where: { userId: userId, [Op.and]: { userRole: { in: userRole } } }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function checkUserLogin (userId, sessionId) {
  const sSQL = stringSQL.s00007.replace("_BIND01", userId).replace("_BIND02", sessionId)
  return getNativeQuery(sSQL, true, 'SELECT')
}

export function addUserLoginSuccess (userId, loginInfo, next) {
  const qChr = '\'', cChr = ', '
  const loginData = qChr + loginInfo.sessionid + qChr + cChr +
    qChr + loginInfo.userid + qChr + cChr +
    qChr + loginInfo.useripaddr1 + qChr + cChr +
    qChr + loginInfo.useripaddr2 + qChr + cChr +
    qChr + loginInfo.role + qChr + cChr +
    loginInfo.store + cChr +
    'now()'
  //"sessionId, userId, ipAddress1, ipAddress2, role, storeId, loginTime, logoutTime)" +
  const sSQL = stringSQL.s00003.replace("_BIND01", loginData)
  return getNativeQuery(sSQL, false, 'INSERT')
}

export function addUserLoginFail (userId, loginInfo, message) {
  const qChr = '\'', cChr = ', '
  const loginData = qChr + loginInfo.sessionid + qChr + cChr +
    qChr + loginInfo.userid + qChr + cChr +
    qChr + (loginInfo.useripaddr1 ? loginInfo.useripaddr1 : null) + qChr + cChr +
    qChr + loginInfo.useripaddr2 + qChr + cChr +
    qChr + (loginInfo.role ? loginInfo.role : null) + qChr + cChr +
    loginInfo.store + cChr +
    'now()' + cChr +
    qChr + message + qChr
  //"sessionId, userId, ipAddress1, ipAddress2, role, storeId, loginTime, logoutTime)" +
  const sSQL = stringSQL.s00005.replace("_BIND01", loginData)
  return getNativeQuery(sSQL, false, 'INSERT')
}

export function editUserLogout (userId, sessionId) {
  const sSQL = stringSQL.s00004.replace("_BIND01", userId).replace("_BIND02", sessionId)
  return getNativeQuery(sSQL, false, 'UPDATE')
}

export function checkUserLogout (userId, sessionId) {
  const sSQL = stringSQL.s00006.replace("_BIND01", userId).replace("_BIND02", sessionId)
  return getNativeQuery(sSQL, true, 'SELECT')
}

export function getUserLogout (userId, sessionId) {
  const sSQL = stringSQL.s00007.replace("_BIND01", userId).replace("_BIND02", sessionId)
  return getNativeQuery(sSQL, true, 'SELECT')
}

export function srvResetPasswordGlobal (data, updatedBy, next) {
  const { password, except } = data
  let credentials = saltHashPassword(password)
  const fieldsPW = {
    salt: credentials.salt,
    hash: credentials.hash,
    updatedBy: updatedBy,
    resetPassword: true
  }
  console.log(password, except)
  return User.update(fieldsPW,
    { where: { userId: { [Op.notIn]: except } } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

