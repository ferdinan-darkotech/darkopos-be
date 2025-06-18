// [MASTER PRODUCT GROUP]: FERDINAN - 16/06/2025
import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
  setStockGroupInfo, getStockGroupByCode, stockGroupExists,
  getStockGroupsData, checkParent, getStockGroupsParent, createStockGroup, updateStockGroup, deleteStockGroup, deleteStockGroups,
  srvGroupProducts
} from '../services/stockGroupService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrieve list a brand
exports.getGroup = function (req, res, next) {
  console.log('Requesting-getGroup: ' + req.url + ' ...')
  const groupcode = req.params.id
  getStockGroupByCode(groupcode).then((group) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: group
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Stock Group ${groupcode}.`, err)))
}

// Retrieve list of brands
exports.getGroups = function (req, res, next) {
  console.log('Requesting-getGroups: ' + req.url + ' ...')
  let { pageSize, page, id, type, ...other } = req.query
  if (type === 'lov') {
    // checkParent(id).then((checked) => {
    //   if (checked.length === 0) {
    //     return getStockGroupsParent(id).then((groups) => {
    //       res.xstatus(200).json({
    //         success: true,
    //         message: 'Ok',
    //         total: groups.length,
    //         data: groups
    //       })
    //     }).catch(err => next(new ApiError(422, `Couldn't find Groups.`, err)))
    //   } else {
    //     return getStockGroupsParent(id).then((groups) => {
    //       res.xstatus(200).json({
    //         success: true,
    //         message: 'Ok',
    //         total: [],
    //         data: []
    //       })
    //     }).catch(err => next(new ApiError(422, `Couldn't find Groups.`, err)))
    //   }
    // }).catch(err => next(new ApiError(422, `Couldn't find Groups.`, err)))
    return getStockGroupsParent(id).then((groups) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: groups.length,
        data: groups
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Groups.`, err)))
  } else {
    getStockGroupsData(other).then((groups) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: groups.length,
        data: groups
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Groups.`, err)))
  }
}

// Create a new brand
exports.insertGroup = function (req, res, next) {
  console.log('Requesting-insertGroup: ' + req.url + ' ...')
  const groupcode = req.params.id
  const group = req.body
  const userLogIn = extractTokenProfile(req)
  stockGroupExists(groupcode).then(exists => {
    if (exists) {
      next(new ApiError(409, `Group ${groupcode} already exists.`))
    } else {
      createStockGroup(groupcode, group, userLogIn.userid, next).then((groupCreated) => {
        return getStockGroupByCode(groupCreated.groupCode).then((groupByCode) => {
          const groupInfo = setStockGroupInfo(groupByCode)
          let jsonObj = {
            success: true,
            message: `Group ${groupInfo.groupCode} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { brand: groupInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find Stock Group ${groupcode}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create Stock Group ${groupcode}.`, err)))
    }
  })
}

//Update a Group
exports.updateGroup = function (req, res, next) {
  console.log('Requesting-updateGroup: ' + req.url + ' ...')
  const groupcode = req.params.id
  let group = req.body
  const userLogIn = extractTokenProfile(req)
  stockGroupExists(groupcode).then(exists => {
    if (exists) {
      return updateStockGroup(groupcode, group, userLogIn.userid, next).then((groupUpdated) => {
        return getStockGroupByCode(groupcode).then((groupByCode) => {
          const groupInfo = setStockGroupInfo(groupByCode)
          let jsonObj = {
            success: true,
            message: `User ${groupByCode.groupCode} - ${groupByCode.groupName}  updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { group: groupInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Group ${groupcode}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update brand ${groupcode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Group ${groupcode}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Group ${groupcode}.`, err)))
}

//Delete a Group
exports.deleteGroup = function (req, res, next) {
  console.log('Requesting-deleteGroup: ' + req.url + ' ...')
  const groupcode = req.params.id
  stockGroupExists(groupcode).then(exists => {
    if (exists) {
      return deleteStockGroup(groupcode).then((groupDeleted) => {
        if (groupDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Group ${groupcode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { group: groupDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Group ${groupcode}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Group ${groupcode}}.`, err)))
    } else {
      next(new ApiError(422, `Group ${groupcode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Group ${groupcode} not exists.`, err)))
}

//Delete some Group
exports.deleteGroups = function (req, res, next) {
  console.log('Requesting-deleteGroups: ' + req.url + ' ...')
  let groups = req.body;
  deleteStockGroups(groups).then((groupDeleted) => {
    if (groupDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Groups [ ${groups.groupCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { groups: groupDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Groups [ ${groups.groupCode} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Groups [ ${groups.groupCode} ].`, err)))
}
exports.getGroupProducts = function (req, res, next) {
  console.log('Requesting-getGroup: ' + req.url + ' ...')
  const groupcode = req.params.id
  srvGroupProducts(groupcode).then((group) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: group[0].length,
      data: group[0]
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Stock Group ${groupcode}.`, err)))
}