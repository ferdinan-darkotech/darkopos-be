import dbv from '../../../../models/viewR'
import { setDefaultQuery } from '../../../../utils/setQuery'

const vwWilayah = dbv.mv_wilayah

const attrWilayah = ['prov_id', 'prov_kode', 'prov_nama', 'kab_id', 'kab_nama', 'ibukota',
'kec_id', 'kec_nama', 'kel_id', 'kel_nama', 'pos_kode']


export function srvGetWilayah (query) {
  const { m, storeid, ...other } = query
  let queryDefault = setDefaultQuery(attrWilayah, other, true)
  queryDefault.where = { ...queryDefault.where }
  return vwWilayah.findAndCountAll({
    attributes: attrWilayah,
    ...queryDefault,
    raw: true
  })
}