import { getNativeQuery } from '../../../native/nativeUtils'
import native from '../../../native/v2/marketing/sqlTarget'
import { srvGetStoreById } from '../../../services/setting/storeService'
import moment from 'moment'

const stringSQL = {
  // without stock outlet
  s00001: native.realizationsProduct,
  // with stock outlet
  s00002: native.realizationsOther
}



export function srvSalesRealizations (query, filter) {
  let { store, pdate, mtd, compare, avg } = query 
  
  const sSQLProduct = stringSQL.s00001.replace('_BIND01', store).replace('_BIND02', pdate).replace('_BIND03', mtd)
                        .replace('_BIND04', compare).replace('_BIND05', avg)
  const sSQLOther = stringSQL.s00002.replace('_BIND01', store).replace('_BIND02', pdate).replace('_BIND03', mtd)
                        .replace('_BIND04', compare)
  return Promise.all([getNativeQuery(sSQLProduct, false, 'CALL'), getNativeQuery(sSQLOther, false, 'CALL')])
}

