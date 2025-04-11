import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  ctlCreateCustomerRewards, ctlGetOneCustRewardsById,
  ctlGetSomeCustRewards, ctlUpdateCustomerRewards,
  ctlGetAllCustRewardsProdByRewardId, ctlPackCustomerRewards,
  ctlGetAllCustRewardsServByRewardId
} from '../../../../controllers/v2/master/SetupCustomerCoupon/ctlCustomerRewards'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/customer-rewards'
const apiRoutes = [
  `${apiRoute}/reward`,
  `${apiRoute}/reward` + '/:reward_id',
  `${apiRoute}/reward` + '/:reward_id/product',
  `${apiRoute}/reward` + '/:reward_id/service',

  `${apiRoute}/type` + '/:store/:member_type'
]

// get all data store
router.get(apiRoutes[0], requireAuth, ctlGetSomeCustRewards)
router.get(apiRoutes[1], requireAuth, ctlGetOneCustRewardsById)
router.get(apiRoutes[2], requireAuth, ctlGetAllCustRewardsProdByRewardId)
router.get(apiRoutes[3], requireAuth, ctlGetAllCustRewardsServByRewardId)
router.post(apiRoutes[0], requireAuth, ctlCreateCustomerRewards)
router.put(apiRoutes[1], requireAuth, ctlUpdateCustomerRewards)

router.get(apiRoutes[4], requireAuth, ctlPackCustomerRewards)

export default router