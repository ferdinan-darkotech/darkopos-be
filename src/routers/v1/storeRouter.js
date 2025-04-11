/**
 * Created by panda . has . my . id on 12/18/17.
 */
import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import {
  getStore, getListData, getStoreById, getAllStores, updateStore, insertStore, deleteStore,
  getSettingStore
} from '../../controllers/storeController'

const router = express.Router()

const apiRoute = project.api_prefix + '/stores'
const apiRoute2 = project.api_prefix + '/list/stores'

const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/id/:id',
  apiRoute2,
  apiRoute + '/setting/:id',

]

router.get(apiRouter[1], requireAuth, getStore)

router.get(apiRouter[2], requireAuth, getStoreById)

router.get(apiRouter[0], requireAuth, getAllStores)

router.get(apiRouter[3], requireAuth, getListData)

router.get(apiRouter[4], requireAuth, getSettingStore)

router.post(apiRouter[0], requireAuth, insertStore)

router.put(apiRouter[1], requireAuth, updateStore)

router.delete(apiRouter[1], requireAuth, deleteStore)

export default router;