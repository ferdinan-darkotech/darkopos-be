import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  setMemberInfo, getMemberByCode, memberExists, getMembersData, createMember,
  updateMember, countData, deleteMember, deleteMembers,
  getMemberId, srvAddMemberNPS, srvGetMemberNPS, srvGetMemberNPSs, srvGetMemberNPSLastDate,
  isMemberValidNPS, srvGetMemberByAsset, syncMemberCashbackById, syncMemberCashbackByCode, countDataMemberAsset, getDataMemberAsset
} from '../../services/member/memberService'
import { getSequenceFormatByCode } from '../../services/sequenceService'
import { extractTokenProfile } from '../../services/v1/securityService'


// Retrive list a member
exports.getMember = function (req, res, next) {
  console.log('Requesting-getMember: ' + req.url + ' ...')
  const membercode = req.params.id
  getMemberByCode(membercode).then((member) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: member
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Member ${membercode}.`, err)))
}

exports.syncMemberCashback = function (req, res, next) {
  console.log('Requesting-syncMemberCashback: ' + req.url + ' ...')
  const memberId = req.params.id
  syncMemberCashbackById(memberId, next).then((member) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: member
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Member ${memberId}.`, err)))
}

exports.syncMemberCashbackByCode = function (req, res, next) {
  console.log('Requesting-syncMemberCashbackByCode: ' + req.url + ' ...')
  const memberId = req.params.id
  syncMemberCashbackByCode(memberId, next).then((member) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: member
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Member ${memberId}.`, err)))
}

// Retrive list of members
exports.getMembers = function (req, res, next) {
  console.log('Requesting-getMembers: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  countData(other).then((count) => {
    return getMembersData(other, pagination).then((members) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: count,
        data: members
      })
    }).catch(err => next(new ApiError(501, err + ` - Couldn't find Members.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Members.`, err)))
}

// Create a new member
exports.insertMember = function (req, res, next) {
  console.log('Requesting-insertMember: ' + req.url + ' ...')
  let membercode = req.params.id
  let member = req.body
  const userLogIn = extractTokenProfile(req)
  
  return new Promise(async (resolve) => {
    if (member.memberGetDefault) {
      const sequence = await getSequenceFormatByCode({ seqCode: 'CUST', type: '1' })
      membercode = sequence
    }
    // throw 'Stop'
    if(!membercode) throw new Error('Membercode is required.')
    return memberExists(membercode).then(exists => {
      if (exists)
        next(new ApiError(409, `Member '${membercode}' already exists.`))
      else {
        return createMember(membercode, member, userLogIn.userid, next).then((memberCreated) => {
          return getMemberByCode(memberCreated.dataValues.memberCode || {}).then((memberByCode) => {
            let memberInfo = setMemberInfo(memberByCode || {})
            let jsonObj = {
              success: true,
              message: `Member ${memberInfo.memberName} created`,
              data: memberInfo
            }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(422, err + `Couldn't find member ${membercode}.`, err)))
        }).catch(err => next(new ApiError(501, `Couldn't create member ${membercode}.`, err)))
      }
    }).catch(err => next(new ApiError(501, `Couldn't create member ${membercode}.`, err)))
  }).catch(err => next(new ApiError(501, `Couldn't create member ${membercode}.`, err)))
}

//Update Member
exports.updateMember = function (req, res, next) {
  console.log('Requesting-updateMember: ' + req.url + ' ...')
  const membercode = req.params.id
  let member = req.body
  const userLogIn = extractTokenProfile(req)
  memberExists(membercode).then(exists => {
    if (exists) {
      return updateMember(membercode, member, userLogIn.userid, next).then((memberUpdated) => {
        return getMemberByCode(membercode).then((memberByCode) => {
          const memberInfo = setMemberInfo(memberByCode)
          let jsonObj = {
            success: true,
            message: `Member ${memberByCode.memberName} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { member: memberInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Member ${memberCode}.`, err)))
      }).catch(err => next(new ApiError(422, `Couldn't find Member ${memberCode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Member ${membercode} .`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Member ${member.memberCode} .`, err)))
}

//Update Member Cashback
exports.updateMemberCashback = function (req, res, next) {
  console.log('Requesting /api/cashierTrans/update ...')
  next(new ApiError(299, 'Deprecated API please refresh.'))
  // updateMemberCashback(membercode, member).then((member) => {
  //   res.xstatus(200).json({
  //     data: 'Update Successfull...!',
  //     success: true
  //   })
  // }).catch(err => next(new ApiError(500, `Couldn't save Transaction.`, err)))
}

//Delete a Member
exports.deleteMember = function (req, res, next) {
  console.log('Requesting-deleteMember: ' + req.url + ' ...')
  let membercode = req.params.id
  memberExists(membercode).then(exists => {
    if (exists) {
      deleteMember(membercode).then((memberDeleted) => {
        if (memberDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Member ${membercode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { member: memberDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Member ${membercode} fail to delete.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Member ${membercode}.`, err)))
    } else {
      next(new ApiError(422, `Member ${membercode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Member ${membercode} not exists.`, err)))
}

//Delete some Member
exports.deleteMembers = function (req, res, next) {
  console.log('Requesting-deleteMembers: ' + req.url + ' ...')
  let members = req.body;
  deleteMembers(members).then((memberDeleted) => {
    if (memberDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Members [ ${members.memberCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { members: memberDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Members [ ${members.memberCode} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Members [ ${members.memberCode} ].`, err)))
}


exports.insertMemberNPS = function (req, res, next) {
  console.log('Requesting-insertMemberNPS: ' + req.url + ' ...')
  const membercode = req.params.id
  const npsInfo = req.body
  const userLogIn = extractTokenProfile(req)
  getMemberId(membercode).then(memberId => {
    if (memberId) {
      return isMemberValidNPS(memberId, npsInfo.date, next).then((result) => {
        if (result.valid) {
          return srvAddMemberNPS(memberId, npsInfo, next).then((npsCreated) => {
            return srvGetMemberNPS(memberId, npsInfo.date).then((npsData) => {
              let jsonObj = {
                success: true,
                message: `Member ${membercode} NPS Score ${npsData.npsScore} for date ${npsData.npsDate}`,
              }
              if (project.message_detail === 'ON') { Object.assign(jsonObj, { nps: npsInfo }) }
              res.xstatus(200).json(jsonObj)
            }).catch(err => next(new ApiError(422, err + `Couldn't find memberId for ${membercode}.`, err)))
          }).catch(err => next(new ApiError(501, `Couldn't create nps for member ${membercode}.`, err)))
        } else {
          next(new ApiError(422, `Couldn't create nps for members ${membercode} - lastDate: ${result.last} - nextDate: ${result.next}.`))
        }
      })
    } else {
      next(new ApiError(422, `Member ${membercode} not exists.`))
    }
  })
}

exports.getMemberNPSs = function (req, res, next) {
  console.log('Requesting-getMemberNPSs: ' + req.url + ' ...')
  const membercode = req.params.id
  getMemberId(membercode).then(memberId => {
    if (memberId) {
      return srvGetMemberNPSs(memberId).then((member) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: member
        })
      }).catch(err => next(new ApiError(422, err + ` - Couldn't find Member ${membercode}.`, err)))
    } else {
      next(new ApiError(422, `Member ${membercode} not exists.`))
    }
  })
}

exports.getMemberNPS = function (req, res, next) {
  console.log('Requesting-getMemberNPS: ' + req.url + ' ...')
  const membercode = req.params.id
  const npsDate = req.params.date
  getMemberId(membercode).then(memberId => {
    if (memberId) {
      return srvGetMemberNPS(memberId, npsDate).then((member) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: member
        })
      }).catch(err => next(new ApiError(422, err + ` - Couldn't find Member ${membercode}.`, err)))
    } else {
      next(new ApiError(422, `Member ${membercode} not exists.`))
    }
  })
}

exports.getMemberNPSLastDate = function (req, res, next) {
  console.log('Requesting-getMemberNPSLastDate: ' + req.url + ' ...')
  const membercode = req.params.id
  getMemberId(membercode).then(memberId => {
    if (memberId) {
      return srvGetMemberNPSLastDate(memberId).then((member) => {
        res.xstatus(200).json({
          success: true,
          message: 'Ok',
          data: member
        })
      }).catch(err => next(new ApiError(422, err + ` - Couldn't find Member ${membercode}.`, err)))
    } else {
      next(new ApiError(422, `Member ${membercode} not exists.`))
    }
  })
}

exports.getMemberByAsset = function (req, res, next) {
  console.log('Requesting-getMemberByAsset: ' + req.url + ' ...')
  const { page, pageSize } = req.query
  const searchterm = {
    q: req.query.license,
    field: req.query.field
  }
  const pagination = {
    pageSize,
    page
  }
  countDataMemberAsset(searchterm).then((count) => {
    return getDataMemberAsset(searchterm, pagination).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: count,
        data: data
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}