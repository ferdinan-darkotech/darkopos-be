/**
 * Created by panda .has .my .id on 4/17/27.
 */
import project from '../../../config/project.config'
import { ApiError} from '../../services/v1/errorHandlingService'
import { setMemberGroupInfo, getMemberGroupByCode, memberGroupExists,
  getMemberGroupsData, createMemberGroup, updateMemberGroup, deleteMemberGroup, deleteMemberGroups }
  from '../../services/member/memberGroupService'
import { extractTokenProfile } from '../../services/v1/securityService'

// Retrieve list a Member Group
exports.getGroup = function (req, res, next) {
  console.log('Requesting-getGroup: ' + req.params.id + req.url + ' ...' )
  const groupcode = req.params.id
  console.log('groupcode',groupcode)
  getMemberGroupByCode(groupcode).then((group) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: group
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Member Group ${groupcode}.`, err)))
}

// Retrieve list of Member Group
exports.getGroups = function (req, res, next) {
  console.log('Requesting-getGroups: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getMemberGroupsData(other).then((groups) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(groups)),
      total: groups.length
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Member Groups.`, err)))
}

// Create a new Member Group
exports.insertGroup = function (req, res, next) {
  console.log('Requesting-insertGroup: ' + req.url + ' ...')
  const groupcode = req.params.id
  const group = req.body
  const userLogIn=extractTokenProfile(req)
  memberGroupExists(groupcode).then(exists => {
    if (exists) {
      next(new ApiError(409, `Member Group ${groupcode} already exists.`))
    } else {
      createMemberGroup(groupcode, group, userLogIn.userid, next).then((groupCreated) => {
        return getMemberGroupByCode(groupCreated.groupCode).then((groupByCode) => {
          const groupInfo = setMemberGroupInfo(groupByCode)
          let jsonObj = {
            success: true,
            message: `Member Group ${groupInfo.groupCode} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { group: groupInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find Member Group ${groupcode}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create Member Group ${groupcode}.`, err)))
    }
  })
}

//Update a Member Group
exports.updateGroup = function (req, res, next) {
  console.log('Requesting-updateGroup: ' + req.url + ' ...')
  const groupcode = req.params.id
  let group = req.body
  const userLogIn=extractTokenProfile(req)
  memberGroupExists(groupcode).then(exists => {
    if (exists) {
      return updateMemberGroup(groupcode, group, userLogIn.userid, next).then((groupUpdated) => {
        return getMemberGroupByCode(groupcode).then((groupByCode) => {
          const groupInfo = setMemberGroupInfo(groupByCode)
          let jsonObj = {
            success: true,
            message: `Member Group ${groupByCode.groupCode} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { group: groupInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Member Group ${groupcode}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update Member Group ${groupcode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Member Group ${groupcode}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Member Group ${groupcode}.`, err)))
}

//Delete a Member
exports.deleteGroup = function (req, res, next) {
  console.log('Requesting-deleteGroup: ' + req.url + ' ...')
  const groupcode = req.params.id
  memberGroupExists(groupcode).then(exists => {
    if (exists) {
      return deleteMemberGroup(groupcode).then((groupDeleted) => {
        if (groupDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Member Group ${groupcode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { group: groupDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next( new ApiError(422, `Couldn't delete Member Group ${groupcode}.`) )
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Member Group ${groupcode}}.`, err)))
    } else {
      next( new ApiError(422, `Member Group ${groupcode} not exists.`) )
    }
  }).catch(err => next(new ApiError(422, `Member Group ${groupcode} not exists.`, err)))
}

//Delete some Member Group
exports.deleteGroups = function (req, res, next) {
  console.log('Requesting-deleteMembers: ' + req.url + ' ...')
  let groups = req.body;
  deleteMemberGroups(groups).then((groupDeleted) => {
    if (groupDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Members [ ${groups.groupCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { groups: groupDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next( new ApiError(422, `Couldn't delete Members [ ${groups.groupCode} ].`) )
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Members [ ${groups.groupCode} ].`, err)))
}
