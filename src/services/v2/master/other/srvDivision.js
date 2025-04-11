import db from '../../../../models/tableR'
import { setDefaultQuery } from '../../../../utils/setQuery'
import moment from 'moment'

const dbDivision = db.tbl_division
const attribute = {
  mf: ['id', 'divcode', 'divname', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
  lov: ['divcode', 'divname']
}

const tmpAttributes = (attr) => {
  let tmpAttr = [...attr]
  tmpAttr.splice(0, 1)
  return tmpAttr
}
export function srvGetDataDivision (query) {
  const { m, ...other } = query
  let tmpAttrs = m !== 'lov' ? tmpAttributes(attribute.mf) : attribute.lov
  let queryDefault = setDefaultQuery(tmpAttrs, other, m !== 'lov')
  return dbDivision.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvGetDataDivisionByCode (code) {
  return dbDivision.findOne({
    attributes: attribute.mf,
    where: { divcode: code },
    raw: true
  })
}

export function srvCreateDataDivision (data) {
  return dbDivision.create({
    divcode: data.divcode,
    divname: data.divname,
    createdby: data.user,
    createdat: moment()
  })
}


export function srvUpdateDataDivision (data, code) {
  return dbDivision.update({
    divname: data.divname,
    updatedby: data.user,
    updatedat: moment()
  }, { where: { divcode: code } })
}