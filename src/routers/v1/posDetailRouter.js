import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getPosDetail, getAllPosDetail, getAllPosReport, updatePosDetail, deletePosDetail }
  from '../../controllers/posDetailController'

const router = express.Router()

const apiRoute = project.api_prefix + '/posdetail'
const apiRouteReport = project.api_prefix + '/posreport'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRouteReport,
]

// MAIN //
router.get(apiRouter[1], requireAuth, getPosDetail)

router.get(apiRouter[0], requireAuth, getAllPosDetail)

router.get(apiRouter[2], requireAuth, getAllPosReport)

// router.post(apiRouter[1], requireAuth, insertPosDetail)
router.put(apiRouter[1], requireAuth, updatePosDetail)

router.delete(apiRouter[1], requireAuth, deletePosDetail)

// MAIN //

export default router
