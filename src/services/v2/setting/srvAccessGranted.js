import db from '../../../models/tableR'

const tblAccessGranted = db.tbl_access_granted
const attributes = {
  mf: [ "id", "accesscode", "accesskey", "accessname", "accessvar01", "accessvar02", "accessvar03"],
  bf: ["id", "accesscode", "accesskey", "accessname", "accessvar01", "accessvar02"]
}


export function srvGetAccessGrantedByCode (query) {
  const { code, m, ...other } = query
  return tblAccessGranted.findAll({
    where: { accesscode: code },
    attributes: attributes[m ? 'mf' : m],
    order: [['sorted', 'ASC']],
    raw: true
  })
}

export function srvGetAccessSPKFields (query, access) {
  const { m, ...other } = query
  return tblAccessGranted.findAll({
    where: { accesscode: access },
    attributes: attributes[m ? 'mf' : m],
    order: [['sorted', 'ASC']],
    raw: true
  })
}


export function srvGetAccessGrantedByKeyCode (accesscode, accesskey) {
  return tblAccessGranted.findOne({
    attributes,
    where: { accesscode, accesskey },
    order: [['sorted', 'ASC']],
    raw: true
  })
}

export function srvGetDataByCodeWithCustomeAttr (accesscode, attr = []) {
  return tblAccessGranted.findAll({
    attributes: attr,
    where: { accesscode },
    raw: true
  })
}