import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getSequenceFormat, increaseSequence, insertSequence, updateSequence }
  from '../../controllers/sequenceController'

const router = express.Router()

const apiRoute = project.api_prefix + '/sequence'
const apiRouter = [
  apiRoute,
  apiRoute + '/increase',
  apiRoute + '/:id',
]

// MAIN //
router.get(apiRouter[0], requireAuth, getSequenceFormat)
router.put(apiRouter[1], requireAuth, increaseSequence)
//update sequence
router.put(apiRouter[0], requireAuth, updateSequence)
// insert a sequence
router.post(apiRouter[2], requireAuth, insertSequence)
// MAIN //

export default router