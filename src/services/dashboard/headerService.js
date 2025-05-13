/**
 * Created by p a n d a . has . my . id on 2018-03-13.
 */
import { ApiError} from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import { getNativeQuery } from '../../native/nativeUtils'
import native from '../../native/dashboard/sqlHeader'
import dbv from '../../models/viewR'
import { Op } from 'sequelize'

const attrNotifReminder = ['notifcode','notifname','total','redirectto']
const vwNotifReminder = dbv.vw_notif_reminder
const stringSQL = {
  s00001: native.sqlHeaderInfo,
  s00002: native.sqlNotificationGroup,
  s00003: native.sqlReloadNotificationGroup
}

export function srvHeaderInfo (store) {
  const sSQL = stringSQL.s00001.replace("_BIND01", store)
  return getNativeQuery(sSQL, false)
}
export function srvNotificationGroup (store) {
  const sSQL = stringSQL.s00002.replace("_BIND01", store)
  return getNativeQuery(sSQL, false)
}
export function srvReloadNotificationGroup (store, reloadBy, fromDate, toDate) {
  const sSQL = stringSQL.s00003
    .replace("_BIND01", store)
    .replace("_BIND02", reloadBy)
    .replace("_BIND03", fromDate)
    .replace("_BIND04", toDate)
  return getNativeQuery(sSQL, false, 'RAW')
}


export function srvGetNotifReminderByStoreRole (store, role) {
  return vwNotifReminder.findAll({
    attributes: attrNotifReminder,
    where: {
      [Op.or]: [{ [`'${role}'`]: sequelize.literal(`'${role}'=any(string_to_array(notifaccess,','))`)}, { notifaccess: '*' }],
      storeid: {
        [Op.in]: [store, -1]
      }
    }
  })
}

export function srvGetNotifReminderByCode (code) {
  return vwNotifReminder.findOne({
    attributes: attrNotifReminder,
    where: {
      notifcode: code
    },
    raw: true
  })
}