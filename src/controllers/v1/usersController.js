import speakeasy from 'speakeasy'
import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  setUserInfo, getUserByUserId, getUserByUserName, userExists, userRoleExists,
  createUserRole, removeUserRole,
  getUsersData, getUserPermission, getUserRoles, createUser, updateUser,
  deleteUser, deleteUsers, updatePw, getValidRolePermission,
  addUserLoginSuccess, addUserLoginFail,
  editUserLogout, checkUserLogout, getUserLogout, srvResetPasswordGlobal
}
  from '../../services/v1/usersService'
import { getStoreQuery } from '../../services/setting/storeService'
import { getRoleQuery } from '../../services/setting/roleService'
import {
  isValidPassword, generateToken, extractTokenProfile,
  generateTOTP, reGenerateToken
}
  from '../../services/v1/securityService'
import { getIPaddr } from '../../utils/url'
import { generateIDMD5 } from '../../utils/crypt'
import { isEmpty } from '../../utils/check'

// Retrieve list a user
exports.getUser = function (req, res, next) {
  console.log('Requesting-getUser: ' + req.url + ' ...')
  const userid = req.params.id
  return getUserByUserId(userid).then((user) => {
    let userInfo = getUserPermission(user)
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      user: userInfo
    })
  }).catch(err => next(new ApiError(422, `ZUSC-00001: Couldn't find User ${userid}.`, err)))
}

// Retrieve list of users
exports.getUsers = function (req, res, next) {
  console.log('Requesting-getUsers: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getUsersData(other).then((users) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(users)),
      total: users.length
    })
  }).catch(err => next(new ApiError(422, `ZUSC-00002: Couldn't find Users.`, err)))
}

// Create a new user
exports.insertUser = function (req, res, next) {
  console.log('Requesting-insertUser: ' + req.url + ' ...')
  const userid = req.params.id
  const user = req.body
  const userLogIn = req.$userAuth
  userExists(userid).then(exists => {
    if (exists) {
      next(new ApiError(409, `ZUSC-00003: User ${userid} already exists.`))
    } else {
      if (user.password === user.confirm) {
        return createUser(userid, user, userLogIn.userid, next).then((userCreated) => {
          return getUserByUserId(userCreated.userId).then((userGetById) => {
            const userInfo = setUserInfo(userGetById)
            let jsonObj = {
              success: true,
              message: `User ${userInfo.userName} created`,
            }
            if (project.message_detail === 'ON') { Object.assign(jsonObj, { user: userInfo }) }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(422, err + `Couldn't find user ${userid}.`, err)))
        }).catch(err => next(new ApiError(501, `Couldn't create user ${userid}.`, err)))
      } else {
        next(new ApiError(422, `ZUSC-00004: Password does not match the confirm password.`))
      }
    }
  })
}

