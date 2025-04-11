import db from '../../../models/tableR'
import { getNativeQuery } from '../../../native/nativeUtils'

const tbNativeQuery = db.tbl_native_query 
const attrDetail = ['qcode', 'qtitle', 'qdesc', 'query', 'qreplace']

export function srvNativeQueryStrings (query) {
  const { typeQuery, ...other } = query
  return tbNativeQuery.findOne({
    attributes: attrDetail,
    where: { qcode: typeQuery },
    raw: true
  }).then(q => {
    if((q || {}).query !== '' || (q || {}).query) {
      let sSql = q.query
      const replacer = (q.qreplace || [])
      
      replacer.map(x => {
        const validityData = typeof query[x] === 'object' && query[x] !== null && query[x] !== undefined ? JSON.stringify(query[x]) : (query[x] || null)
        sSql = sSql.replace(new RegExp(`@${x}@`, 'g'), validityData)
      })
      return getNativeQuery(sSql,false, 'RAW').then(result => {
        return { success: true, data: result[0] }
      }).catch(er => {
        return { success: false, message: er.message }
      })
    } else {
      return { status: false, data: null, message: 'Query is not initialize' }
    }
  }).catch(er => er)
}