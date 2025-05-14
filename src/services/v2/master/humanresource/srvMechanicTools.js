import sequelize, { Op } from 'sequelize'

import vw from '../../../../models/view'
import tbl from '../../../../models/tableR'
import moment from 'moment'

const vwMember = vw.vw_employee
const vwMechanicTool = vw.vw_mechanic_tool

const tblMechanicTool = tbl.tbl_mechanic_tool
const tblMechanicToolLog = tbl.tbl_mechanic_tool_log

const mechanicsAttr = ['id', 'employeeId', 'employeeName', 'positionId', 'positionName', 'positionCode']

export const fetchMechanics = async (query) => {
    return await vwMember.findAll({
        attributes: mechanicsAttr,
        where: {
          [Op.and]: [
            {
                positionname: 'MECHANIC',
                positioncode: 'MECH'
            },
            {'': sequelize.literal(`jsonb_extract_path(storelistid, ${query.store}::text) is not null`)}
          ],
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

export const fetchMechanicToolsByEmployeeCode = async (employeecode, query) => {
  return await vwMechanicTool.findAll({
    where: {
      ...(query.q ? { 
        [Op.or]: [
          { toolname: { [Op.iLike]: `%${query.q || ''}%` } },
          { noreference: { [Op.iLike]: `%${query.q || ''}%` } },
          { description: { [Op.iLike]: `%${query.q || ''}%` } },
          { employeename: { [Op.iLike]: `%${query.q || ''}%` } },
          { createdby: { [Op.iLike]: `%${query.q || ''}%` } }
        ]
      }: {}),
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
          { noreference: { [Op.iLike]: `%${query.q || ''}%` } },
          { description: { [Op.iLike]: `%${query.q || ''}%` } },
          { employeename: { [Op.iLike]: `%${query.q || ''}%` } },
          { createdby: { [Op.iLike]: `%${query.q || ''}%` } }
        ]
      }: {}),
      storecode: query.storecode
    },
    limit: parseInt(pageSize || 10, 10),
    offset: (parseInt(page || 1, 10) - 1) * parseInt(pageSize || 10, 10),
    order: [['toolname', 'asc']]
  })
}

export const fetchOneMechanicTool = async (id) => {
  return await tblMechanicTool.findOne({ where: { id }, raw: true })
}

export const addSoftRemoveMechanicTool = async (mechanictoolid, payload, user) => {
  const mechanictool = await fetchOneMechanicTool(mechanictoolid)
  console.log('mechanictool >>> ', mechanictool)
  const { id, ...rest } = mechanictool
  const body = {
    ...rest,
    ...payload,
    mechanictoolid: Number(mechanictoolid),
    deletedat: moment(),
    deletedby: user
  }

  return await tblMechanicToolLog.create(body)
}


export const removeMechanicTool = async (id, employeecode) => {
  return await tblMechanicTool.destroy({ where: { id, employeecode } })
}