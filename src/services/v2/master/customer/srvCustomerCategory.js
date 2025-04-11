import db from '../../../../models/tableR'
import { setDefaultQuery } from '../../../../utils/setQuery'
import { getNativeQuery } from '../../../../native/nativeUtils'
import moment, { now } from 'moment'

const memberCategory = db.tbl_member_category
const attributes = {
  mf: ['categorycode', 'categoryname', 'createdby', 'active', 'createdat', 'updatedby', 'updatedat'],
  lov: ['categorycode', 'categoryname']
}

// global function
export function srvGetMemberCategoryByCode (code) {
  return memberCategory.findOne({
    attributes: ['id', ...attributes.mf],
    where: { categorycode: code },
    raw: true
  })
}


export function srvGetMemberCategory (query) {
  const { m, store, ...other } = query
  const tmpAttr = m === 'lov' ? attributes[m] : attributes.mf
  let queryDefault = setDefaultQuery(tmpAttr, other, m !== 'lov')
  queryDefault.where = { ...queryDefault.where, ...(m === 'lov' ? { active: true } : {}) }
  return memberCategory.findAndCountAll({
    attributes: tmpAttr,
    ...queryDefault,
    raw: true
  })
}

export function srvCreatedMemberCategory (data, userid) {
  return memberCategory.create({
    categorycode: data.categorycode,
    categoryname: data.categoryname,
    createdby: userid,
    createdat: now(),
    active: data.active
  })
}

export function srvUpdatedMemberCategory (data, userid) {
  return memberCategory.update({
    categoryname: data.categoryname,
    updatedby: userid,
    updatedat: now(),
    active: data.active
  }, { where: { categorycode: data.categorycode } })
}