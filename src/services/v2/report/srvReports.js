import db from '../../../models/tableR'

const reports = db.tbm_report
const Op = require('sequelize').Op
const mode = {
  lov: ['code','reportName'],
  bf: ['id','code','reportName','parentId', 'route'],
  mf: [ 'id', 'code', 'reportName', 'parentId', 'route', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt' ]
}

export async function srvGetGeneralReports (query) {
  const checkMode = (['lov','bf','mf']).indexOf(query.m)
  return reports.findAll({
    attributes: mode[checkMode !== -1 ? query.m : 'mf'],
    raw: false
  })
}

export async function srvGetRootReports (params) {
  return reports.findAll({
    attributes: mode.bf,
    order: ['parentid', 'sort_index', 'id'],
    where: {
      code: {
        [Op.like]: `${params.root}%`
      }
    },
    raw: false
  })
}
