import sequelize, { Op } from 'sequelize'

import vw from '../../../../models/view'
import tbl from '../../../../models/tableR'
import moment from 'moment'
import { getNativeQuery } from '../../../../native/nativeUtils'

const vwMember = vw.vw_employee
const vwMechanicTool = vw.vw_mechanic_tool

// [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
const vwMechanicToolInventory = vw.vw_mechanic_tool_inventory

const tblMechanicTool = tbl.tbl_mechanic_tool
const tblMechanicToolLog = tbl.tbl_mechanic_tool_log

const mechanicsAttr = ['id', 'employeeId', 'employeeName', 'positionId', 'positionName', 'positionCode']

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

export const addNewToolOnMechanic = async (payload, user) => {
  const body = {
    ...payload,
    createdat: moment(),
    createdby: user
  }

  return await tblMechanicTool.create(body)
}

export const fetchMechanicToolsByEmployeeCode = async (employeecode, query, pagination) => {
  const { pageSize, page } = pagination

  return await vwMechanicTool.findAndCountAll({
    where: {
      ...(query.q ? { 
        [Op.or]: [
          { toolname: { [Op.iLike]: `%${query.q || ''}%` } },
          { unit: { [Op.iLike]: `%${query.q || ''}%` } },
          { description: { [Op.iLike]: `%${query.q || ''}%` } },
          { employeename: { [Op.iLike]: `%${query.q || ''}%` } },
          { createdby: { [Op.iLike]: `%${query.q || ''}%` } },

          // [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
          { toolcode: { [Op.iLike]: `%${query.q || ''}%` } }
        ]
      }: {}),
      employeecode
    },
    limit: parseInt(pageSize || 6),
    offset: (parseInt(page || 1) - 1) * parseInt(pageSize || 6),
    order: [['createdat', 'desc']]
  })
}

export const fetchAllMechanicToolsByEmployeeCode = async (employeecode) => {
  return await vwMechanicTool.findAll({
    where: {
      employeecode
    },
    order: [['createdat', 'desc']]
  })
}

export const fetchMechanicTools = async (query, pagination) => {
  const { pageSize, page } = pagination

  return await vwMechanicTool.findAndCountAll({
    where: {
      ...(query.q ? { 
        [Op.or]: [
          { toolname: { [Op.iLike]: `%${query.q || ''}%` } },
          { unit: { [Op.iLike]: `%${query.q || ''}%` } },
          { description: { [Op.iLike]: `%${query.q || ''}%` } },
          { employeename: { [Op.iLike]: `%${query.q || ''}%` } },
          { createdby: { [Op.iLike]: `%${query.q || ''}%` } },

          // [CONNECT TOOL INVENTORY FROM ERP]: FERDINAN - 11/07/2025
          { toolcode: { [Op.iLike]: `%${query.q || ''}%` } }
        ]
      }: {}),
      storecode: query.storecode
    },
    limit: parseInt(pageSize || 10, 10),
    offset: (parseInt(page || 1, 10) - 1) * parseInt(pageSize || 10, 10),
    order: [['employeename', 'asc'], ['createdat', 'desc']]
  })
}

export const fetchAllMechanicTools = async (storecode) => {
  return await vwMechanicTool.findAll({
    where: { storecode },
    order: [['employeename', 'asc'], ['createdat', 'desc']]
  })
}

export const fetchOneMechanicTool = async (id) => {
  return await tblMechanicTool.findOne({ where: { id }, raw: true })
}

// export const addSoftRemoveMechanicTool = async (mechanictoolid, payload, user) => {
//   const mechanictool = await fetchOneMechanicTool(mechanictoolid)
//   const { id, ...rest } = mechanictool
//   const body = {
//     ...rest,
//     ...payload,
//     mechanictoolid: Number(mechanictoolid),
//     deletedat: moment(),
//     deletedby: user
//   }

//   return await tblMechanicToolLog.create(body)
// }

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