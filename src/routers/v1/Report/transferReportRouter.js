import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getTransferOut, getTransferIn, getTransferInTransfer, getTransferInTransit } from '../../../controllers/Report/transferController'

const router = express.Router()

const apiRoute = project.api_prefix + '/report/transfer'
const apiRouter = [
  apiRoute,
  apiRoute + '/out', // 1
  apiRoute + '/in', // 2
  apiRoute + '/intransfer', // 3
  apiRoute + '/intransit' // 4
]

// MAIN //

router.get(apiRouter[1], requireAuth, getTransferOut)

router.get(apiRouter[2], requireAuth, getTransferIn)

router.get(apiRouter[3], requireAuth, getTransferInTransfer)

router.get(apiRouter[4], requireAuth, getTransferInTransit)

// MAIN //

export default router