/**
 * Created by Veirry on 22/09/2017.
 */
import express from 'express'
import project from '../../../config/project.config'
import { requireAuth } from '../../services/v1/usersService'
import { getPeriodCode, getPeriodData, insertPeriod, updatePeriod, getLastNumber, getPeriodActive }
    from '../../controllers/periodController'

const router = express.Router()

const apiRoute = project.api_prefix + '/period'
const apiRoute1 = project.api_prefix + '/period/code/last'
const apiRouter = [
    apiRoute,
    apiRoute + '/:id',
    apiRoute1,
    apiRoute1 + '/active',
]

// MAIN //
router.get(apiRouter[1], requireAuth, getPeriodCode)

router.get(apiRouter[0], requireAuth, getPeriodData)

router.get(apiRouter[2], requireAuth, getLastNumber)

router.get(apiRouter[3], requireAuth, getPeriodActive)

router.post(apiRouter[1], requireAuth, insertPeriod)

router.put(apiRouter[1], requireAuth, updatePeriod)
// MAIN //

export default router