//Update a User
exports.updateUser = function (req, res, next) {
  console.log('Requesting-updateUser: ' + req.url + ' ...')
  const userid = req.params.id
  let user = req.body
  const userLogIn = req.$userAuth
  userExists(userid).then(exists => {
    if (exists) {
      if (user.oldpassword) {
        return getUserByUserId(userid).then((userById) => {
          // if (isValidPassword(user.oldpassword, userById.hash, userById.salt)) {
          return updatePw(userid, user, userLogIn.userid, next).then((userUpdated) => {
            return getUserByUserId(userid).then((userById) => {
              const userInfo = setUserInfo(userById)
              let jsonObj = {
                success: true,
                message: `User Pw ${userById.userName} updated`,
                icode: `USRU-01`
              }
              if (project.message_detail === 'ON') { Object.assign(jsonObj, { user: userInfo }) }
              res.xstatus(200).json(jsonObj)
            }).catch(err => next(new ApiError(501, `ZUSC-00005: Couldn't update User ${userid}.`, err)))
          }).catch(err => next(new ApiError(500, `ZUSC-00006: Couldn't update user ${userid}.`, err)))
          //} else {
          //  next(new ApiError(422, `ZUSC-00007: Old Password does not match.`))
          //}
        }).catch(err => next(new ApiError(501, `ZUSC-00008: Couldn't update User ${userid}.`, err)))
        //isValidPassword(password, user.hash, user.salt)
      }
      if (user.hasOwnProperty('password') && (user.hasOwnProperty('confirm'))) {
        if (user.password === user.confirm) {
          return updateUser(userid, user, userLogIn.userid, next).then((userUpdated) => {
            return getUserByUserId(userid).then((userById) => {
              const userInfo = setUserInfo(userById)
              let jsonObj = {
                success: true,
                message: `User ${userById.userName} updated`,
                icode: `USRU-02`
              }
              if (project.message_detail === 'ON') { Object.assign(jsonObj, { user: userInfo }) }
              res.xstatus(200).json(jsonObj)
            }).catch(err => next(new ApiError(501, `ZUSC-00009: Couldn't update User ${userid}.`, err)))
          }).catch(err => next(new ApiError(500, `ZUSC-00010: Couldn't update user ${userid}.`, err)))
        }
        else {
          next(new ApiError(422, `ZUSC-00011: Password does not match the confirm password.`))
        }
      } else if (user.hasOwnProperty('totp') || user.hasOwnProperty('userName')) {
        return updateUser(userid, user, userLogIn.userid, next).then((userUpdated) => {
          return getUserByUserId(userid).then((userById) => {
            const userInfo = setUserInfo(userById)
            let jsonObj = {
              success: true,
              message: `User ${userById.userName} updated`,
              icode: `USRU-03`
            }
            if (project.message_detail === 'ON') { Object.assign(jsonObj, { user: userInfo }) }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(501, `ZUSC-00012: Couldn't update User ${userid}.`, err)))
        }).catch(err => next(new ApiError(500, `ZUSC-00013: Couldn't update user ${userid}.`, err)))
      } else {
        next(new ApiError(422, `ZUSC-00014: Nothing to update.`))
      }
    } else {
      next(new ApiError(422, `ZUSC-00015: Couldn't find User ${userid} .`))
    }
  }).catch(err => next(new ApiError(422, `ZUSC-00016: Couldn't find User ${userid} .`, err)))
}

//Delete a User
exports.deleteUser = function (req, res, next) {
  console.log('Requesting-deleteUser: ' + req.url + ' ...')
  let userid = req.params.id
  userExists(userid).then(exists => {
    if (exists) {
      return deleteUser(userid).then((userDeleted) => {
        if (userDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `User ${userid} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { users: userDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZUSC-00017: Couldn't delete User ${userid}.`))
        }
      }).catch(err => next(new ApiError(500, `ZUSC-00018: Couldn't delete User ${userid}.`, err)))
    } else {
      next(new ApiError(422, `ZUSC-00019: User ${userid} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZUSC-00020: User ${userid} not exists.`, err)))
}

//Delete some User
exports.deleteUsers = function (req, res, next) {
  console.log('Requesting-deleteUsers: ' + req.url + ' ...')
  let users = req.body;
  deleteUsers(users).then((userDeleted) => {
    if (userDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Users [ ${users.userId} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { users: userDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `ZUSC-00021: Couldn't delete Users [ ${users.userId} ].`))
    }
  }).catch(err => next(new ApiError(501, `ZUSC-00022: Couldn't delete Users [ ${users.userId} ].`, err)))
}

// Login - byId or byName
exports.login = function (req, res, next) {
  console.log('Requesting-login: ' + req.body.hasOwnProperty('userrole') + ' ...');
  preloginById(req, res, next)
  //   (project.auth_by === 'id') ? loginById(req, res, next) : loginByName(req, res, next)
}

// Login byId
function loginById (req, res, next, defrole) {
  console.log('Requesting-loginById: ' + req.url + ' ...')
}
// Login byName
// function loginByName (req, res, next) {
//   console.log('Requesting-loginByName: ' + req.url + ' ...')
//   const { username, password } = req.body
//   if (username.length > 0) {
//     getUserByUserName(username).then((user) => {
//       if (isValidPassword(password, user.hash, user.salt)) {
//         const now = new Date()
//         now.setDate(now.getDate() + 1)
//         const profile = { userid: user.userId, username: user.userName, role: user.userRole, deadline: now.getTime() }
//         console.log('userid', user.userId)
//         // res.cookie('token', JSON.stringify({ id: user.userId, deadline: now.getTime() }), {
//         //   maxAge: 120000,
//         //   httpOnly: true,
//         // })
//         res.cookie('token', `${generateToken(profile)}`, {
//           maxAge: 120000, httpOnly: true,
//         })
//         res.json({ success: true, message: 'Ok', id_token: `${generateToken(profile)}` })
//       } else {
//         res.xstatus(401).json({ message: '401-Invalid user/password' })
//       }
//     }).catch(err => next(new ApiError(422, `ZUSC-00024: Couldn't find username ${username}.`, err)))
//   } else {
//     res.xstatus(400).end()
//   }
// }

