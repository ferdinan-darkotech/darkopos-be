/**
 * Created by panda . has . my . id on 4/17/17.
 */
import express from 'express'
import { requireLogin, requireAuth } from '../../services/v1/usersService'
import { getUser, getUsers, getUserRoles, getUserPermissions, saveUserRoles,
  getUserStores, saveUserDefaultStore, saveUserDefaultRole,
  insertUser, updateUser, deleteUser, deleteUsers, getTOTP, verifyTOTP,
  preloginById, login, logout, loginShortTime, resetPasswordGlobal } from '../../controllers/v1/usersController'
import project from '../../../config/project.config'

const router = express.Router()

const apiRoute = project.api_prefix + '/users'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/login',
  apiRoute + '/logout',
  apiRoute + '/prelogin',
  apiRoute + '/:id/roles',
  apiRoute + '/:id/roles/:role',
  apiRoute + '/:id/totp',
  apiRoute + '/:id/totp/:mode',
  apiRoute + '/:id/stores',
  apiRoute + '/login/temp',
  apiRoute + '/global/rpw'
]

// Login
router.post(apiRouter[2], requireLogin, login)

// router.post(apiRouter[4], requireLogin, preloginById)

// router.post(apiRouter[7], requireLogin, verifyTOTP)

// Logout
router.post(apiRouter[3], requireAuth, logout)

router.get(apiRouter[1], requireAuth, getUser)

router.get(apiRouter[0], requireAuth, getUsers)

router.get(apiRouter[5], requireAuth, getUserRoles)

router.post(apiRouter[5], requireAuth, saveUserRoles)

router.put(apiRouter[5], requireAuth, saveUserDefaultRole)

router.get(apiRouter[6], requireAuth, getUserPermissions)

router.post(apiRouter[1], requireAuth, insertUser)

router.put(apiRouter[1], requireAuth, updateUser)

router.delete(apiRouter[1], requireAuth, deleteUser)

router.delete(apiRouter[0], requireAuth, deleteUsers)

router.get(apiRouter[7], requireAuth, getTOTP)

router.get(apiRouter[8], requireAuth, getTOTP)

router.get(apiRouter[9], requireAuth, getUserStores)

router.put(apiRouter[9], requireAuth, saveUserDefaultStore)

router.post(apiRouter[10], loginShortTime)

router.put(apiRouter[11], requireAuth, resetPasswordGlobal)

export default router;
