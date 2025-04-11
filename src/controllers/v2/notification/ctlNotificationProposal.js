import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetNotificationProposals, srvGetNotificationProposalById, srvGetNotificationProposalByCode,
  srvNotificationProposalExist, srvCreateNotificationProposal, srvUpdateNotificationProposal, srvDeleteNotificationProposal,
  srvGetNotificationProposalByStoreKey }
  from '../../../services/v2/notification/srvNotificationProposal'
import { extractTokenProfile } from '../../../services/v1/securityService'

// Get Notification Proposals
const getNotificationProposals = function (req, res, next, filter = false, comment = 'getNotificationProposals') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }
  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
  }

  srvGetNotificationProposals(req.query, filter).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: type.count,
      data: type.rows
    })
  }).catch(err => next(new ApiError(422, `ZCNS-00001: Couldn't find Notification Proposals`, err)))
}

// Get General Notification Proposals
exports.getNotificationProposalsGeneral = function (req, res, next) {
  getNotificationProposals(req, res, next, false, 'getNotificationProposalsGeneral')
}

// Get Filtered NotificationProposals
exports.getNotificationProposalsFilter = function (req, res, next) {
  getNotificationProposals(req, res, next, true, 'getNotificationProposalsFilter')
}

// not use, code not unique
// // Get A Notification Proposal By Code
// exports.getNotificationProposalByCode = function (req, res, next) {
//   console.log('Requesting-getNotificationProposalByCode: ' + JSON.stringify(req.params) + ' ...')
//   let { code } = req.params
//   srvGetNotificationProposalByCode(code, req.query).then((type) => {
//     res.xstatus(200).json({
//       success: true,
//       message: 'Ok',
//       data: type
//     })
//   }).catch(err => next(new ApiError(422,`ZCNS-00002: Couldn't find Notification Proposal`, err)))
// }

// Get A Notification Proposal By Id
exports.getNotificationProposalById = function (req, res, next) {
  console.log('Requesting-getNotificationProposalById: ' + JSON.stringify(req.params) + ' ...')
  let { id } = req.params
  srvGetNotificationProposalById(id, req.query).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422,`ZCNS-00002: Couldn't find Notification Proposal`, err)))
}

// Get A Notification Proposal By storeId and dataKey
exports.getNotificationProposalByStoreKey = function (req, res, next) {
  console.log('Requesting-getNotificationProposalByStoreKey: ' + JSON.stringify(req.params) + ' ...')
  let { storeId, key } = req.params
  srvGetNotificationProposalByStoreKey(storeId, key).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422,`ZCNS-00015: Couldn't find Notification Proposal`, err)))
}

// Create a Notification Proposal
exports.insertNotificationProposal = function (req, res, next) {
  console.log('Requesting-insertNotificationProposal: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateNotificationProposal(data, userLogIn.userid, next).then((created) => {
    return srvGetNotificationProposalById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Notification Proposal ${result.id} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCNS-00003: Couldn't create Notification Proposal ${data.name} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCNS-00004: Couldn't find Notification Proposal ${data.name}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCNS-00005: Couldn't create Notification Proposal ${data.name}.`, err)))
}

//Update a Notification Proposal
exports.updateNotificationProposal = function (req, res, next) {
  console.log('Requesting-updateNotificationProposal: ' + req.url + ' ...')
  let data = req.body
  data.id = req.params.id
  const userLogIn = extractTokenProfile(req)
  srvNotificationProposalExist(data.id).then(exists => {
    if (exists) {
      return srvUpdateNotificationProposal(data, userLogIn.userid, next).then((updated) => {
        return srvGetNotificationProposalById(data.id).then((result) => {
          let jsonObj = {
            success: true,
            message: `Notification Proposal ${result.id} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCNS-00007: Couldn't update Notification Proposal ${data.id}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCNS-00008: Couldn't update Notification Proposal ${data.id}.`, err)))
    } else {
      next(new ApiError(422, `ZCNS-00009: Couldn't find Notification Proposal ${data.id} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCNS-00010: Couldn't find Notification Proposal ${data.id} .`, err)))
}

// //Delete a Notification Proposal
exports.deleteNotificationProposal = function (req, res, next) {
  console.log('Requesting-deleteNotificationProposal: ' + req.url + ' ...')
  const id  = req.params.id
  srvNotificationProposalExist(id).then(exists => {
    if (exists) {
      srvDeleteNotificationProposal(id, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Notification Proposal ${id} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCNS-00011: Couldn't delete Notification Proposal ${id}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCNS-00012: Couldn't delete Notification Proposal ${id}.`, err)))
    } else {
      next(new ApiError(422, `ZCNS-00013: Notification Proposal ${id} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCNS-00014: Notification Proposal ${id} not exists.`, err)))
}
