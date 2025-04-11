import express from 'express'
import project from '../../../../config/project.config'
import { requireAuth } from '../../../services/v1/usersService'
import {
  getMember, getMembers, insertMember, updateMember,
  deleteMember, deleteMembers, updateMemberCashback,
  insertMemberNPS, getMemberNPS, getMemberNPSs, getMemberNPSLastDate,
  getMemberByAsset, syncMemberCashback, syncMemberCashbackByCode
}
  from '../../../controllers/member/memberController'
import { getMemberUnit, getMemberUnits, getMemberAllUnits, insertMemberUnit, updateMemberUnit, deleteMemberUnit, deleteMemberUnits }
  from '../../../controllers/member/memberUnitController'

const router = express.Router()

const apiRoute = project.api_prefix + '/members'
const apiRouteUnit = project.api_prefix + '/membersunit'
const apiRouteCashback = project.api_prefix + '/members/cashback'
const apiRouter = [
  apiRoute, // 0
  apiRoute + '/:id', // 1
  apiRoute + '/:id/units', // 2
  apiRoute + '/:id/units/:no', // 3
  apiRoute + '/:id/points', // 4
  apiRoute + '/:id/nps', // 5
  apiRoute + '/:id/nps/:date', // 6
  apiRoute + '/:id/npslastdate', // 7
  apiRoute + '/units/search', // 8
  apiRouteCashback + '/:id', // 9
  apiRouteCashback + '/:id/code', // 10,
  apiRouteUnit // 11
]

// MAIN //
router.get(apiRouter[1], requireAuth, getMember)

router.get(apiRouter[0], requireAuth, getMembers)

router.post(apiRouter[1], requireAuth, insertMember)

router.put(apiRouter[1], requireAuth, updateMember)

router.put(apiRouter[4], requireAuth, updateMemberCashback)

router.delete(apiRouter[1], requireAuth, deleteMember)

router.delete(apiRouter[0], requireAuth, deleteMembers)
// MAIN //

// UNIT //
router.get(apiRouter[3], requireAuth, getMemberUnit)

router.get(apiRouter[2], requireAuth, getMemberUnits)

router.get(apiRouter[11], requireAuth, getMemberAllUnits)

router.post(apiRouter[3], requireAuth, insertMemberUnit)

router.put(apiRouter[3], requireAuth, updateMemberUnit)

router.delete(apiRouter[3], requireAuth, deleteMemberUnit)

router.delete(apiRouter[2], requireAuth, deleteMemberUnits)
// UNIT //

// OTHER //
router.post(apiRouter[5], requireAuth, insertMemberNPS)

router.get(apiRouter[5], requireAuth, getMemberNPSs)

router.get(apiRouter[6], requireAuth, getMemberNPS)

router.get(apiRouter[7], requireAuth, getMemberNPSLastDate)

router.get(apiRouter[8], requireAuth, getMemberByAsset)

router.get(apiRouter[9], requireAuth, syncMemberCashback)

router.get(apiRouter[10], requireAuth, syncMemberCashbackByCode)
// OTHER //

export default router