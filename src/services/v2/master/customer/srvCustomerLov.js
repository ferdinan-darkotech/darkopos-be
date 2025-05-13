import db from '../../../../models/tableR'
import { setDefaultQuery } from '../../../../utils/setQuery'
import moment from 'moment'

const tbMemberLov = db.tbl_member_lov
const attribute = {
  mf: ['lov_id', 'lov_desc', 'lov_type', 'active', 'created_by', 'created_at', 'updated_by', 'updated_at'],
  mnf: ['lov_id', 'lov_desc'],
  lov: [['lov_id', 'key'], ['lov_desc', 'label']]
}


export function srvGetSomeDataLov (types, query) {
  const { m, store, ...other } = query
  let queryDefault = setDefaultQuery(attribute.mf, other, true)
  queryDefault.where = { ...queryDefault.where, lov_type: types }

  return tbMemberLov.findAndCountAll({
    attributes: (attribute[m] || attribute.mnf),
    ...queryDefault,
    raw: true,
    order: [['id', 'desc']]
  })
}

export function srvGetDataMemberLov (query) {
  const { m, ...other } = query  
  let queryDefault = setDefaultQuery(tmpAttrs, other, m !== 'lov')

  return tbMemberLov.findAndCountAll({
    attributes: (attribute[m] || attribute.lov),
    ...queryDefault,
    raw: true
  })
}


export function srvGetDataMemberLovByType (type = null, search = '') {
  return tbMemberLov.findAll({
    attributes: attribute.lov,
    where: {
      lov_type: type,
      active: { $eq: true },
      lov_desc: { $iRegexp: search }
    },
    limit: 10,
    raw: true
  })
}

export function srvGetDataMemberLovByID (type = null, _id = null) {
  return tbMemberLov.findOne({
    attributes: attribute.mnf,
    where: { lov_type: type, lov_id: _id, active: { $eq: true } },
    raw: true
  })
}


export function srvCreateDataMemberLov (data, transaction = null) {
  return tbMemberLov.create({
    lov_desc: data.lov_desc,
    lov_type: data.lov_type,
    active: data.active,
    created_by: data.user,
    created_at: moment()
  }, { transaction, returning: ['*'], raw: true })
}

export function srvUpdateDataMemberLov (ids, data, transaction = null) {
  return tbMemberLov.update({
    lov_desc: data.lov_desc,
    active: data.active,
    updated_by: data.user,
    updated_at: moment()
  }, { where: { lov_id: ids }, transaction, returning: ['*'], raw: true })
}