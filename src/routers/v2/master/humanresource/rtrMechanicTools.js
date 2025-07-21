import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { checkMechanicToolBeforeInsert, createMechanicTool, deleteMechanicTool, generateSaldoAwalMehanicTools, getMechanics, getMechanicTools, getMechanicToolsByEmployeeCode, getMechanicToolsInventory, getMonthAndYearSaldoPeriod, printMechanicTools, printMechanicToolsByEmployeeCode } from '../../../../controllers/v2/master/humanresource/ctlMechanicTools'

const router = express.Router()

const mechanicRoute = project.api_prefix_v2 + '/mechanic'

// MAIN //
router.get(`${mechanicRoute}`, requireAuth, getMechanics)
router.get(`${mechanicRoute}/tool`, requireAuth, getMechanicTools)
router.get(`${mechanicRoute}/:employeecode/tool`, requireAuth, getMechanicToolsByEmployeeCode)

router.get(`${mechanicRoute}/tool/print`, requireAuth, printMechanicTools)
router.get(`${mechanicRoute}/:employeecode/tool/print`, requireAuth, printMechanicToolsByEmployeeCode)

router.post(`${mechanicRoute}/tool`, requireAuth, createMechanicTool)
router.delete(`${mechanicRoute}/:employeecode/tool/:id`, requireAuth, deleteMechanicTool)

// [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
router.get(`${mechanicRoute}/tool/inventory`, requireAuth, getMechanicToolsInventory)

// [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
router.get(`${mechanicRoute}/:employeecode/tool/:toolcode/report`, requireAuth, checkMechanicToolBeforeInsert)
router.get(`${mechanicRoute}/tool/saldo/period`, requireAuth, getMonthAndYearSaldoPeriod)
router.post(`${mechanicRoute}/tool/generate-saldo-awal`, generateSaldoAwalMehanicTools)

// MAIN //

export default router
