import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  setMemberUnitInfo, getMemberUnitByPoliceNo, memberUnitExists, getMemberUnitsData, getMemberUnitsAllData, getMemberUnitsByCode,
  createMemberUnit, updateMemberUnit, deleteMemberUnit, deleteMemberUnits
}
  from '../../services/member/memberUnitService'

import { getMemberByCode } from '../../services/member/memberService'
import { extractTokenProfile } from '../../services/v1/securityService'
import { isEmpty } from '../../utils/check'

// Retrive list a member
exports.getMemberUnit = function (req, res, next) {
  console.log('Requesting-getMemberUnit: ' + req.url + ' ...')
  const membercode = req.params.id
  const memberunit = req.params.no
  getMemberByCode(membercode).then(memberData => {
    return getMemberUnitByPoliceNo(memberData.id, memberunit).then((member) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        member: member
      })
    }).catch(err => next(new ApiError(422, err + ` - Couldn't find Member ${membercode} - ${memberunit}.`, err)))
  }).catch(err => next(new ApiError(501, `Couldn't create Member ${membercode}`, err)))
}

// Retrive list of members
exports.getMemberUnits = function (req, res, next) {
  console.log('Requesting-getMemberUnits: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  const membercode = req.params.id
  if (isEmpty(other)) {
    if (!isEmpty(membercode)) {
      getMemberUnitsByCode(membercode).then((memberunits) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: JSON.parse(JSON.stringify(memberunits)),
          total: memberunits.length
        })
      }).catch(err => next(new ApiError(501, err + ` - Couldn't find Member ${membercode} Units.`, err)))
    } else {
      next(new ApiError(422, `Member ${membercode} not exists.`))
    }
  } else {
    getMemberUnitsData(membercode, other).then((memberunits) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        data: JSON.parse(JSON.stringify(memberunits)),
        total: memberunits.length
      })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Member Units.`, err)))
  }
}

exports.getMemberAllUnits = async (req, res, next) => {
  console.log('Requesting-getMemberUnits: ' + req.url + ' ...')
  const memberunits = await getMemberUnitsAllData()
  res.xstatus(200).json({
    success: true,
    message: 'Ok',
    total: memberunits.length,
    data: memberunits
  })
}

// Create a new member
exports.insertMemberUnit = function (req, res, next) {
  console.log('Requesting-insertMemberUnit: ' + req.url + ' ...')
  const membercode = req.params.id
  const memberunit = req.params.no
  let member = req.body
  const userLogIn = extractTokenProfile(req)
  getMemberByCode(membercode).then(memberData => {
    return memberUnitExists(memberData.id, memberunit).then(exists => {
      if (exists)
        next(new ApiError(409, `Member Unit ${membercode} - ${memberunit} already exists.`))
      else {
        return createMemberUnit(memberData.id, memberunit, member, userLogIn.userid, next).then((memberCreated) => {
          return getMemberUnitByPoliceNo(memberData.id, memberCreated.policeNo).then((memberByPoliceNo) => {
            console.log('memberByPoliceNo', memberByPoliceNo)
            let memberUnitInfo = setMemberUnitInfo(memberByPoliceNo)
            let jsonObj = {
              success: true,
              message: `Member Unit ${memberUnitInfo.memberCode} - ${memberUnitInfo.policeNo} created`,
            }
            if (project.message_detail === 'ON') { Object.assign(jsonObj, { memberUnit: memberUnitInfo }) }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(422, err + `Couldn't find Member Unit ${membercode} - ${memberunit}.`, err)))
        }).catch(err => next(new ApiError(501, `Couldn't create Member Unit ${membercode} - ${memberunit}.`, err)))
      }
    })
  }).catch(err => next(new ApiError(501, `Couldn't create Member ${membercode}`, err)))
}

//Update Member
exports.updateMemberUnit = function (req, res, next) {
  console.log('Requesting-updateMemberUnit: ' + req.url + ' ...')
  const membercode = req.params.id
  const memberunit = req.params.no
  let member = req.body
  const userLogIn = extractTokenProfile(req)
  getMemberByCode(membercode).then(memberData => {
    return memberUnitExists(memberData.id, memberunit).then(exists => {
      if (exists) {
        return updateMemberUnit(memberData.id, memberunit, member, userLogIn.userid, next).then((memberUnitUpdated) => {
          return getMemberUnitByPoliceNo(memberData.id, memberunit).then((memberByPoliceNo) => {
            const memberUnitInfo = setMemberUnitInfo(memberByPoliceNo)
            let jsonObj = {
              success: true,
              message: `Member ${memberUnitInfo.memberName} - ${memberUnitInfo.policeNo} updated`,
            }
            if (project.message_detail === 'ON') { Object.assign(jsonObj, { memberUnit: memberUnitInfo }) }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(501, `Couldn't update Member Unit ${membercode} - ${memberunit}.`, err)))
        }).catch(err => next(new ApiError(422, `Couldn't find Member Unit ${membercode} - ${memberunit}.`, err)))
      } else {
        next(new ApiError(422, `Couldn't find Member Unit ${membercode} - ${memberunit}.`))
      }
    }).catch(err => next(new ApiError(422, `Exception: Couldn't find Member Unit ${membercode} - ${memberunit}.`, err)))
  }).catch(err => next(new ApiError(501, `Couldn't create Member ${membercode}`, err)))
}

//Delete a Member
exports.deleteMemberUnit = function (req, res, next) {
  console.log('Requesting-deleteMemberUnit: ' + req.url + ' ...')
  let membercode = req.params.id
  const memberunit = req.params.no
  memberUnitExists(membercode, memberunit).then(exists => {
    if (exists) {
      return deleteMemberUnit(membercode, memberunit).then((memberUnitDeleted) => {
        if (memberUnitDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Member Unit ${membercode} - ${memberunit} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { member: memberUnitDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Member Unit ${membercode} - ${memberunit}  fail to delete.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Member ${membercode}.`, err)))
    } else {
      next(new ApiError(422, `Member Unit ${membercode} - ${memberunit}  not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Member Unit ${membercode} - ${memberunit}  not exists.`, err)))
}

//Delete some Member
exports.deleteMemberUnits = function (req, res, next) {
  console.log('Requesting-deleteMemberUnits: ' + req.url + ' ...')
  let members = req.body;
  deleteMemberUnits(members).then((memberUnitDeleted) => {
    if (memberUnitDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Member Units [ ${members.policeNo} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { members: memberUnitDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Members [ ${members.memberCode} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Members [ ${members.memberCode} ].`, err)))
}

