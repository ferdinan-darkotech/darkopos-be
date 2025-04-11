import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getEmployee, getEmployees, insertEmployee, updateEmployee, deleteEmployee, deleteEmployees,
  getMechanic, getMechanics }
  from '../../controllers/employeeController'

const router = express.Router()

const apiRoute = project.api_prefix + '/employees'
const apiRouter = [
  apiRoute,
  apiRoute + '/:id',
  apiRoute + '/mechanics',
  apiRoute + '/mechanics'+ '/:id',
]

// OTHER //
router.get(apiRouter[3], requireAuth, getMechanic)

router.get(apiRouter[2], requireAuth, getMechanics)
// OTHER //

// MAIN //
router.get(apiRouter[1], requireAuth, getEmployee)

router.get(apiRouter[0], requireAuth, getEmployees)
//
router.post(apiRouter[1], requireAuth, insertEmployee)
//
router.put(apiRouter[1], requireAuth, updateEmployee)
//
router.delete(apiRouter[1], requireAuth, deleteEmployee)
//
router.delete(apiRouter[0], requireAuth, deleteEmployees)
// MAIN //



export default router