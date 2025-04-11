import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import {
  getEmployeesGeneral, getEmployeesFilter, getEmployeeByEmpId, insertEmployee,
  updateEmployee, deleteEmployee, getEmployeeForReports
} from '../../../../controllers/v2/master/humanresource/ctlEmployee'

const router = express.Router()

const apiRoute = project.api_prefix_v2 + '/employees'
const apiRouter = [
  apiRoute,
  apiRoute + '/q',
  apiRoute + '/report',
  apiRoute + '/:empId'
]

// MAIN //
router.get(apiRouter[0], requireAuth, getEmployeesGeneral)
router.get(apiRouter[1], requireAuth, getEmployeesFilter)
router.get(apiRouter[2], requireAuth, getEmployeeForReports)
router.get(apiRouter[3], requireAuth, getEmployeeByEmpId)
router.post(apiRouter[0], requireAuth, insertEmployee)
router.put(apiRouter[3], requireAuth, updateEmployee)
router.delete(apiRouter[3], requireAuth, deleteEmployee)

// MAIN //

export default router