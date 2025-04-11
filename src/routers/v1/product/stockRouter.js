import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getStock, getStockLocal, getStocks, getStocksLocal, getStocksActiveZero,
  insertStock, updateStock, deleteStock, deleteStocks, getProducts,
  getAlertedStocks, syncProductPrice, ctlGetUpdateLogStockPrice,
  ctlGetSomeUpdateLogStockPrice
} from '../../../controllers/stockController'

const router = express.Router()

const apiRoute = project.api_prefix + '/stocks'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/code',
  apiRoute + '/alert',
  apiRoute + '/:productCode/store/:storeId',
  apiRoute + '/store/:storeId',
  apiRoute + '/store/:storeId/sync',
  apiRoute + '/quantity/0',
  apiRoute + '/log',
  apiRoute + '/log/:product',
  apiRoute + '/products'
]

// MAIN //

router.get(apiRouter[8], requireAuth, ctlGetSomeUpdateLogStockPrice)

router.get(apiRouter[9], requireAuth, ctlGetUpdateLogStockPrice)

router.get(apiRouter[10], requireAuth, getProducts)

router.get(apiRouter[1], requireAuth, getStock)

router.get(apiRouter[4], requireAuth, getStockLocal)

router.get(apiRouter[0], requireAuth, getStocks)

router.get(apiRouter[5], requireAuth, getStocksLocal)

router.post(apiRouter[6], requireAuth, syncProductPrice)

router.get(apiRouter[7], requireAuth, getStocksActiveZero)

router.post(apiRouter[3], requireAuth, getAlertedStocks)

router.post(apiRouter[1], requireAuth, insertStock)

router.put(apiRouter[2], requireAuth, updateStock)

router.delete(apiRouter[1], requireAuth, deleteStock)

router.delete(apiRouter[0], requireAuth, deleteStocks)

// MAIN //

export default router
