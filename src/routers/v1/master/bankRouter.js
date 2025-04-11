import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getBankById, getBankData, insertBank, updateBank, deleteBank }
  from '../../../controllers/master/bankController'

const router = express.Router()

const apiRoute = project.api_prefix + '/bank'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/delete' + '/:id',
]

// MAIN //
router.get(apiRouter[1], requireAuth, getBankById)

router.get(apiRouter[0], requireAuth, getBankData)

router.post(apiRouter[0], requireAuth, insertBank)

router.put(apiRouter[1], requireAuth, updateBank)

router.put(apiRouter[2], requireAuth, deleteBank)
// MAIN //

export default router