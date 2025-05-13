import express from 'express'
import project from '../../../../../config/project.config'
import { requireAuth } from '../../../../services/v1/usersService'
import { getMechanics } from '../../../../controllers/v2/master/humanresource/ctlMechanicTools'

const router = express.Router()

const mechanicRoute = project.api_prefix_v2 + '/mechanic'

// MAIN //
router.get(`${mechanicRoute}`, requireAuth, getMechanics)

// MAIN //

export default router
