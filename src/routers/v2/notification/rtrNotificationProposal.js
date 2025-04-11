import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getNotificationProposalsGeneral, getNotificationProposalsFilter, getNotificationProposalById,
  insertNotificationProposal, updateNotificationProposal, deleteNotificationProposal,
  getNotificationProposalByStoreKey }
  from '../../../controllers/v2/notification/ctlNotificationProposal'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/notification/proposals'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/:id',
  apiRoute + '/store/:storeId/key/:key',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getNotificationProposalsGeneral)
router.get(apiRouter[1], requireAuth, getNotificationProposalsFilter)
router.get(apiRouter[2], requireAuth, getNotificationProposalById)
router.get(apiRouter[3], requireAuth, getNotificationProposalByStoreKey)
router.post(apiRouter[0], requireAuth, insertNotificationProposal)
router.put(apiRouter[2], requireAuth, updateNotificationProposal)
router.delete(apiRouter[2], requireAuth, deleteNotificationProposal)
// MAIN //

export default router