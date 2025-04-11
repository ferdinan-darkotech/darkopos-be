import express from 'express'
import { requireAuth } from '../../../services/v1/usersService'
import project from '../../../../config/project.config'
import { ctlGetFormSPK, ctlUpdateDuplicateSPK } from '../../../controllers/v2/transaction/ctlSpkForm'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/spk-form'
const apiRouter = [
  apiRoute
]

router.get(apiRouter[0], requireAuth, ctlGetFormSPK)
router.post(apiRouter[0], requireAuth, ctlUpdateDuplicateSPK)

export default router
