import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import { getMobileMember } from '../../services/mobile/membersService'
import {
  addMobileBooking, getMobileBooking, getMobileBookings,
  setMobileBooking, getMobileBookingUpdateHistory,
  addBooking, getBooking
} from '../../services/mobile/bookingService'
import { srvGetMemberStatus } from '../../services/mobile/membersService'

// // Insert new mobile booking
// exports.insertMobileBooking = function (req, res, next) {
//   console.log('Requesting-insertMobileBooking: ' + req.url + ' ...')
//   getMobileMember(req.body.member_card_id).then(existsMember => {
//     if (existsMember.length > 0) {
//       getMobileBooking(req.params.id).then(exists => {
//         if (exists.length > 0) {
//           next(new ApiError(409, `ZMBB-00005: Booking Id ${req.params.id} already exists.`))
//         } else {
//           addMobileBooking(req.params.id, req.body, next).then(results => {
//             getMobileBooking(req.params.id).then(results => {
//               let jsonObj = {
//                 success: true,
//                 message: `Booking Id ${results[0].memberCardId} created`,
//               }
//               if (project.message_detail === 'ON') { Object.assign(jsonObj, { member: results }) }
//               res.xstatus(200).json(jsonObj)
//             })
//
//           }).catch(err => next(new ApiError(422, `ZMBB-00004: Something wrong.`, err)))
//         }
//       }).catch(err => next(new ApiError(422, `ZMBB-00003: Couldn't find Member Card Id.`, err)))
//     } else {
//       next(new ApiError(422, `ZMBB-00002: Member Card Id ${req.body.member_card_id} not exists.`))
//     }
//   }).catch(err => next(new ApiError(422, `ZMBB-00001: Couldn't find Member Card Id.`, err)))
// }

// Insert new mobile booking
exports.insertMobileBooking = function (req, res, next) {
  console.log('Requesting-insertMobileBooking: ' + req.url + ' ...')
  srvGetMemberStatus(req.body.member_card_id).then(results => {
    if (results.memberStatus.substr(0,1)==='0') {
      // member not exists
      next(new ApiError(422, `ZMMB-00010: Couldn't add booking, member not exists for Member Card Id ${req.body.member_card_id}.`))
    } else if (results.memberStatus.substr(0,1)==='1') {
      addMobileBooking(req.params.id, req.body, next).then(results => {
        getMobileBooking(req.params.id).then(results => {
          let jsonObj = {
            success: true,
            message: `Booking Id ${results[0].memberCardId} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { member: results }) }
          res.xstatus(200).json(jsonObj)
        })
      }).catch(err => next(new ApiError(422, `ZMBB-00004: Something wrong.`, err)))
    } else if (results.memberStatus.substr(0,1)==='2') {
      //member exists and not activated
      next(new ApiError(400, `ZMMA-00014: Couldn't add booking for Member Card Id ${req.params.id}.`))
    } else if (results.memberStatus.substr(0,1)==='3') {
      //member exists and activated
      addBooking(req.params.id, req.body, next).then(results => {
        getBooking(req.params.id).then(results => {
          let jsonObj = {
            success: true,
            message: `Booking Id ${results[0].memberCardId} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { member: results }) }
          res.xstatus(200).json(jsonObj)
        })
      }).catch(err => next(new ApiError(422, `ZMBB-00004: Something wrong.`, err)))
    } else {
      next(new ApiError(422, `ZMBA-00002: Member Card Id=${req.params.id}, status= ${results.memberStatus.substr(2)}`))
    }
  }).catch(err => next(new ApiError(404, `ZMBA-00001: Couldn't get status for Member Card Id ${req.params.id}.`, err)))
}

// Select a mobile booking
exports.selectMobileBooking = function (req, res, next) {
  console.log('Requesting-selectMobileBooking: ' + req.url + ' ...')
  getMobileBooking(req.params.id).then(booking => {
    const { id, ...other } = booking[0]
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: [other],
      total: Object.keys(booking[0]).length
    })
  }).catch(err => next(new ApiError(422, `ZMBB-00006: Couldn't find BookingId ${req.params.id}.`, err)))
}

// Select some mobile bookings
exports.selectMobileBookings = function (req, res, next) {
  console.log('Requesting-selectMobileBookings: ' + req.url + ' ...')
  getMobileBookings(req.query).then(booking => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: (booking || []),
      total: (booking || []).length
    })
  }).catch(err => next(new ApiError(422, `ZMBB-00007: Couldn't find BookingId ${req.params.id}.`, err)))
}

// update a mobile bookings
exports.updateMobileBookings = function (req, res, next) {
  console.log('Requesting-updateMobileBookings: ' + req.url + ' ...')
  const bookingInfo = {
    id: req.params.id,
    oldStatus: req.body.oldStatus,
    newStatus: req.body.newStatus,
    updateBy: req.body.updateBy,
    newScheduleDate: req.body.newScheduleDate,
    newScheduleTime: req.body.newScheduleTime,
  }
  setMobileBooking(bookingInfo).then(results => {
    if (results.err) {
      res.xstatus(200).json({
        success: false,
        message: results.err
      })
    } else {
      if (results[1] > 0) {
        getMobileBooking(bookingInfo.id, bookingInfo.newStatus).then(results => {
          let jsonObj = {
            success: true,
            message: `Booking Id Status ${bookingInfo.id} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { status: results[0].status }) }
          res.xstatus(200).json(jsonObj)
        })
      } else {
        res.xstatus(200).json({
          success: false,
          message: `ZMBB-00008: Couldn't find BookingId ${bookingInfo.id} with this status`,
        })
      }
    }
  }).catch(err => next(new ApiError(422, `ZMBB-00008: Couldn't find BookingId ${req.params.id}.`, err)))
}

// Select a mobile booking update history
exports.selectMobileBookingUpdateHistory = function (req, res, next) {
  console.log('Requesting-selectMobileBookingUpdateHistory: ' + req.url + ' ...')
  getMobileBookingUpdateHistory(req.params.id).then(history => {
    for (let index of history) { delete index.id }
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: history,
      total: history.length
    })
  }).catch(err => next(new ApiError(422, `ZMBB-00009: Couldn't find Update History of BookingId ${req.params.id}.`, err)))
}