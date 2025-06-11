import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getService, getServices, insertService, updateService, deleteService, deleteServices, getServiceByCodeStore }
  from '../../controllers/service/serviceController'
import { getServiceChecks, getServiceChecksUsage }
  from '../../controllers/service/checkController'

const router = express.Router()

const apiRoute = project.api_prefix + '/services'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/checks',
  apiRoute + '/checks/usage',
  apiRoute + '/:code/store/:storecode'
]

// OTHER //
router.get(apiRouter[2], requireAuth, getServiceChecks)
router.get(apiRouter[3], requireAuth, getServiceChecksUsage)
router.get(apiRouter[4], requireAuth, getServiceByCodeStore)
// OTHER //

// MAIN //
router.get(apiRouter[1], requireAuth, getService)

router.get(apiRouter[0], requireAuth, getServices)

router.post(apiRouter[1], requireAuth, insertService)

router.put(apiRouter[1], requireAuth, updateService)

router.delete(apiRouter[1], requireAuth, deleteService)

router.delete(apiRouter[0], requireAuth, deleteServices)
// MAIN //

export default router
