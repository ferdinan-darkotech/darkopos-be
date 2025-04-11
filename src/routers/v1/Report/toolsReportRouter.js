/**
 * Created by Veirry on 24/10/2017.
 */
import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getSellPriceReport }
    from '../../../controllers/Report/toolsController'

const router = express.Router()

const apiRoute = project.api_prefix + '/tools/report/sellprice'
const apiRouter = [
    apiRoute,
    apiRoute + 'history'
]

// MAIN //
router.get(apiRouter[0], requireAuth, getSellPriceReport)
// MAIN //

export default router