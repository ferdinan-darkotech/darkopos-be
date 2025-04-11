import db from '../../../models/tableR'

const dbLookupD = db.tbl_lookup_detail 
const attrDetail = [ 'lookupgroupcode', 'lookupcode', 'lookupname', 'value1', 'value2', 'value3', 'storeid', 'createdBy',
'createdAt', 'updatedBy', 'updatedAt' ]

export function srvGetLookupByGroupCode (lookupgroupcode, lookupcode) {
  return dbLookupD.findOne({
    attributes: attrDetail,
    where: { lookupgroupcode, lookupcode },
    raw: true
  })
}