import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getDataId, getData, updateData, insertData, deleteData, deleteSomeData }
  from '../../../controllers/log/logReportController'

const router = express.Router()

const apiRoute = project.api_prefix + '/log/report'
const apiRoute2 = project.api_prefix + '/log/delete'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute2
]

// MAIN //
router.get(apiRouter[1], requireAuth, getDataId)

router.get(apiRouter[0], requireAuth, getData)

router.post(apiRouter[0], requireAuth, insertData)

router.put(apiRouter[1], requireAuth, updateData)

router.delete(apiRouter[1], requireAuth, deleteData)

router.delete(apiRouter[2], requireAuth, deleteSomeData)
// MAIN //

export default router