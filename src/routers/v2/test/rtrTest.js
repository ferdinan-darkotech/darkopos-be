import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getTest, getTest400 } from './ctlTest'

const router = express.Router()

const apiRoute = '/api/v2' + '/test'
const apiRouter = [
  apiRoute,
  apiRoute + '/400',
]

// TEST //
router.get(apiRouter[0], requireAuth, getTest)
router.get(apiRouter[1], requireAuth, getTest400)
// TEST //

export default router