import db from '../../../models/tableR'
import { setDefaultQuery } from '../../../utils/setQuery'
import moment from 'moment'

const dbArea = db.tbl_area
const attribute = {
  mf: ['id', 'areacode', 'areaname', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'sync_data'],
  lov: ['areacode', 'areaname']
}

const tmpAttributes = (attr) => {
  let tmpAttr = [...attr]
  tmpAttr.splice(0, 1)
  return tmpAttr
}
export function srvGetDataArea (query) {
  const { m, ...other } = query
  let tmpAttrs = m !== 'lov' ? tmpAttributes(attribute.mf) : attribute.lov
  let queryDefault = setDefaultQuery(tmpAttrs, other, m !== 'lov')
  return dbArea.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvGetDataAreaByCode (code) {
  return dbArea.findOne({
    attributes: attribute.mf,
    where: { areacode: code },
    raw: true
  })
}

export function srvCreateDataArea (data) {
  return dbArea.create({
    areacode: data.areacode,
    areaname: data.areaname,
    createdBy: data.user,
    createdAt: moment(),
    sync_data: false
  })
}


export function srvUpdateDataArea (data, code) {
  return dbArea.update({
    areaname: data.areaname,
    updatedBy: data.user,
    updatedAt: moment()
  }, { where: { areacode: code } })
}