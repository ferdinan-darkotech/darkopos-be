import tb from '../../../../models/tableR'
import vwi from '../../../../models/viewR'
import vw from '../../../../models/view'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { Op, remapFilter } from '../../../../native/sequelizeOp'
import { isEmptyObject } from '../../../../utils/operate/objOpr'
import { switchModeField } from '../../function/srvUtils'
import { srvGetCityByCode } from '../general/srvCity'
import { srvGetJobRoleByCode } from '../humanresource/srvJobRole'
import { getNativeQuery } from '../../../../native/nativeUtils'
import moment from 'moment'
import sequelize from 'sequelize'

const table = tb.tbl_employee
const view = vw.vw_employee

const idField = ['id']
const minFieldsMnf = [
  'employeeId',
  'employeeName',
  'phoneNumber',
  'mobileNumber'
]
const minFields01 = [
  'employeeId',
  'employeeName'
]
const minFields02 = [
  'employeeId',
  'employeeName',
  'positionName',
  'address01',
  'address02',
  'cityName',
  'email'
]
const mainFields = [
  'employeeId', 'employeeName', 'idType', 'idNo', 'positionId', 'positionCode', 'positionName',
  'address01', 'address02', 'cityId', 'cityCode', 'cityName', 'state', 'zipCode', 'mobileNumber', 'phoneNumber', 'email',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'storelistid', 'liststores', 'prov_nama',
  'kab_nama', 'kec_nama', 'kel_nama', 'kel_id', 'zipcode', 'status'
]
const mainViewFields = [
  'employeeId', 'idType', 'idNo', 'employeeName', 'positionCode', 'positionName',
  'address01', 'address02', 'cityCode', 'cityName', 'mobileNumber', 'phoneNumber', 'email',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'storelistid', 'liststores', 'prov_nama',
  'kab_nama', 'kec_nama', 'kel_nama', 'kel_id', 'zipcode', 'status'
]



function modifyEmployeeStore (employee, data = []) {
  const sSql = `select * from sch_pos.fn_modify_employee_store ('${employee}', '${JSON.stringify(data)}')`
  return getNativeQuery(sSql,false, 'RAW').then(result => {
    return { success: true, data: result[0][0].fn_modify_employee_store }
  }).catch(er => {
    return { success: false, message: er.message }
  })
}

export function srvGetEmployeeForReports () {
  return view.findAll({
    attributes: [
      'employeeId', 'employeeName', 'idType', 'idNo', 'positionName', 'liststores',
      'address01', 'address02', 'mobileNumber', 'phoneNumber', 'email', 'status'
    ],
    order: [['id', 'asc']],
    raw: false
  })
}


export async function srvGetEmployees (query, filter = false) {
  let { pageSize, page, order, q, store, activeOnly, ...other } = query
  let sort = (order) ? getSelectOrder(order) : null
  let where = { deletedAt: { [Op.eq]: null } } // let where = { status:1 }
  const { m, ...condition } = other

  
  if (filter && !isEmptyObject(condition)) {
    where = remapFilter(condition)
  }

  let modeField = 'min'
  let limitQuery = {
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
  }

  if (m) {
    const mode = m.split(',')
    if (mode.includes('mf')) modeField = 'main'
    if (mode.includes('bf')) modeField = 'brow'
    if (mode.includes('ar')) limitQuery = {}
    if (mode.includes('lov')) { modeField = 'lov'; limitQuery = {}; sort = [] }
    if (mode.includes('mnf')) { modeField = 'mnf'; limitQuery = {}; sort = [] }
  }
  let attributes = minFields01
  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minFields01; break
    case 'lov': attributes = minFields01; break
    case 'mnf': attributes = minFieldsMnf; break
    default: attributes = minFields01
  }

  if((activeOnly || false).toString() === 'true') {
    where = [
      ...where,
      { status: { $eq: true } }
    ]
  }

  return view.findAndCountAll({
    attributes,
    where: {
      $and: [
        ...where,
        (store ? {'': sequelize.literal(`jsonb_extract_path(storelistid, ${store}::text) is not null`)} : {})
      ],
    },
    order: [['id', 'asc']],
    ...limitQuery,
    raw: false
  })
}

export async function srvGetEmployeeByEmpId (empId, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = minFields02
  let where = { employeeId: empId, deletedAt: { [Op.eq]: null } }
  const modeField = switchModeField(other)

  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'brow': attributes = mainViewFields; break
    case 'min': attributes = minFields01; break
    case 'getid': attributes = idField; break
    default: attributes = minFields02
  }
  // if sdel = show deleted row
  if (modeField === 'sdel') delete where.deletedAt

  return view.findOne({
    attributes,
    where,
    raw: false
  })
}

export function srvGetSomeEmployeeByEId (empId) {
  return table.findAll({
    attributes: [...idField,...minFields01],
    where: { employeeId: { $in: empId } },
    raw: false
  })
}

export async function srvGetEmployeeById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: false
  })
}

export async function srvGetEmployeeByCode (code) {
  return table.findOne({
    attributes: [ ...idField, minFields01 ],
    where: { employeeId: code },
    raw: true
  })
}

export function srvEmployeeExist (empId) {
  return srvGetEmployeeByEmpId(empId).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateEmployee (data, createdBy, next) {
  // const city = await srvGetCityByCode(data.cityCode, { m: 'gid' })
  const position = await srvGetJobRoleByCode(data.positionCode, { m: 'gid' })
  const employee = await table.create({
    employeeId: data.employeeId,
    idNo: data.idNo,
    idType: data.idType,
    employeeName: data.employeeName,
    positionId: position.id,
    address01: data.address01,
    address02: data.address02,
    // cityId: city.id,
    kelid: data.kelid,
    // state: data.state,
    // zipCode: data.zipCode,
    status: data.status,
    mobileNumber: data.mobileNumber,
    phoneNumber: data.phoneNumber,
    email: data.email,
    storeid: data.storeid,
    createdBy: createdBy,
    createdAt: moment(),
    updatedBy: '---'
  })

  const storeEmployee = await modifyEmployeeStore(data.employeeId, data.listStores)
  return employee
}

export async function srvUpdateEmployee (data, updatedBy, next) {
  // const city = await srvGetCityByCode(data.cityCode, { m: 'gid' })
  const position = await srvGetJobRoleByCode(data.positionCode, { m: 'gid' })
  const employee = await table.update({
    idNo: data.idNo,
    idType: data.idType,
    employeeName: data.employeeName,
    positionId: position.id,
    address01: data.address01,
    address02: data.address02,
    // cityId: city.id,
    kelid: data.kelid,
    // state: data.state,
    // zipCode: data.zipCode,
    status: data.status,
    mobileNumber: data.mobileNumber,
    phoneNumber: data.phoneNumber,
    email: data.email,
    storeid: data.storeid,
    updatedBy: updatedBy,
    updatedAt: moment()
  }, {
    where: {
      employeeId: data.empId,
      deletedAt: { [Op.eq]: null }
    }
  })

  const storeEmployee = await modifyEmployeeStore(data.employeeId, data.listStores)
  return employee
}

export function srvDeleteEmployee (employeeId, next) {
  return table.destroy({
    where: { employeeId }
  }).catch(err => {
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSEP-00003'
    next(new ApiError(400, err, err))
  })
}