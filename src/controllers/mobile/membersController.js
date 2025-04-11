import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  srvAddMobileMember, srvGetMobileMember, getMobileMemberActive,
  srvGetMemberStatus, srvAddMobileMemberAsset, srvGetMobileMemberAsset,
  srvAddMemberAsset, srvGetMemberAsset,
  srvGetTmpMobileMember, srvGetTmpMobileMemberAsset, srvGetTmpBookingMobile
} from '../../services/mobile/membersService'
import { getMember, srvActivateMobile, checkMobileActive } from '../../services/member/memberService'
import { createMemberUnit } from '../../services/member/memberUnitService'
import { extractTokenProfile } from '../../services/v1/securityService'

/* response code
  200=successful action
  409=record exists or conflict
  404=record not exists
  422=unsuccessful action or validation error
*/

exports.addMobileMember = function (req, res, next) {
  console.log('Requesting-insertMobileMember: ' + req.url + ' ...')
  srvGetMemberStatus(req.params.id).then(results => {
    if (results.memberStatus.substr(0, 1) === '0') {
      //member not exists
      srvAddMobileMember(req.params.id, req.body, next).then(results => {
        srvGetMobileMember(req.params.id).then(results => {
          let jsonObj = {
            success: true,
            message: `Mobile Member ${results[0].memberCardId} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { member: results }) }
          res.xstatus(201).json(jsonObj)
        }).catch(err => next(new ApiError(404, `ZMMA-00004: Couldn't find Member Card Id ${req.params.id}.`, err)))
      }).catch(err => next(new ApiError(422, `ZMMA-00003: Couldn't insert Member Card Id ${req.params.id}.`, err)))
    } else {
      //member exists
      next(new ApiError(409, `ZMMA-00002: Member Card Id=${req.params.id}, status= ${results.memberStatus.substr(2)}`))
    }
  }).catch(err => next(new ApiError(404, `ZMMA-00001: Couldn't get status for Member Card Id ${req.params.id}.`, err)))
}

// Insert a mobile member asset
exports.addMobileMemberAsset = function (req, res, next) {
  console.log('Requesting-insertMobileMemberAsset: ' + req.url + ' ...')
  srvGetMemberStatus(req.params.id).then(results => {
    if (results.memberStatus.substr(0, 1) === '0') {
      //member not exists
      next(new ApiError(404, `ZMMA-00012: Member Card Id=${req.params.id}, status= ${results.memberStatus.substr(2)}`))
    } else if (results.memberStatus.substr(0, 1) === '1') {
      //member mobile exists and not activated => insert to tmp_user_mobile_asset
      srvAddMobileMemberAsset(req.params.id, req.params.no, req.body, next).then(results => {
        srvGetMobileMemberAsset(req.params.id, req.params.no).then(results => {
          let jsonObj = {
            success: true,
            message: `Mobile Member ${results[0].memberCardId} - license ${req.params.no} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { member: results }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(404, `ZMMA-00011: Couldn't find Member Card Id ${req.params.id} - license ${req.params.no}.`, err)))

      }).catch(err => next(new ApiError(422, `ZMMA-00010: Couldn't insert Member Card Id ${req.params.id} - license ${req.params.no}.`, err)))
    } else if (results.memberStatus.substr(0, 1) === '2') {
      //member exists and not activated
      next(new ApiError(409, `ZMMA-00009: Member Card Id=${req.params.id}, status= ${results.memberStatus.substr(2)}`))
    } else if (results.memberStatus.substr(0, 1) === '3') {
      //member exists and activated => insert to tbl_member_unit
      srvAddMemberAsset(req.params.id, req.params.no, req.body, next).then(results => {
        srvGetMemberAsset(req.params.id, req.params.no).then(results => {
          let jsonObj = {
            success: true,
            message: `Member ${req.params.id} - license ${req.params.no} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { asset: results }) }
          res.xstatus(201).json(jsonObj)
        }).catch(err => next(new ApiError(404, `ZMMA-00008: Couldn't find Member Card Id ${req.params.id} - license ${req.params.no}.`, err)))

      }).catch(err => next(new ApiError(422, `ZMMA-00007: Couldn't insert Member Card Id ${req.params.id} - license ${req.params.no}.`, err)))
    } else {
      next(new ApiError(422, `ZMMA-00006: Member Card Id=${req.params.id}, status= ${results.memberStatus.substr(2)}`))
    }
  }).catch(err => next(new ApiError(404, `ZMMA-00005: Couldn't get status for Member Card Id ${req.params.id} - license ${req.params.no}.`, err)))
}

// get member status
exports.getMemberStatus = function (req, res, next) {
  console.log('Requesting-getMemberStatus: ' + req.url + ' ...')
  let status = {}, dataMember = {}, dataMemberAsset = [], dataBooking = [], dataPromise = []
  status = srvGetMemberStatus(req.params.id, req.query.mode).catch(err => next(new ApiError(404, `ZMMA-00013: Couldn't get status for Member Card Id ${req.params.id}.`, err)))
  if (req.query.detail == 1) {
    dataMember = srvGetTmpMobileMember(req.params.id)
    dataMemberAsset = srvGetTmpMobileMemberAsset(req.params.id)
    dataBooking = srvGetTmpBookingMobile(req.params.id)
    dataPromise = [status, dataMember, dataMemberAsset, dataBooking]
  } else {
    dataPromise = [status]
  }

  Promise.all(dataPromise).then((values) => {
    const statusMember = values[0]
    statusMember.memberCode = req.params.id
    res.xstatus(200).json({
      success: true,
      message: 'Receive status for member card id: ' + req.params.id,
      data: { info: values[0], member: values[1], asset: values[2], booking: values[3] }
    })
  })
}

exports.activateMobileMember = function (req, res, next) {
  console.log('Requesting-activateMobileMember: ' + req.url + ' ...')
  const userLogIn = extractTokenProfile(req)
  let activateData = {
    memberId: req.params.id,
    ...req.body
  }
  srvGetMemberStatus(req.params.id).then(results => {
    if (results.memberStatus.substr(0, 1) === '0') {
      // member not exists
      next(new ApiError(422, `ZMMA-00021: Member Card Id=${req.params.id}, status= ${results.memberStatus.substr(2)}`))
    } else if (results.memberStatus.substr(0, 1) === '1') {
      // member mobile not activate
      let mode = (activateData.memberCode !== 'code') ? 'offline' : 'mobile'
      return srvActivateMobile(mode, activateData, userLogIn.userid, next).then(results => {
        if (results) {
          let jsonObj = {
            success: true,
            message: 'Congratulations ' + results.memberName + ', your member ' + results.memberCode + ' has been successfully ' + ((mode === 'offline') ? 'linked & ' : '') + 'activated',
            data: results
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(400, `ZMMA-00020: Couldn't activate for Member Card Id ${req.params.id}.`))
        }
      }).catch(err => next(new ApiError(422, `ZMMA-00019: Couldn't activate for Member Card Id ${req.params.id}.`, err)))
    } else if (results.memberStatus.substr(0, 1) === '2') {
      //member exists and not activated
      return srvActivateMobile('offline', activateData, userLogIn.userid, next).then(results => {
        if ((results || []).length > 0) {
          let jsonObj = {
            success: true,
            message: 'Congratulations ' + results[0][0].memberName + ', your member ' + results[0][0].memberCode + ' has been successfully linked & activated',
            data: results ? results[0][0] : []
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(400, `ZMMA-00018: Couldn't activate for Member Card Id ${req.params.id}.`))
        }
      }).catch(err => next(new ApiError(422, `ZMMA-00017: Couldn't activate for Member Card Id ${req.params.id}.`, err)))
    } else if (results.memberStatus.substr(0, 1) === '3') {
      //member exists and activated
      next(new ApiError(422, `ZMMA-00016: Member Card Id ${req.params.id} already activated.`))
    } else {
      next(new ApiError(422, `ZMMA-00015: Member Card Id=${req.params.id}, status= ${results.memberStatus.substr(2)}`))
    }
  }).catch(err => next(new ApiError(404, `ZMMA-00014: Couldn't get status for Member Card Id ${req.params.id}.`, err)))
}

// Select mobile member
exports.selectMobileMember = function (req, res, next) {
  console.log('Requesting-selectMobileMember: ' + req.url + ' ...')
  srvGetMobileMember(req.params.id).then(results => {
    if ((results || []).length > 0) {
      let jsonObj = {
        success: true,
        message: 'Ok',
        data: results ? results[0] : []
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(404, `ZMMA-00023: Couldn't Member Card Id ${req.params.id}.`))
    }
  }).catch(err => next(new ApiError(404, `ZMMA-00022: Couldn't find Member Card Id ${req.params.id}.`, err)))
}

// Select mobile member asset
exports.selectMobileMemberAsset = function (req, res, next) {
  console.log('Requesting-selectMobileMemberAsset: ' + req.url + ' ...')
  srvGetTmpMobileMemberAsset(req.params.id).then(results => {
    if ((results || []).length > 0) {
      let jsonObj = {
        success: true,
        message: 'Ok',
        data: results ? results : []
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(404, `ZMMA-00025: Couldn't find asset for Member Card Id ${req.params.id}.`))
    }
  }).catch(err => next(new ApiError(404, `ZMMA-00024: Couldn't find asset for Member Card Id ${req.params.id}.`, err)))
}