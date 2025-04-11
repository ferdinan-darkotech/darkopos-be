/**
 * Created by panda. has.my .id on 4/17/17.
 */
import express from 'express'
import { requireAuth } from '../../services/v1/usersService'
import { getMiscCodeName, getMiscCode, getMiscs, insertMisc, updateMisc, deleteMisc, deleteMiscs }
  from '../../controllers/miscController'
import project from '../../../config/project.config'

const router = express.Router()

const apiRoute = project.api_prefix + '/misc'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/code/:code',
  apiRoute + '/code/:code/name/:name',
]

// MAIN //
router.get(apiRouter[3], requireAuth, getMiscCodeName)

router.get(apiRouter[2], requireAuth, getMiscCode)

router.get(apiRouter[0], requireAuth, getMiscs)

router.post(apiRouter[3], requireAuth, insertMisc)

router.put(apiRouter[3], requireAuth, updateMisc)

router.delete(apiRouter[3], requireAuth, deleteMisc)

router.delete(apiRouter[0], requireAuth, deleteMiscs)
// MAIN //

// OTHER //
// router.get(apiRouter[2], requireAuth, getMiscByCode)

// OTHER //
export default router;