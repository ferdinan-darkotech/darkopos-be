// [MASTER PRODUCT GROUP]: FERDINAN - 16/06/2025
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getGroup, getGroups,
  insertGroup, updateGroup, deleteGroup, deleteGroups,
  getGroupProducts
} from '../../../controllers/stockGroupController'

const router = express.Router()

const apiRoute = project.api_prefix + '/stocks/groups'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/:id/products'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getGroup)

router.get(apiRouter[0], requireAuth, getGroups)

router.post(apiRouter[1], requireAuth, insertGroup)

router.put(apiRouter[1], requireAuth, updateGroup)

router.delete(apiRouter[1], requireAuth, deleteGroup)

router.delete(apiRouter[0], requireAuth, deleteGroups)
// MAIN //

// OTHER //
router.get(apiRouter[2], requireAuth, getGroupProducts)
// OTHER //

export default router