import dbr from '../../../models/tableR'
import { setDefaultQuery } from '../../../utils/setQuery'
import collections from '../../../models/collections/list-collections'
import moment from 'moment'
import sequelize, { Op } from 'sequelize'
import shortID from 'short-unique-id'

const npsHistory = dbr.tbl_nps_histories
const npsMonit = collections.cl_nps_monitoring

const UUID = new shortID({ length: 8 })

const attributeNPS = {
  mf: ['nps_id', 'nps_group', 'nps_link', 'nps_payload', 'nps_ref', 'nps_store', 'publish_at', 'response_at'],
  bg: ['nps_id', 'nps_group', 'nps_link', 'nps_ref', 'nps_store', 'publish_at', 'response_at'],
}

const attributeReportNPS = [
  'nps_group', 'nps_link', sequelize.literal("jsonb_extract_path(nps_payload, 'result')"),
  'nps_ref', 'publish_at', 'response_at'
]


export function srvGetAllActiveNPSFormByGroup (groups) {
  return npsMonit
    .find({ nps_group: groups }, { nps_id: 1, _id: 0, nps_data: 1, created_at: 1 })
    .sort({ created_at: 1 })
}

export function srvGetReportNPS (query = {}) {
  const { from, to, groups, filterDataOn = 'PUBLISH' } = query

  let dateFilter = {}
  let sorting = []

  if (filterDataOn === 'PUBLISH') {
    dateFilter = { publish_at: { [Op.between]: [from, to] } }
    sorting = [['publish_at', 'asc']]
  } else if (filterDataOn === 'RESPONSE') {
    dateFilter = { response_at: { [Op.between]: [from, to] } }
    sorting = [['response_at', 'asc']]
  } else {
    throw new Error('Type of date filtering is not found.')
  }

  return npsHistory.findAll({
    attributes: attributeReportNPS,
    where: {
      nps_group: groups,
      ...dateFilter
    },
    order: sorting,
    raw: true
  })

}


export function srvSaveNPS (data, transaction) {
  return npsHistory.create({
    nps_id: `${UUID()}-${UUID.stamp(12)}`,
    nps_group: data.groups,
    nps_payload: data.payload,
    nps_link: data.link,
    nps_ref: data.ref,
    nps_store: data.store,
    publish_at: data.publish_at * 1000,
    response_at: data.response_at * 1000
  }, { transaction, raw: true, returning: ['*'] })
}

