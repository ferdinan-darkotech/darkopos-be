import dbv from '../../../../models/viewR'
import { setDefaultQuery } from '../../../../utils/setQuery'

import { getNativeQuery } from '../../../../native/nativeUtils' 

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

// [STORE GET REGION]: FERDINAN - 2025-06-11
export async function srvGetRegion (query) {
  const page = query.page || 1
  const pageSize = query.pageSize || 25
  const q = typeof query.q === 'string' ? query.q : ''

  const querySelect = `select * from sch_erp_system.mv_view_pos_wilayah where (kode_kabupaten ilike '%${q}%' or kode_kecamatan ilike '%${q}%' or kode_kelurahan ilike '%${q}%' or kode_pos ilike '%${q}%' or kode_propinsi ilike '%${q}%' or nama_kabupaten ilike '%${q}%' or nama_kecamatan ilike '%${q}%' or nama_kelurahan ilike '%${q}%' or nama_propinsi ilike '%${q}%' or wilayah_deskripsi ilike '%${q}%' or wilayah_deskripsi2 ilike '%${q}%') limit ${pageSize} offset ${(page - 1) * pageSize}`
  const queryCount = `select count(*) from sch_erp_system.mv_view_pos_wilayah where (kode_kabupaten ilike '%${q}%' or kode_kecamatan ilike '%${q}%' or kode_kelurahan ilike '%${q}%' or kode_pos ilike '%${q}%' or kode_propinsi ilike '%${q}%' or nama_kabupaten ilike '%${q}%' or nama_kecamatan ilike '%${q}%' or nama_kelurahan ilike '%${q}%' or nama_propinsi ilike '%${q}%' or wilayah_deskripsi ilike '%${q}%' or wilayah_deskripsi2 ilike '%${q}%') limit ${pageSize} offset ${(page - 1) * pageSize}`

  const response = await getNativeQuery(queryCount, true, 'SELECT')
  const rows = await getNativeQuery(querySelect, false, 'SELECT')

  console.log({
    count: response.count,
    rows
  })

  return {
    count: response.count,
    rows
  }
}
