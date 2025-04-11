import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getCustomerAssetsGeneral, getCustomerAssetsFilter, getCustomerAssetByNo, getCustomerByAsset,
  insertCustomerAsset, updateCustomerAssetGeneral, deleteCustomerAsset, undeleteCustomerAsset,
  ctlGetAsset
}
  from '../../../../controllers/v2/master/customer/ctlCustomerAsset'

const router = express.Router()

const apiRouteCA = project.api_prefix_v2 + '/customers/:code/assets'
const apiRouteC = project.api_prefix_v2 + '/customers-assets'
const apiRouter = [
  apiRouteCA,
  apiRouteCA + '/q',
  apiRouteCA + '/:no',
  apiRouteCA + '/:no/u',
  apiRouteC + '/:no',
  apiRouteC
]

// MAIN //
router.get(apiRouter[5], requireAuth, ctlGetAsset)
router.get(apiRouter[0], requireAuth, getCustomerAssetsGeneral)
router.get(apiRouter[1], requireAuth, getCustomerAssetsFilter)
router.get(apiRouter[2], requireAuth, getCustomerAssetByNo)
router.post(apiRouter[0], requireAuth, insertCustomerAsset)
router.put(apiRouter[2], requireAuth, updateCustomerAssetGeneral)
router.delete(apiRouter[2], requireAuth, deleteCustomerAsset)
router.put(apiRouter[3], requireAuth, undeleteCustomerAsset)
// MAIN //

// OTHER //
router.get(apiRouter[4], requireAuth, getCustomerByAsset)
// OTHER //

export default router