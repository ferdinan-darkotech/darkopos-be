import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  getEDCMachines, insertEDCMachine, updateEDCMachine, deleteEDCMachine
} from '../../../../controllers/v2/master/finance/ctlEDCMachine'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/financial/edcmachines'
const apiRouter = [
  apiRoute,
  apiRoute + '/:code'
]

// MAIN //
router.get(apiRouter[0], requireAuth, getEDCMachines)
router.post(apiRouter[0], requireAuth, insertEDCMachine)
router.put(apiRouter[1], requireAuth, updateEDCMachine)
router.delete(apiRouter[1], requireAuth, deleteEDCMachine)
// MAIN //

export default router