// Login short time
exports.loginShortTime = function (req, res, next) {
  console.log('Requesting-loginShort: ' + req.body.hasOwnProperty('userrole') + ' ...');

  const xApiKey = req.headers['x-api-key']
  if (isEmpty(xApiKey)) {
    next(new ApiError(422, `ZUST-99999: Invalid Client.`))
  } else {
    if (!project.api_key.includes(xApiKey)) {
      next(new ApiError(422, `ZUST-99998: Invalid Client.`))
    }
  }

  const profile = {
    userid: 'temp',
    userlogintime: new Date(),
    useripaddr1: '',//ipAddr,
    useripaddr2: getIPaddr(req),
    sessionid: generateIDMD5(),
  }
  res.xstatus(200).json({
    success: true,
    message: `User ${profile.userid} logged in`,
    profile: profile,
    id_token: `${generateToken(profile, true, 60)}`
  })
}

// Logout
exports.logout = function (req, res, next) {
  console.log('Requesting-logout: ' + req.url + ' ...')
  // const jwtToken = req.$userAuth
  try {
    // var profile = jwt.verify(jwtToken, project.auth_secret)
    let profile = req.$userAuth
    return checkUserLogout(profile.userid, profile.sessionid).then((isNoLogout) => {
      if (isNoLogout.counter > 0) {
        return editUserLogout(profile.userid, profile.sessionid).then((logoutInfo) => {
          if (logoutInfo[1]) {
            return getUserLogout(profile.userid, profile.sessionid).then((logoutSession) => {
              if (logoutSession) {
                profile = {
                  username: profile.username,
                  useripaddr1: profile.useripaddr1,
                  useripaddr2: profile.useripaddr2,
                  userlogintime: profile.userlogintime,
                  userlogouttime: profile.userlogouttime,
                  sessionid: profile.sessionid
                }
                res.xstatus(200).json({
                  success: true,
                  message: `User ${profile.username} logged out`,
                  profile
                })
              }

            }).catch(err => next(new ApiError(422, `ZUSC-00037: Couldn't find session for userid ${profile.userid}.`, err)))
          }
        }).catch(err => next(new ApiError(422, `ZUSC-00037: Couldn't find session for userid ${profile.userid}.`, err)))
      } else {
        next(new ApiError(422, `ZUSC-00038: Couldn't find session for userid ${profile.userid}.`))
      }
    }).catch(err => next(new ApiError(422, `ZUSC-00036: Couldn't find session for userid ${profile.userid}.`, err)))


    // res.xstatus(200).json({ success: true, message: `User ${profile.username} logged out` })
  } catch (err) {
    res.xstatus(500).json({ message: 'Invalid jwt token' })
  }
}

function loginValid (req, res, next, userid, profile) {
  // checkSessionActive
  return addUserLoginSuccess(userid, profile).then((loginInfo) => {
    console.log('loginInfo', loginInfo[1])
    if (loginInfo[1]) {
      res.xstatus(200).json({
        success: true,
        message: `User ${profile.username} logged in`,
        profile: profile,
        id_token: `${generateToken(profile)}`
      })
    }
  })
}
function loginFail (req, res, next, responseCode, userid, profile, verified, message, detail) {
  return addUserLoginFail(userid, profile, message).then((loginInfo) => {
    console.log('loginInfo', loginInfo[1])
    if (loginInfo[1]) {
      profile = { userid: profile.userid, role: null, istotp: profile.istotp, verified: verified }
      res.xstatus(responseCode).json({
        success: false,
        message: message,
        profile: profile,
        tempken: verified ? `${generateToken(profile, true)}` : '',
        detail: 'Login-' + detail
      })
    }
  })
}
function validateLogin (req, res, next, userid, userrole, ipaddr, user, profile, verified) {
  if (user.defaultRole) {
    loginValid(req, res, next, userid, profile)
  } else {
    if (!userrole) {
      profile.userlogintime = null
      loginFail(req, res, next, 200, userid, profile, verified, 'Choose a valid role', 406)
    } else {
      return getValidRolePermission(userid, userrole).then((roleInfo) => {
        if (roleInfo) {
          // profile = setUserProfile(req, userid, user.userName, user.companyName, ipaddr,
          //   userrole, user.defaultStore, roleInfo.rolePermission)
          profile = setUserProfile(req, userid, user.userName, user.companyName, ipaddr,
            userrole, user.defaultStore, roleInfo.rolePermission, (user.totp ? true : false), user.resetPasword)
          loginValid(req, res, next, userid, profile)
        }
        else {
          profile = {}
          loginFail(req, res, next, 200, userid, profile, verified, 'Choose a valid role', 406)
        }
      })
    }
  }
}

