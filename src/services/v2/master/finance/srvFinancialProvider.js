import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import sequelize from '../../../../native/sequelize'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { getMiscByCodeName } from '../../../v1/miscService'

const Op = require('sequelize').Op
const table = db.tbm_financial_provider
const view = dbv.vw_financial_provider

const minFields01 = [
  'code',
  'name'
]
const minFields02 = [
  'code',
  'name',
  'status',
  'providerTypeName',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const mainFields = [
  'id',
  'code',
  'name',
  'providerType',
  'providerTypeCode',
  'providerTypeName',
  'status',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

export async function srvGetFinancialProviders (query) {
  let { pageSize, page, order, searchText, ...other } = query
  
  let sort = (order) ? getSelectOrder(order) : null
  let where = { 
    code: {
      [Op.regexp]: searchText ? searchText : ''
    }
  }
  // const providerType = (q) ? await getMiscByCodeName('FINPROV', JSON.parse(q).providerType) : null
  // if (providerType) where.providerType = providerType.id

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
    case 'min': attributes = minFields02; break
    case 'lov': attributes = minFields01; break
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

export async function srvGetFinancialProviderByCode (code, mode) {
  return view.findOne({
    attributes: (mode==='main') ? mainFields : minFields01,
    where: { code },
    raw: false
  })
}

export async function srvGetFinancialProviderById (id) {
  return table.findOne({
    attributes: minFields01,
    where: { id },
    raw: false
  })
}

export function srvFinancialProviderExist (code) {
  return srvGetFinancialProviderByCode(code).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export async function srvCreateFinancialProvider (data, createdBy, next) {
  const providerType = await getMiscByCodeName('FINPROV', data.providerType)
  return table.create({
    code: data.code,
    name: data.name,
    providerType: providerType.id,
    status: +data.status,
    createdBy: createdBy,
    updatedBy: null
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export async function srvUpdateFinancialProvider (data, updatedBy, next) {
  const providerType = await getMiscByCodeName('FINPROV', data.providerType)
  return table.update({
    name: data.name,
    providerType: providerType.id,
    status: +data.status,
    updatedBy: updatedBy
  }, {
    where: { code: data.code }
  }).catch(err => {
    console.log(err)
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

export function srvDeleteFinancialProvider (code) {
  return table.destroy({
    where: { code }
  }).catch(err => (next(new ApiError(501, err, err))))
}
