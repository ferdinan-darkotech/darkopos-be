import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getDataId, getData, updateData, insertData, deleteData, ctlGetLastFieldsChecked }
  from '../../../../controllers/service/workOrder/woDetailController'

const router = express.Router()

const apiRoute = project.api_prefix + '/wo/detail'
const apiRouteLastChecked = project.api_prefix_v2 + '/wo/detail/history'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',

  apiRouteLastChecked + '/:type'
]

// MAIN //
router.get(apiRouter[2], requireAuth, ctlGetLastFieldsChecked)


router.get(apiRouter[1], requireAuth, getDataId)

router.get(apiRouter[0], requireAuth, getData)

router.post(apiRouter[0], requireAuth, insertData)

router.put(apiRouter[1], requireAuth, updateData)

router.delete(apiRouter[1], requireAuth, deleteData)
// MAIN //

export default router