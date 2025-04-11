import sequelize, { Op } from 'sequelize'
import db from '../../../../models/tableR'
import moment from 'moment'
import { setDefaultQuery } from '../../../../utils/setQuery'


const tbLovItem = db.tbl_data_lov_items

// work in postgresql
const parseUri = [sequelize.literal("jsonb_extract_path_text(item_value, variadic array['url'])"), 'img_url']
const parseUsed = [sequelize.literal("jsonb_extract_path_text(item_value, variadic array['isUsed'])"), 'is_used']
const matchBranch = (branch = -1) => sequelize.literal(`jsonb_extract_path_text(item_value, variadic array['branch']) = ${branch}::text`)
const matchUsed = (isUsed = 'N') => sequelize.literal(`jsonb_extract_path_text(item_value, variadic array['isUsed']) = '${isUsed}'::text`)

const attrItems = {
  mf: [
    'item_id', 'item_code', 'lov_type', 'item_desc', 'item_value', 'created_by',
    'created_at', 'updated_by', 'updated_at', 'active',
  ],
  bf: [
    'item_code', 'lov_type', 'item_desc', parseUri, parseUsed, 'created_by',
    'created_at', 'updated_by', 'updated_at', 'active',
  ],
  mnf: [
    'item_code', 'item_desc', parseUri
  ]
}

export function srvGetSomeAdsBanner (query, branchId) {
  const { m, ...other } = query
  const defaultQuery = setDefaultQuery(attrItems.bf, other, false)
  
  defaultQuery.where = {
    ...defaultQuery.where,
    '': matchBranch(branchId)
  }

  return tbLovItem.findAndCountAll({
    attributes: (attrItems[m] || attrItems.mnf),
    raw: true,
    ...defaultQuery
  })
}

export function srvGetAllAdsBanner (branchId) {
  return tbLovItem.findAll({
    attributes: attrItems.mnf,
    raw: true,
    where: {
      [Op.and]: [{ '': matchBranch(branchId) }, { '': matchUsed('Y') }, { active: { [Op.eq]: true } }]
    }
  })
}

export function srvCreateAdsBanner (data, branchId) {
  return tbLovItem.create({
    item_code: data.item_code,
    lov_type: 'ADS-BNR-NPS',
    item_desc: data.item_desc,
    item_value: {
      url: data.img_url,
      branch: branchId,
      isUsed: data.is_used
    },
    active: data.active,
    created_by: data.users,
    created_at: moment(),
  })
}

export function srvUpdateAdsBanner (data, branchId, filtering) {
  return tbLovItem.update({
    item_desc: data.item_desc,
    item_value: {
      url: data.img_url,
      branch: branchId,
      isUsed: data.is_used
    },
    active: data.active,
    updated_by: data.users,
    updated_at: moment(),
  }, { where: { item_code: filtering.item_code } })
}