import moment from 'moment'
import Sequelize from 'sequelize'
import collections from '../../../../../models/collections/list-collections'
import db from '../../../../../models/tableR'
import sequelize from '../../../../../native/sequelize'
import { srvSaveNPS } from '../../../marketing/srvNPS'
import { buildAttributesOfNoSql } from '../../../../../utils/setQuery'
import sockets from '../../../../../utils/socket'


const npsMonit = collections.cl_nps_monitoring
const tbLovItem = db.tbl_data_lov_items

const attrNPS = {
  mf: [
    'nps_id', 'nps_group', 'nps_data', 'url_link', 'public_id' , 'created_at'
  ],
  mnf: [
    'nps_id', 'nps_group', 'url_link', 'public_id'
  ]
}

export function getPendingNPSRatingLinks (storeCode) {
  return npsMonit.find({
    nps_group: 'FJ-RATING',
    'nps_data.store_code': storeCode
  }, { _id: 0, url_link: 1, public_id: 1 })
}

export function srvGetOneContactMsgNPS (store = null) {
  return tbLovItem.findOne({
    attributes: [
      ['item_code', 'store_code'],
      ['item_desc', 'descriptions'],
      [Sequelize.literal("jsonb_extract_path_text(item_value, variadic array['wa'])::jsonb"), 'wa_no']
    ],
    raw: true,
    where: {
      lov_type: 'MSG-BAD-RATING',
      item_code: store
    }
  })
}


export function srvGetActiveNPS (pubID = null) {
  return npsMonit
    .findOne({ public_id: pubID }, buildAttributesOfNoSql(attrNPS.mf, attrNPS.mf, true))
}

export async function srvSetResults (data = {}) {
  const transaction = await sequelize.transaction()
  try {
    const { results, ext, link: hyperlink, publishAt, responseAt } = data
    
    const currNPS = await srvGetActiveNPS(data.publicId)
    if(!currNPS) throw new Error('NPS data is not found.')
    
    const npsSaved = await srvSaveNPS({
      groups: currNPS.nps_group,
      payload: results,
      link: hyperlink,
      ref: (currNPS.nps_data || {}).trans_no,
      store: (currNPS.nps_data || {}).store_code,
      publish_at: data.publishAt,
      response_at: data.responseAt
    }, transaction)

    await npsMonit.deleteOne({ nps_id: currNPS.nps_id })

    // sockets.bulkSendBroadcast(
    //   'LIVE-MONITORING-NPS',
    //   'receiveMonitoringNPS', {
    //     STORE: (currNPS.nps_data || {}).store_code
    //   }, {
    //     groups: currNPS.nps_group,
    //     action: 'OUTCOMING',
    //     data: { nps_id: currNPS.nps_id }
    //   }
    // )
    
    await transaction.commit()
    return { success: true, message: 'OK', data: { id: npsSaved.nps_id, tmp_id: currNPS.nps_id }, group: currNPS.nps_group, tmpNPS: currNPS }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

export function srvSaveNPSMonit (data = {}) {
  return npsMonit.insertMany([{
    nps_group: data.groups,
    nps_data: data.payload,
    url_link: data.url_link,
    public_id: data.public_id,
    created_at: data.created_at
  }], { lean: true })
    .then(res => res[0])
    .catch(er => null)

}