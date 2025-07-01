import project from '../../../../config/project.config'
import { ApiError } from '../../../services/v1/errorHandlingService'
import {
  insertData, insertFieldData, updateFieldData, 
  
  // [NEW]: FERDINAN - 2025-03-03
  createWoProduct,
  fetchWOSPK,
  updateDataWoNotRegister, 
  replaceWoProduct,
  updateEmployeeOnWO
} from '../../../services/service/workorder/woMainService'
import {
  getMinutesCreatedForMember, getWoById, getWoByNo,
  srvGetWoDetail // [NEW]: FERDINAN - 2025-03-03
} from '../../../services/service/workorder/woService'
import { extractTokenProfile } from '../../../services/v1/securityService'
import { srvGetFormSPK } from '../../../services/v2/transaction/srvSpkForm'

// Create a new data
exports.insertData = function (req, res, next) {
  console.log('Requesting-MainWOinsertData: ' + req.url + ' ...')
  const data = req.body
  console.log("req.body", req.body)
  const userLogIn = extractTokenProfile(req)
  return getMinutesCreatedForMember({ memberId: data.header.memberId, policeNoId: data.header.policeNoId }).then(allowExists => {
    if (!allowExists) {
      return insertData(data, userLogIn.userid, next).then((created) => {
        if (created.success) {
          return srvGetFormSPK({wono: created.wono, store: data.header.storeId}).then(spk => {
            let jsonObj = {
              success: true,
              message: created.message,
              spk: spk.data,
              data: created
            }
            res.xstatus(200).json(jsonObj)
          }).catch(err => next(new ApiError(501, `Couldn't find spk.`, err)))
        } else {
          next(new ApiError(501, `Couldn't create wo.`))
        }
      }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
    } else {
      next(new ApiError(422, `Wait 5 minutes for this member`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
}

// Create a new data field
exports.insertDetail = function (req, res, next) {
  console.log('Requesting-insertDataWOMain01: ' + req.url + ' ...')
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  return insertFieldData(data, userLogIn.userid, next).then((created) => {
    return getWoById(req.body.detail[0].woId).then(dataMember => {
      if (created) {
        let jsonObj = {
          success: true,
          message: `Data created`,
          data: dataMember
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(501, `Couldn't create wo.`, err))
      }
    }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
  }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
}

// update a data
exports.updateFieldData = function (req, res, next) {
  console.log('Requesting-updateDataWOMain01: ' + req.url + ' ...')
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  return updateFieldData(data, userLogIn.userid, next).then((created) => {
    if (created) {
      let jsonObj = {
        success: true,
        message: `Data created`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { data: created }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(501, `Couldn't create wo.`, err))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
}


exports.insertDataProduct = function (req, res, next) {
  console.log('Requesting-MainWOinsertDataProduct: ' + req.url + ' ...')
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  
  return createWoProduct(data, userLogIn.userid, null, next).then((created) => {
    if (created.success) {
      let jsonObj = {
        success: true,
        message: created.message,
      }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(501, `Couldn't create wo.`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create wo.`, err)))
}

exports.getWoSPKByWoId = async function (req, res, next) {
  console.log('Requesting-getWoSPKByWoId: ' + req.url + ' ...')

  const id = req.params.id

  try {
    const data = await fetchWOSPK(id)
    if (data) {
      let jsonObj = {
        success: true,
        message: `Data found`,
        data: data
      }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(404, `Couldn't find Data ${id}.`))
    }
  } catch (err) {
    return next(new ApiError(404, `Couldn't find Data ${id}.`, err))
  }
}

// [NEW]: FERDINAN - 2025-03-03
exports.updateDataWo = function (req, res, next) {
  console.log('Requesting-updateDataWO001: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  
  const userLogIn = extractTokenProfile(req)
  return srvGetWoDetail(id).then(curr => {
    if (curr) {
      data.header.woid = id
      return updateDataWoNotRegister(id, data, userLogIn.userid).then((updated) => {
        if(updated.success) {
          let jsonObj = {
            success: true,
            message: `Data updated`,
            detailModifier: updated.detail,
            checksModifier: updated.checks
          }
          res.xstatus(200).json(jsonObj)
        } else {
          throw new Error(updated.message)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

exports.updateDataWoProduct = function (req, res, next) {
  console.log('Requesting-updateDataWOProduct001: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  
  const userLogIn = extractTokenProfile(req)
  return srvGetWoDetail(id).then(curr => {
    console.log('curr', curr)
    if (curr) {
      return replaceWoProduct(id, data, userLogIn.userid).then((updated) => {
        if(updated.success) {
          let jsonObj = {
            success: true,
            message: `Data updated`,
            detailModifier: updated.detail,
            checksModifier: updated.checks
          }
          res.xstatus(200).json(jsonObj)
        } else {
          throw new Error(updated.message)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

export const updateEmployeWo = function (req, res, next) {
  console.log('Requesting-updateEmployeWo: ' + req.url + ' ...')
  const id = req.params.id
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  return updateEmployeeOnWO(id, userLogIn.userid, data).then((updated) => {
    if(updated.success) {
      let jsonObj = {
        success: true,
        message: `Data updated`
      }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(501, `Couldn't update wo.`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't update wo.`, err)))
}