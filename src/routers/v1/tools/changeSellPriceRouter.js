import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getSellPrice, getChangeSellpriceHeader, insertSellprice, updateSellprice, cancelSellPrice, deleteSellPrice } from '../../../controllers/tools/changeSellpriceControllers'

const router = express.Router()

const apiRoute = project.api_prefix + '/tools/sellprice'
const apiRouter = [
  apiRoute,
  apiRoute + '/update',
  apiRoute + '/cancel/:id',
  apiRoute + '/header',
]

// MAIN //

router.get(apiRouter[0], requireAuth, getSellPrice)

router.get(apiRouter[3], requireAuth, getChangeSellpriceHeader)

router.post(apiRouter[0], requireAuth, insertSellprice)

router.post(apiRouter[1], requireAuth, updateSellprice)

router.put(apiRouter[2], requireAuth, cancelSellPrice)

router.delete(apiRouter[0], requireAuth, deleteSellPrice)

// MAIN //

export default router