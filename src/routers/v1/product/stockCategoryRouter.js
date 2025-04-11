import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getCategory, getCategories,
  insertCategory, updateCategory, deleteCategory, deleteCategories,
  getCategoryProducts
} from '../../../controllers/stockCategoryController'

const router = express.Router()

const apiRoute = project.api_prefix + '/stocks/categories'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/:id/products'
]

// MAIN //
router.get(apiRouter[1], requireAuth, getCategory)

router.get(apiRouter[0], requireAuth, getCategories)

router.post(apiRouter[1], requireAuth, insertCategory)

router.put(apiRouter[1], requireAuth, updateCategory)

router.delete(apiRouter[1], requireAuth, deleteCategory)

router.delete(apiRouter[0], requireAuth, deleteCategories)
// MAIN //

// OTHER //
router.get(apiRouter[2], requireAuth, getCategoryProducts)
// OTHER //

export default router