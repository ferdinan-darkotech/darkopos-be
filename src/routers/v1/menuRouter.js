import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getMenuId, getMenuData, insertMenu, insertSomeMenu, updateMenuById, deleteMenuById, deleteSomeMenuById } from '../../controllers/menuController'

const router = express.Router()

const apiRoute = project.api_prefix + '/menus'
const apiRouter = [
  apiRoute,
  apiRoute+'/:id',
]

// MAIN //
// get menu by menuId
router.get(apiRouter[1], requireAuth, getMenuId)
// get all menu
router.get(apiRouter[0], requireAuth, getMenuData)
// insert menu
router.post(apiRouter[1], requireAuth, insertMenu)
// insert some menu
router.post(apiRouter[0], requireAuth, insertSomeMenu)
// update menu
router.put(apiRouter[1], requireAuth, updateMenuById)
// delete menu
router.delete(apiRouter[1], requireAuth, deleteMenuById)
// delete some menu
router.delete(apiRouter[0], requireAuth, deleteSomeMenuById)
// MAIN //

export default router