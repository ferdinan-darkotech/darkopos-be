import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { addMobileMember, selectMobileMember, activateMobileMember,
  addMobileMemberAsset, selectMobileMemberAsset, getMemberStatus
  } from '../../../controllers/mobile/membersController'

const router = express.Router()

const apiRoute = project.api_prefix + '/mobile/members'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/:id/assets',
  apiRoute + '/:id/assets/:no',
  apiRoute + '/:id/status',
]

// MAIN //

router.get(apiRouter[1], requireAuth, selectMobileMember)

router.put(apiRouter[1], requireAuth, activateMobileMember)
router.get(apiRouter[4], requireAuth, getMemberStatus)
router.post(apiRouter[1], requireAuth, addMobileMember)

// MAIN //

// ASSET //
router.post(apiRouter[3], requireAuth, addMobileMemberAsset)
router.get(apiRouter[2], requireAuth, selectMobileMemberAsset)
// ASSET //

export default router