/**
 * Created by panda. has.my .id on 4/17/17.
 */
import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { insertEmployee, getTechnician, getEmployee, getEmployee2, getEmployeeById, updateEmployee, deleteEmployee } from '../../controllers/employeeController'

const router = express.Router()

const apiRoute = project.api_prefix + '/employees'
const apiRouter = [
  apiRoute + '/insert',
  apiRoute + '/update',
  apiRoute + '/delete',
  apiRoute + '/list',
  apiRoute + '/listById/:employeeId',
  apiRoute,
  apiRoute + '/technician/:positionId',
]

// Insert employee
router.post(apiRouter[0], requireAuth, insertEmployee)

router.put(apiRouter[1], requireAuth, updateEmployee)

//antd
router.post(apiRouter[5], requireAuth, insertEmployee)

router.put(apiRouter[5], requireAuth, updateEmployee)

router.delete(apiRouter[5], requireAuth, deleteEmployee)

router.get(apiRouter[6], requireAuth, getTechnician)
//----------

router.delete(apiRouter[2], requireAuth, deleteEmployee)

// Get Employee
router.get(apiRouter[3], requireAuth, getEmployee)

router.get(apiRouter[5], requireAuth, getEmployee)

// Get Employee By Id
router.get(apiRouter[4], requireAuth, getEmployeeById)

export default router
