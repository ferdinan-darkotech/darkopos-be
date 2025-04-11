import { ApiError} from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import sequelize from '../../native/sequelize'
import native from '../../native/member/sqlMemberBirthDate'
import { getNativeQuery } from '../../native/nativeUtils'

const stringSQL = {
  s00001: native.sqlCounterByMonth,
  s00002: native.sqlListMemberByMonth,
  s00003: native.sqlCounterByDate,
  s00004: native.sqlListMemberByDate,
}

export function srvMonthCounter (month) {
  const sSQL = stringSQL.s00001.replace("_BIND01", month)
  return getNativeQuery(sSQL, true)
}
export function srvMonthList (month) {
  const sSQL = stringSQL.s00002.replace("_BIND01", month)
  return getNativeQuery(sSQL, false)
}
export function srvMonthDateCounter (month) {
  const sSQL = stringSQL.s00003.replace("_BIND01", month)
  return getNativeQuery(sSQL, false)
}
export function srvMonthDateList (month) {
  const sSQL = stringSQL.s00004.replace("_BIND01", month)
  return getNativeQuery(sSQL, false)
}