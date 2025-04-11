import db from '../../../../models/tableR'
import { setDefaultQuery } from '../../../../utils/setQuery'
import moment from 'moment'

const dbDepartment = db.tbl_department
const attribute = {
  mf: ['id', 'deptcode', 'deptname', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
  lov: ['deptcode', 'deptname']
}

const tmpAttributes = (attr) => {
  let tmpAttr = [...attr]
  tmpAttr.splice(0, 1)
  return tmpAttr
}
export function srvGetDataDepartment (query) {
  const { m, ...other } = query
  let tmpAttrs = m !== 'lov' ? tmpAttributes(attribute.mf) : attribute.lov
  let queryDefault = setDefaultQuery(tmpAttrs, other, m !== 'lov')
  return dbDepartment.findAndCountAll({
    attributes: tmpAttrs,
    ...queryDefault,
    raw: true
  })
}

export function srvGetDataDepartmentByCode (code) {
  return dbDepartment.findOne({
    attributes: attribute.mf,
    where: { deptcode: code },
    raw: true
  })
}

export function srvCreateDataDepartment (data) {
  return dbDepartment.create({
    deptcode: data.deptcode,
    deptname: data.deptname,
    createdby: data.user,
    createdat: moment()
  })
}


export function srvUpdateDataDepartment (data, code) {
  return dbDepartment.update({
    deptname: data.deptname,
    updatedBy: data.user,
    updatedat: moment()
  }, { where: { deptcode: code } })
}