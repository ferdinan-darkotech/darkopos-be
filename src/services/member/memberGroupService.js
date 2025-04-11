import db from '../../models/tableR'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'

const MemberGroup = db.tbl_member_group
const vwMemberGroup = dbv.vw_member_group
const grpFields01 = ['groupCode', 'groupName', 'pendingPayment', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']
const grpFields02 = ['id', 'groupCode', 'groupName', 'pendingPayment', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']

export function getMemberGroupByCode (memberGroupCode) {
  return vwMemberGroup.findOne({
    where: {
      groupCode: memberGroupCode
    }
  })
}

export function getMemberGroupsData (query) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { between: query[key] }
    }
  }
  if (query) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'memberGroupCode')
      query = JSON.parse(str)
    }
    return vwMemberGroup.findAll({
      attributes: grpFields02,
      where: query
    })
  } else {
    return vwMemberGroup.findAll({
      attributes: grpFields02
    })
  }
}

export function setMemberGroupInfo (request) {
  const getMemberGroupInfo = {
    groupCode: request.groupCode,
    groupName: request.groupName,
    pendingPayment: request.pendingPayment
  }

  return getMemberGroupInfo
}

export function memberGroupExists (memberGroupCode) {
  return getMemberGroupByCode(memberGroupCode).then(group => {
    if (group == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createMemberGroup (groupcode, group, createdBy, next) {
  return MemberGroup.create({
    groupCode: groupcode,
    groupName: group.groupName,
    pendingPayment: group.pendingPayment,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateMemberGroup (groupcode, group, updateBy, next) {
  console.log('updateMemberGroup', group.sellPrice)
  return MemberGroup.update({
    groupName: group.groupName,
    pendingPayment: group.pendingPayment,
    updatedBy: updateBy
  },
    { where: { groupCode: groupcode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteMemberGroup (groupcode) {
  return MemberGroup.destroy({
    where: {
      groupCode: groupcode
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteMemberGroups (members) {
  if (!isEmpty(members)) {
    return MemberGroup.destroy({
      where: members
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
