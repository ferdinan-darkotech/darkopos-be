import moment from 'moment'
import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import { setDefaultQuery } from '../../../../utils/setQuery'

const tbVendor = db.tbl_vendor
const vwVendor = dbv.vw_vendor

const attributes = {
  mf: [
    'vendor_id', 'vendor_code', 'vendor_name', 'address', 'phone_number',
    'email', 'status', 'prov_nama', 'ibukota', 'kab_nama', 'kec_nama', 'kel_id',
    'kel_nama', 'pos_kode', 'created_by', 'created_at', 'updated_by', 'updated_at'
  ],
  bf: [
    'vendor_code', 'vendor_name', 'address', 'phone_number',
    'email', 'status', 'prov_nama', 'ibukota', 'kab_nama', 'kec_nama',
    'kel_nama', 'pos_kode', 'created_by', 'created_at', 'updated_by',
    'updated_at'
  ],
  lov: ['vendor_code', 'vendor_name']
}

// // global function
export function srvGetVendorByCode (code) {
  return tbVendor.findOne({
    attributes: ['*'],
    where: { vendor_code: code },
    raw: true
  })
}


export function srvGetVendor (query) {
  const { m, store, ...other } = query
  const tmpAttr = m === 'lov' ? attributes[m] : attributes.mf
  let queryDefault = setDefaultQuery(tmpAttr, other, m !== 'lov')
  queryDefault.where = { ...queryDefault.where, ...(m === 'lov' ? { active: true } : {}) }
  return vwVendor.findAndCountAll({
    attributes: tmpAttr,
    ...queryDefault,
    raw: true
  })
}

export function srvCreatedVendor (data, userid) {
  return tbVendor.create({
    vendor_code: data.vendor_code,
    vendor_name: data.vendor_name,
    address: data.address,
    phone_number: data.phone_number,
    email: data.email,
    status: data.status,
    kel_id: data.kel_id,
    created_by: userid,
    created_at: moment()
  })
}

export function srvUpdatedVendor (data, userid) {
  return tbVendor.update({
    vendor_name: data.vendor_name,
    address: data.address,
    phone_number: data.phone_number,
    email: data.email,
    status: data.status,
    kel_id: data.kel_id,
    created_by: userid,
    updated_at: moment()
  }, { where: { vendor_code: data.vendor } })
}