function preloginById (req, res, next) {
  console.log('Requesting-fpreloginById: ' + req.url + ' ...')

  const xApiKey = req.headers['x-api-key']
  if (isEmpty(xApiKey)) {
    return next(new ApiError(422, `ZUSC-99999: Invalid Client.`))
  } else {
    const arrApiKey = project.api_key.replace(/(\[|\])/g,"").split(",")
    if (!arrApiKey.includes(xApiKey)) {
      return next(new ApiError(422, `ZUSC-99998: Invalid Client.`))
    }
  }
  console.log('pass-x-api-key: ...')
  let profile = {}
  const { userid, password, verification, ipaddr, userrole } = req.body
  if (userid.length > 0) {
    return getUserByUserId(userid).then((user) => {
      profile = setUserProfile(req, userid, user.userName, user.companyName, ipaddr,
        userrole, user.defaultStore, '', '', user.resetPassword)
      if (!user.active) {
        loginFail(req, res, next, 200, userid, profile, false, 'User ' + userid + ' Non-active cannot login', 401)
        // res.xstatus(401).json({message: '401-User Non-active cannot login'})
      } else {
        if (isValidPassword(password, user.hash, user.salt)) {
          profile = setUserProfile(req, userid, user.userName, user.companyName, ipaddr,
            user.defaultRole, user.defaultStore, '', (user.totp ? true : false), user.resetPassword)
          // profile = {
          //   userid: userid, username: user.userName, usercompany: user.companyName,
          //   userlogintime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
          //   role: user.defaultRole,
          //   store: user.defaultStore,
          //   istotp: (user.totp ? true : false) }
          if (user.totp) {
            if (verification) {
              const verified = speakeasy.totp.verify({
                secret: user.totp,
                encoding: 'base32',
                token: req.body.verification,
                // window: 2
              })
              if (verified) {
                validateLogin(req, res, next, userid, userrole, ipaddr, user, profile, verified)
              } else {
                loginFail(req, res, next, 200, userid, profile, false, 'Invalid token - verification failed', 401)
              }
            } else {
              loginFail(req, res, next, 200, userid, profile, false, 'Input Verification Code', 406)
            }
          } else {
            validateLogin(req, res, next, userid, userrole, ipaddr, user, profile, true)
          }
        } else {
          res.xstatus(401).json({ message: '401-Invalid user/password' })
        }
      }

    }).catch(err => next(new ApiError(422, `ZUSC-00025: Couldn't find userid ${userid}.`, err)))
  } else {
    res.xstatus(400).end()
  }
}

// Pre-Login byId
exports.preloginById = function (req, res, next) {
  console.log('Requesting-preloginById: ' + req.url + ' ...')
  preloginById(req, res, next)
}

// Retrieve user roles
exports.getUserRoles = function (req, res, next) {
  console.log('Requesting-getUserRoles: ' + req.url + ' ...')
  let { ...other } = req.query
  const userid = req.params.id
  return getUserByUserId(userid).then((user) => {
    return getUserRoles(userid, other).then((userInfo) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        data: userInfo
      })
    })
  }).catch(err => next(new ApiError(422, `ZUSC-00026: Couldn't find User Role for ${userid}.`, err)))
}

function insertUserRoles (userId, userRole, createdBy, next) {
  return createUserRole(userId, userRole, createdBy, next).then((userRoleCreated) => {
    let jsonObjIn = {
      success: true,
      message: `User role ${userRoleCreated.map(a => a.userId)} - ${userRoleCreated.map(a => a.userRole)} created`,
    }
    if (project.message_detail === 'ON') {
      let dataRoleInfo = []
      for (let index of userRoleCreated) {
        const picked = (({ userId, userRole }) => ({ userId, userRole }))(index)
        dataRoleInfo.push(picked)
      }
      Object.assign(jsonObjIn, { data: dataRoleInfo })
    }
    // res.xstatus(200).json(jsonObjIn)
    return jsonObjIn
  }).catch(err => next(new ApiError(501, `ZUSC-00027: Couldn't create User Role ${userId} - ${userRole}.`, err)))
}

