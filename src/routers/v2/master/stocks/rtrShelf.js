import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import * as cShelf from '../../../../controllers/v2/master/stocks/ctlShelf'

const router = express.Router()

// will be re-route to report/lists
const apiRoute01 = project.api_prefix_v2 + '/shelfs'
const apiRoute02 = project.api_prefix_v2 + '/shelf-items'

const apiRoutes01 = [
  apiRoute01,
  apiRoute01 + '/:ids'
]

const apiRoutes02 = [
  apiRoute02,
  apiRoute02 + '/of',
  apiRoute02 + '/import',
  apiRoute02 + '/bulk-delete'
]

// MAIN

// For Shelf API
router.get(apiRoutes01[0], requireAuth, cShelf.ctlGetSomeShelfs)
router.post(apiRoutes01[0], requireAuth, cShelf.ctlCreateShelf)
router.put(apiRoutes01[1], requireAuth, cShelf.ctlUpdateShelf)


// For Shelf Items API
router.get(apiRoutes02[0], requireAuth, cShelf.ctlGetSomeShelfItems)
router.post(apiRoutes02[1], requireAuth, cShelf.ctlGetShelfOfProducts)
router.post(apiRoutes02[2], requireAuth, cShelf.ctlImportShelfItems)
router.delete(apiRoutes02[3], requireAuth, cShelf.ctlBulkDeleteShelfItems)


// MAIN

export default router
