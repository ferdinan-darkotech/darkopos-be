import sequelize, { Op } from 'sequelize'

import vw from '../../../../models/view'
import tbl from '../../../../models/tableR'
import moment from 'moment'
import { getNativeQuery } from '../../../../native/nativeUtils'

const vwMember = vw.vw_employee
const vwMechanicTool = vw.vw_mechanic_tool

// [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
const vwMechanicToolInventory = vw.vw_mechanic_tool_inventory

// [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
const vwMechanicToolSaldo = vw.vw_mechanic_tool_report

const tblMechanicTool = tbl.tbl_mechanic_tool
const tblMechanicToolLog = tbl.tbl_mechanic_tool_log

const mechanicsAttr = ['id', 'employeeId', 'employeeName', 'positionId', 'positionName', 'positionCode']
const mechanicSaldoAttr = ['employeecode', 'employeename', 'storecode', 'storename', 'toolcode', 'toolname', 'tahun', 'bulan', 'saldo_awal', 'beli', 'hapus', 'saldo_akhir', 'unit']

export const fetchMechanics = async (query) => {
    return await vwMember.findAll({
        attributes: mechanicsAttr,
        where: {
          [Op.and]: [
            {'': sequelize.literal(`jsonb_extract_path(storelistid, ${query.store}::text) is not null`)}
          ]
        },
        order: [['id', 'desc']],
        raw: false
    })
}

// [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
export const fetchMechanicToolByToolAndMechanic = async (toolcode, employeecode) => {
  return await vwMechanicTool.findOne({ where: { toolcode, employeecode }, raw: true })
}

export const addNewToolOnMechanic = async (payload, user) => {
  const body = {
    ...payload,
    createdat: moment(),
    createdby: user
  }

  return await tblMechanicTool.create(body)
}

const checkView = (type) => {
  if (type === 'saldo') {
    return vwMechanicToolSaldo
  } else if (type === 'detail') {
    return vwMechanicTool
  }
}

export const fetchMechanicToolsByEmployeeCode = async (employeecode, query, pagination) => {
  const { pageSize, page } = pagination
  const type = query.type || 'detail'
  let view = checkView(type) // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025

  const currentMonth = moment().format('MM')
  const currentYear = moment().format('YYYY')

  return await view.findAndCountAll({
    ...(type === 'saldo' ? { attributes: mechanicSaldoAttr } : {}), // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
    where: {
      ...(query.q ? { 
        [Op.or]: [
          { toolname: { [Op.iLike]: `%${query.q || ''}%` } },
          { unit: { [Op.iLike]: `%${query.q || ''}%` } },
          ...(type === 'saldo' ? []: [
            { description: { [Op.iLike]: `%${query.q || ''}%` } }, 
            { createdby: { [Op.iLike]: `%${query.q || ''}%` } }
          ]),
          { employeename: { [Op.iLike]: `%${query.q || ''}%` } },

          // [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
          { toolcode: { [Op.iLike]: `%${query.q || ''}%` } }
        ]
      }: {}),
      employeecode,
      storecode: query.storecode,

      // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
      ...(type === 'saldo' ? { tahun: query.year || currentYear, bulan: query.month || currentMonth } : {})
    },
    limit: parseInt(pageSize || 6),
    offset: (parseInt(page || 1) - 1) * parseInt(pageSize || 6),
    ...(type === 'detail' ? { order: [['createdat', 'desc']] } : {}) // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
  })
}

export const fetchAllMechanicToolsByEmployeeCode = async (employeecode, query) => {
  const type = query.type || 'detail'
  const storecode = query.storecode
  let view = checkView(type) // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025

  // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
  const currentMonth = moment().format('MM')
  const currentYear = moment().format('YYYY')

  return await view.findAll({
    ...(type === 'saldo' ? { attributes: mechanicSaldoAttr } : {}),
    where: {
      employeecode,
      storecode,

      // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
      ...(type === 'saldo' ? { tahun: query.year || currentYear, bulan: query.month || currentMonth } : {})
    },
    // order: [['createdat', 'desc']]
    ...(type === 'detail' ? { order: [['createdat', 'desc']] } : {}) // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
  })
}

