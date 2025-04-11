import { ApiError} from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import sequelize from '../../native/sequelize'
import native from '../../native/service/sqlCheck'
import { getNativeQuery } from '../../native/nativeUtils'

const stringSQL = {
  s00001: native.sqlMandatoryChecks,
  s00002: native.getServiceChecksUsage,
}

export function srvMandatoryChecks () {
  const sSQL = stringSQL.s00001
  return getNativeQuery(sSQL, false)
}

export function getServiceChecksUsage (query) {
  const sSQL = stringSQL.s00002
    .replace(/_WHERECLAUSE/g, query.policeNo ? ` policeNoId = ${query.policeNo} _WHERECLAUSE` : '')
    .replace(/_WHERECLAUSE/g, '')
  return getNativeQuery(sSQL, false)
}