function deleteUserRoles (userId, userRole, createdBy, next) {
  return removeUserRole(userId, userRole, createdBy, next).then((userRoleRemove) => {
    let jsonObjOut = {
      success: (userRoleRemove >= 1),
      message: `User role ${userId} - ${userRole} ` + ((userRoleRemove >= 1) ? `removed` : `not exists`),
    }
    const userRoleInfo = { userId: userId, userRole: userRole, }
    if (project.message_detail === 'ON') { Object.assign(jsonObjOut, { data: userRoleInfo }) }
    return jsonObjOut


  }).catch(err => next(new ApiError(501, `ZUSC-00028: Couldn't create User Role ${userId} - ${userRole}.`, err)))
}

// Save user roles
exports.saveUserRoles = function (req, res, next) {
  console.log('Requesting-saveUserRoles: ' + req.url + ' ...')
  const userid = req.params.id
  const userLogIn = req.$userAuth
  let promiseIn, promiseOut
  if (req.body.hasOwnProperty('in') && req.body.hasOwnProperty('out')) {
    if (req.body.in.length > 0) {
      promiseIn = insertUserRoles(userid, req.body.in, userLogIn.userid, next)
      // } else {
      //   next(new ApiError(422, `Couldn't proceed create User Role because incomplete request for ${userid}.`))
    }
    if (req.body.out.length > 0) {
      promiseOut = deleteUserRoles(userid, req.body.out, userLogIn.userid, next)
      // } else {
      //   next(new ApiError(422, `Couldn't proceed delete User Role because incomplete request for ${userid}.`))
    }

    Promise.all([promiseIn, promiseOut]).then((values) => {
      res.xstatus(200).json({ in: values[0], out: values[1] })
    });
  }
}

// Retrieve user role permission
exports.getUserPermissions = function (req, res, next) {
  console.log('Requesting-getUserPermissions: ' + req.url + ' ...')
  const userid = req.params.id
  const rolecode = req.params.role
  getValidRolePermission(userid, rolecode).then(async (roleInfo) => {
    const newToken = await reGenerateToken(req, { role: rolecode })
    const userInfo = {
      permissions: { visit: roleInfo.rolePermission.split(','), role: rolecode },
      username: roleInfo.userName, userid: userid, totp: roleInfo.isTotp
    }
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      id_token: newToken,
      user: userInfo
    })
  }).catch(err => next(new ApiError(422, `ZUSC-00029: Couldn't find User Permission for ${userid} - ${rolecode}.`, err)))
}

// Generate TOTP
exports.getTOTP = function (req, res, next) {
  console.log('Requesting-getTOTP: ' + req.url + ' ...')
  const userid = req.params.id
  const mode = req.params.mode
  getUserByUserId(userid).then((user) => {
    if (mode === 'generate') {
      return generateTOTP(userid, user.totp, 'generate').then((result) => {
        res.xstatus(200).json({
          success: true,
          message: 'totp',
          key: result[0],
          otpURL: result[1],
          isTOTP: result[2] ? true : false
        })
      })
    }
    if (user) {
      return generateTOTP(userid, user.totp).then((result) => {
        res.xstatus(200).json({
          success: true,
          message: 'totp',
          key: result[0],
          otpURL: result[1],
          isTOTP: result[2] ? true : false
        })
      })
    } else {
      console.log('null')
    }
  })
}

exports.getUserStores = function (req, res, next) {
  console.log('Requesting-getUserStores: ' + req.url + ' ...')
  getStoreQuery({ userId: req.params.id }, 'userstores' + (req.query.mode || 'tree'))
    .then((store) => {
      if (req.query.mode === 'lov') {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          icode: 'STR1-01',
          data: store
        })
      } else {
        if (store && store.length > 0) {
          res.xstatus(200).json({
            success: true,
            message: 'Ok',
            icode: 'STR1-02',
            userStore: store[0].userstore,
            defaultStore: store[0].defaultstorename
          })
        } else {
          res.xstatus(422).json({
            success: false,
            message: 'Cannot find data',
            userStore: '',
            defaultStore: ''
          })
        }

      }

    }).catch(err => next(new ApiError(422, `ZUSC-00030: Couldn't find Store for user ${req.params.id}.`, err)))
}

