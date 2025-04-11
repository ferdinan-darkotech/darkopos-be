import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  ctlCreateCustomerAchievements, ctlGetOneCustAchievementsById,
  ctlGetSomeCustAchievements, ctlUpdateCustomerAchievements,
  ctlGetAllCustAchievementsProdByAchieveId, ctlPackCustomerAchievements,
  ctlGetAllCustAchievementsServByAchieveId
} from '../../../../controllers/v2/master/SetupCustomerCoupon/ctlCustomerAchievements'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customer-achievements'
const apiRoutes = [
  `${apiRoute}/achieve`,
  `${apiRoute}` + '/achieve/:achieve_id',
  `${apiRoute}` + '/achieve/:achieve_id/product',
  `${apiRoute}` + '/achieve/:achieve_id/service',

  `${apiRoute}/type` + '/:store/:member_type'
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlGetSomeCustAchievements)
router.get(apiRoutes[1], requireAuth, ctlGetOneCustAchievementsById)
router.get(apiRoutes[2], requireAuth, ctlGetAllCustAchievementsProdByAchieveId)
router.get(apiRoutes[3], requireAuth, ctlGetAllCustAchievementsServByAchieveId)
router.post(apiRoutes[0], requireAuth, ctlCreateCustomerAchievements)
router.put(apiRoutes[1], requireAuth, ctlUpdateCustomerAchievements)

router.get(apiRoutes[4], requireAuth, ctlPackCustomerAchievements)


export default router