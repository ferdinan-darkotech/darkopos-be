import tb from '../../../../models/tableR'
import vw from '../../../../models/viewR'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { getSelectOrder } from '../../../../native/nativeUtils'
import { Op, remapFilter } from '../../../../native/sequelizeOp'
import { isEmptyObject, checkJSONValid } from '../../../../utils/operate/objOpr'
import { switchModeField } from '../../function/srvUtils'
import { srvGetCustomerByCode } from './srvCustomerList'
import { getNativeQuery } from '../../../../native/nativeUtils'
import stringSQL from '../../../../native/v2/master/customer/sqlCashback'

const srvGetCashback = function (memberId, next) {
  const sSQL = stringSQL.s00001.replace("_BIND01", memberId)
  return getNativeQuery(sSQL, true, 'SELECT', next)
}


export async function srvGetCustomerCashbackByCode (memberCode, next) {
  // let transaction
  try {
    // transaction = await sequelize.transaction()
    const memberData = await srvGetCustomerByCode(memberCode, { m: 'gid'})
    if (memberData) {
      // const memberId = memberData.id
      const cashBack = await srvGetCashback(memberData.id, next)
      // remark 2019-06-19, to see where use tbl_member.cashback
      // await updateMemberCashback(lastCashback.countCashback, memberId, transaction)
      // transaction.commit()
      return cashBack.amount
    }
    // return transaction.rollback()
  } catch (err) {
    // transaction.rollback()
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCC-10001'
    next(new ApiError(400, other, err))
  }
}

