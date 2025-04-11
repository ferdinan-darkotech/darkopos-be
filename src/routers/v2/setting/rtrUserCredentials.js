import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import * as userCred from '../../../controllers/v2/setting/ctlUserCredentials'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/user/credentials'

const routes = [
  apiRoute,
  apiRoute + '/main/:user',
  apiRoute + '/store/:user',
  apiRoute + '/roles/:user',
  apiRoute + '/reset-psw/:user',
  apiRoute + '/main/:user/:type',
]


router.get(routes[0], requireAuth, userCred.ctlGetSomeUsers)
router.post(routes[0], requireAuth, userCred.ctlCreateNewUser)
router.put(routes[1], requireAuth, userCred.ctlUpdateUserInfo)
router.put(routes[2], requireAuth, userCred.ctlUpdateUserStoreInfo)
router.put(routes[3], requireAuth, userCred.ctlUpdateUserRolesInfo)
router.post(routes[4], requireAuth, userCred.ctlResetPasswordUser)
router.get(routes[5], requireAuth, userCred.ctlGetPackOfUserAccess)


export default router