export const fetchMechanicTools = async (query, pagination) => {
  const { pageSize, page } = pagination
  const type = query.type || 'detail'
  let view = checkView(type || 'detail') // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025

  // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
  const currentMonth = moment().format('MM')
  const currentYear = moment().format('YYYY')

  return await view.findAndCountAll({
    ...(type === 'saldo' ? { attributes: mechanicSaldoAttr } : {}), // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
    where: {
      ...(query.q ? { 
        [Op.or]: [
          { toolname: { [Op.iLike]: `%${query.q || ''}%` } },
          { unit: { [Op.iLike]: `%${query.q || ''}%` } },
          ...(type === 'saldo' ? []: [
            { description: { [Op.iLike]: `%${query.q || ''}%` } }, 
            { createdby: { [Op.iLike]: `%${query.q || ''}%` } }
          ]),
          { employeename: { [Op.iLike]: `%${query.q || ''}%` } },

          // [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
          { toolcode: { [Op.iLike]: `%${query.q || ''}%` } }
        ]
      }: {}),
      storecode: query.storecode,

      // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
      ...(type === 'saldo' ? { tahun: query.year || currentYear, bulan: query.month || currentMonth } : {})
    },
    limit: parseInt(pageSize || 10, 10),
    offset: (parseInt(page || 1, 10) - 1) * parseInt(pageSize || 10, 10),
    // order: [['employeename', 'asc'], ['createdat', 'desc']]
    ...(type === 'detail' ? { order: [['employeename', 'asc'], ['createdat', 'desc']] } : {})
  })
}

export const fetchAllMechanicTools = async (storecode, query) => {
  const type = query.type || 'detail'
  let view = checkView(type) // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025

  // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
  const currentMonth = moment().format('MM')
  const currentYear = moment().format('YYYY')

  return await view.findAll({
    ...(type === 'saldo' ? { attributes: mechanicSaldoAttr } : {}), // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
    where: { 
      storecode,

      // [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
      ...(type === 'saldo' ? { tahun: query.year || currentYear, bulan: query.month || currentMonth } : {}) 
    },
    // order: [['employeename', 'asc'], ['createdat', 'desc']]
    ...(type === 'detail' ? { order: [['employeename', 'asc'], ['createdat', 'desc']] } : {})
  })
}

export const fetchOneMechanicTool = async (id) => {
  return await tblMechanicTool.findOne({ where: { id }, raw: true })
}

export const updateSoftRemoveMechanicTool = async (mechanictoolid, employeecode, payload) => {
  return await tblMechanicToolLog.update(payload, { where: { mechanictoolid, employeecode } })
}

export const removeMechanicTool = async (id, employeecode) => {
  return await tblMechanicTool.destroy({ where: { id, employeecode } })
}

// [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
export const fetchMechanicToolsInventory = async (query, pagination) => {
  const { pageSize, page } = pagination

  return await vwMechanicToolInventory.findAndCountAll({
    attributes: ['kode_barang', 'nama_barang', 'nama_lain', 'input_dt'],
    where: {
      ...(query.q ? { 
        [Op.or]: [
          { kode_barang: { [Op.iLike]: `%${query.q || ''}%` } },
          { nama_barang: { [Op.iLike]: `%${query.q || ''}%` } },
          { nama_lain: { [Op.iLike]: `%${query.q || ''}%` } },
        ]
      }: {}),
    },
    limit: parseInt(pageSize || 10, 10),
    offset: (parseInt(page || 1, 10) - 1) * parseInt(pageSize || 10, 10),
    order: [['input_dt', 'DESC']] 
  })
}

// [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
export async function createSaldoAwalMehanicTools ({ tahun, bulan, createdby }) {
  const sSql = `select * from sch_pos.fn_generate_saldo_awal_mechanic_tool('${tahun}', '${bulan}'${createdby ? `, '${createdby}'` : ''}) val;`
  const result = await getNativeQuery(sSql, true, 'RAW', null)
  return result
}

// [MECHANIC TOOLS REPORT]: FERDINAN - 15/07/2025
export async function fetchMonthAndYearSaldoPeriod(query) {
  const { employeecode, storecode } = query

  return await vwMechanicToolSaldo.findAll({
    where: {
      storecode,
      ...(employeecode ? { employeecode } : {})
    },
    attributes: ['tahun', 'bulan'], 
    group: ['tahun', 'bulan'],
    order: [['tahun', 'asc'], ['bulan', 'asc']] 
  })
}
