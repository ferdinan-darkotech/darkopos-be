import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import { getMonthCounter, getMonthList, getMonthDateCounter, getMonthDateList }
  from '../../../controllers/member/memberBirthController'

const router = express.Router()

const apiRoute = project.api_prefix + '/members/bday'
const apiRouter = [
  apiRoute,
  apiRoute + '/month',
  apiRoute + '/monthlist',
  apiRoute + '/monthdate',
  apiRoute + '/monthdatelist'
]

// MAIN //
router.post(apiRouter[1], requireAuth, getMonthCounter)

router.post(apiRouter[2], requireAuth, getMonthList)

router.post(apiRouter[3], requireAuth, getMonthDateCounter)

router.post(apiRouter[4], requireAuth, getMonthDateList)
// MAIN //

export default router