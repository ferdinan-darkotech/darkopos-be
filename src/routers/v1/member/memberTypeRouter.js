import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getType, getTypes, insertType, updateType, deleteType, deleteTypes }
  from '../../../controllers/member/memberTypeController'

const router = express.Router()

const apiRoute = project.api_prefix + '/members/types'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getType)

router.get(apiRouter[0], requireAuth, getTypes)

router.post(apiRouter[1], requireAuth, insertType)

router.put(apiRouter[1], requireAuth, updateType)

router.delete(apiRouter[1], requireAuth, deleteType)

router.delete(apiRouter[0], requireAuth, deleteTypes)
// MAIN //

export default router