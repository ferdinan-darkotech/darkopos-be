import db from '../../../models/tableR'
import dbv from '../../../models/viewR'
import { setDefaultQuery } from '../../../utils/setQuery'
import moment from 'moment'

const tbPromoKey = db.tbl_bundling_uniq_key
const tbHistoryPromoKey = db.tbl_history_bundling_uniq_key

const attrHistoryPromoKey = [
  'promo_code', 'uniq_key', 'used_store_code', 'used_store_code', 'used_store_name', 'trans_no',
  'status', 'created_by', 'created_at', 'updated_by', 'updated_at'
]
const attrPromoKey = ['promo_code', 'uniq_key', 'status', 'created_by', 'created_at']

export function srvGetSomeKeyByCode (promoCode, users, query) {
  const { ...other } = query
  let queryDefault = setDefaultQuery(attrHistoryPromoKey, other, true)

  queryDefault.where = {
    ...queryDefault.where,
    promo_code: promoCode,
    created_by: users
  }

  return tbHistoryPromoKey.findAndCountAll({
    attributes: attrHistoryPromoKey,
    ...queryDefault,
    raw: true
  })
}

export function srvGetOneUniqByKeyCode (promoCode, uniqKey) {
  return tbPromoKey.findOne({
    attributes: attrPromoKey,
    where: { promo_code: promoCode, uniq_key: uniqKey },
    raw: true
  })
}


export function srvGetAllKeyByCode (promoCode, users) {
  return tbHistoryPromoKey.findAll({
    attributes: attrHistoryPromoKey,
    where: { promo_code: promoCode, created_by: users },
    raw: true
  })
}