exports.saveUserDefaultStore = function (req, res, next) {
  console.log('Requesting-updateUserDefaultStore: ' + req.url + ' ...')
  let query, mode
  if (req.body.hasOwnProperty('store')) {
    query = { userId: req.params.id, store: req.body.store, defaultStore: req.body.defaultStore }
    mode = 'saveuserstore'
  } else if (req.body.hasOwnProperty('defaultStore')) {
    query = { userId: req.params.id, defaultStore: req.body.defaultStore }
    mode = 'updatedefaultstore'
  }

  getStoreQuery(query, mode).then((store) => {
    const response = store.length + ' times, last info: ' + (store[1] || {}).info
    if ((store[1] || {}).changedRows === 1) {
      getStoreQuery(query, 'defaultstore').then((result) => {
        res.xstatus(200).json({
          success: true,
          message: `Info for ${req.params.id}: default store ${result[0].defaultStoreName} saved`,
          defaultStore: result[0].defaultStoreName
        })
      }).catch(err => next(new ApiError(422, `ZUSC-00031: Couldn't find default store for ${req.params.id}.`, err)))
    } else {
      if (mode === 'saveuserstore') {
        getStoreQuery(query, 'userstoresaved').then((storeSaved) => {
          if (storeSaved.length > 0) {
            console.log('storeSaved', storeSaved.map(a => a.lvl2Name))
            res.xstatus(200).json({
              success: true,
              message: `Info for ${req.params.id}: ${storeSaved.map(a => a.lvl2Name)} saved`,
            })
          } else {
            res.xstatus(200).json({
              success: false,
              message: `Info for ${req.params.id}: ${response}`,
            })
          }
        }).catch(err => next(new ApiError(422, `ZUSC-00033: Couldn't find user store saved for ${req.params.id}.`, err)))
      } else {
        res.xstatus(200).json({
          success: false,
          message: `Info for ${req.params.id}: ${response}`,
        })
      }
    }

  }).catch(err => next(new ApiError(422, `ZUSC-00032: Couldn't update default store for ${req.params.id}.`, err)))
}


exports.saveUserDefaultRole = function (req, res, next) {
  console.log('Requesting-updateUserDefaultRole: ' + req.url + ' ...')
  let query, mode
  if (req.body.hasOwnProperty('defaultRole')) {
    query = { userId: req.params.id, defaultRole: req.body.defaultRole }
    mode = 'updatedefaultrole'
  }
  getRoleQuery(query, mode, next).then((role) => {
    const response = role.length + ' times, last info: ' + (role[1] || {}).info
    
    // if ((role[1] || {}).changedRows === 1) {
      if (mode === 'updatedefaultrole') {
        return getRoleQuery(query, 'defaultrole', next).then((result) => {
          res.xstatus(200).json({
            success: true,
            message: `Info for ${req.params.id}: default role ${result[0].defaultRoleName} saved`,
            defaultRole: result[0].defaultRoleName
          })
        }).catch(err => next(new ApiError(422, `ZUSC-00035: Couldn't find default role for ${req.params.id}.`, err)))
      }
    // }
  }).catch(err => next(new ApiError(422, `ZUSC-00034: Couldn't update default role for ${req.params.id}.`, err)))
}

const setUserProfile = (req, userId, userName, userCompanyName, ipAddr, userRole, userDefStore, rolePermission, istotp, resetPassword) => {
  const profile = {
    userid: userId,
    username: userName,
    usercompany: userCompanyName,
    userlogintime: new Date(), //new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
    useripaddr1: ipAddr,
    useripaddr2: getIPaddr(req),
    role: userRole,
    resetpsw: resetPassword,
    store: userDefStore,
    permission: rolePermission,
    istotp: istotp,
    sessionid: generateIDMD5()
  }
  return profile
}

exports.resetPasswordGlobal = function (req, res, next) {
  console.log('Requesting-resetPasswordGlobal: ' + req.url + ' ...')
  const userLogIn = req.$userAuth
  srvResetPasswordGlobal(req.body, userLogIn.userid, next).then((user) => {
    console.log('zzz1', user)
    let jsonObj = {
      success: true,
      message: `Info : ${user[0]} password has been reset`,
    }
    res.xstatus(200).json(jsonObj)
  }).catch(err => next(new ApiError(501, `Some password cannot been reset`, err)))
}
