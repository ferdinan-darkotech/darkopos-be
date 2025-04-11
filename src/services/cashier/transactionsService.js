import native from '../../native/cashier/sqlCashierTransSource'
import { getNativeQuery, getSelectAddition } from '../../native/nativeUtils'

const stringSQL = {
  s00001: native.sqlTransUnion,
  s00001a: native.sqlTransUnionSum,
  s00002_001: native.sqlTransDetail001,
  s00002_002: native.sqlTransDetail002,
  s00002_s001: native.sqlTransDetailSum001,
  s00002_s002: native.sqlTransDetailSum002
}

export function srvCashierTransSourceQuery (params, query, mode) {
  const select = getSelectAddition(query)

  let whereCondition = ''
  let paramCashierTransId
  if (query) {
    if (query.hasOwnProperty('id')) paramCashierTransId = query.id
  }
  if (paramCashierTransId) {
    whereCondition = "WHERE cashierTransId=" + paramCashierTransId
  }
  let sSQL
  switch (mode) {
    case 'alltrans':
      sSQL = stringSQL.s00001
        .replace("_BIND01", whereCondition)
        .replace("_ORDER01", select.order)
        .replace("_LIMIT01", select.limit)
      break
    case 'alltranssum':
      sSQL = stringSQL.s00001a
      if (sSQL) {
        sSQL = sSQL
          .replace("_BIND01", whereCondition)
          .replace("_ORDER01", select.order)
          .replace("_LIMIT01", select.limit)
      }
      break
    case 'pertrans':
      if (query.transType === 'SALES') {
        sSQL = stringSQL.s00002_001
      } else if (query.transType === 'CASH-IN') {
        sSQL = stringSQL.s00002_002
      }
      if (sSQL) {
        sSQL = sSQL
          .replace("_BIND01", whereCondition)
          .replace("_ORDER01", select.order)
          .replace("_LIMIT01", select.limit)
      }
      break
    case 'pertranssum':
      if (query.transType === 'SALES') {
        sSQL = stringSQL.s00002_s001
      } else if (query.transType === 'CASH-IN') {
        sSQL = stringSQL.s00002_s002
      }
      if (sSQL) {
        sSQL = sSQL
          .replace("_BIND01", whereCondition)
          .replace("_ORDER01", select.order)
          .replace("_LIMIT01", select.limit)
      }
      break
    case 'others':
    default: sSQL = stringSQL.s00001; break          //all trans
  }

  console.log('sSQL', sSQL)
  return getNativeQuery(sSQL, false)
}