import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { createMechanicTool, deleteMechanicTool, getMechanics, getMechanicTools, getMechanicToolsByEmployeeCode } from '../../../../controllers/v2/master/humanresource/ctlMechanicTools'

const router = express.Router()

const mechanicRoute = project.api_prefix_v2 + '/mechanic'

// MAIN //
router.get(`${mechanicRoute}`, requireAuth, getMechanics)
router.get(`${mechanicRoute}/tool`, requireAuth, getMechanicTools)
router.get(`${mechanicRoute}/:employeecode/tool`, requireAuth, getMechanicToolsByEmployeeCode)

router.post(`${mechanicRoute}/tool`, requireAuth, createMechanicTool)
router.delete(`${mechanicRoute}/:employeecode/tool/:id`, requireAuth, deleteMechanicTool)

// MAIN //

export default router
