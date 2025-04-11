import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { getMiscByCodeName } from '../../../v1/miscService'
import { srvGetFinancialProviderByCode } from '../../master/finance/srvFinancialProvider'
import moment from 'moment'
const Op = require('sequelize').Op
const table = db.tbm_edc_machine
const view = dbv.vw_edc_machine

const idField = ['id']
const minFields01 = [
  'code',
  'name'
]
const minFields02 = [
  'code',
  'status',
  'surchargeOnUs',
  'surchargeOffUs'
]
const minFields03 = [
  'code',
  'name'
]
const mainFields = [
  'id',
  'code',
  'providerCode',
  'name',
  'status',
  'surchargeOnUs', 'surchargeOffUs',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

export async function srvGetEDCMachines (query) {
  let { pageSize, page, order, searchText, ...other } = query
  let sort = (order) ? getSelectOrder(order) : null
  let where = { 
    code: {
      [Op.regexp]: searchText ? searchText : ''
    }
  } // let where = { status:1 }

  let modeField = 'min'
  let limitQuery = {
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
  }
  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (mode.includes('mf')) modeField = 'main'
    if (mode.includes('ar')) limitQuery = {}
    if (mode.includes('lov')) { modeField = 'lov'; limitQuery = {}; sort = [] }
  }
  let attributes = minFields01
  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'min': attributes = minFields01; break
    case 'lov': attributes = minFields03; break
    default: attributes = minFields01
  }
  
  return view.findAndCountAll({
    attributes,
    where,
    order: sort,
    ...limitQuery,
    raw: false
  })
}

export async function srvGetEDCMachineByCode (code, modeField) {
  let attributes = minFields02
  switch (modeField) {
    case 'main': attributes = mainFields; break
    case 'min': attributes = minFields01; break
    case 'getid': attributes = idField; break
    default: attributes = minFields02
  }

  return view.findOne({
    attributes,
    where: { code },
    raw: false
  })
}

export async function srvGetEDCMachineById (id) {
  return view.findOne({
    attributes: minFields01,
    where: { id },
    raw: false
  })
}

export function srvEDCMachineExist (code) {
  return srvGetEDCMachineByCode(code).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateEDCMachine (data, createdBy, next) {
  const edc = await srvGetFinancialProviderByCode(data.providerCode, 'main')
  return table.create({
    code: data.code,
    providerId: edc.id,
    status: +data.status,
    surchargeOnUs: 0,
    surchargeOffUs: 0,
    createdBy: createdBy,
    createdAt: moment(),
    updatedBy: null
  }).catch(err => {
    console.log(err)
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateEDCMachine (data, updatedBy, next) {
  const edc = await srvGetFinancialProviderByCode(data.providerCode, 'main')
  return table.update({
    providerId: edc.id,
    status: +data.status,
    surchargeOnUs: data.surchargeOnUs,
    surchargeOffUs: data.surchargeOffUs,
    updatedBy: updatedBy,
    updatedAt: moment()
  }, {
    where: { code: data.code }
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const {
      parent,
      original,
      sql,
      ...other
    } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvDeleteEDCMachine (code) {
  return table.destroy({
    where: { code }
  }).catch(err => (next(new ApiError(501, err, err))))
}
