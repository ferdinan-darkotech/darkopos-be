/**
 * Created by p an da . has . my . id on 2018-03-13.
 */
import { ApiError } from '../../services/v1/errorHandlingService'
import { srvHeaderInfo, srvNotificationGroup, srvReloadNotificationGroup, srvGetNotifReminderByStoreRole }
  from '../../services/dashboard/headerService'
import { getPeriodActive } from '../../services/periodeService'

// Retrieve Header Counter
exports.getHeaderInfo = function (req, res, next) {
  console.log('Requesting-getHeaderInfo: ' + req.url + ' ...')
  const { store } = req.body
  return srvHeaderInfo(store).then((counter) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: counter.length,
      data: counter
    })
  }).catch(err => next(new ApiError(422, `Couldn't count for this month ${req.body.month}.`, err)))
}
// Retrieve Notification Group
exports.getNotificationGroup = function (req, res, next) {
  console.log('Requesting-getNotificationGroup: ' + req.url + ' ...')
  const { store } = req.body
  srvNotificationGroup(store).then((notif) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: notif.length,
      data: notif
    })
  }).catch(err => next(new ApiError(422, `Couldn't notification group.`, err)))
}
// Reload Notification Group
exports.reloadNotificationGroup = function (req, res, next) {
  console.log('Requesting-reloadNotificationGroup: ' + req.url + ' ...')
  const { store, userId } = req.body
  getPeriodActive(store).then((period) => {
    if (period.length > 0) {
      if (period[0].hasOwnProperty('startPeriod')) {
        return srvReloadNotificationGroup(store, userId, period[0].startPeriod, period[0].endPeriod).then((notif) => {
          res.xstatus(200).json({
            success: true,
            message: 'Ok',
            data: notif
          })
        }).catch(err => next(new ApiError(422, `Couldn't notification group.`, err)))
      }
    } else {
      next(new ApiError(422, `Couldn't reload notification group for storeId ${store}.`, `Couldn't find Period for storeId ${store}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Period.`, err)))
}

exports.ctlGetNotifReminderByStoreRole = function (req, res, next) {
  return srvGetNotifReminderByStoreRole(req.query.store, req.query.role).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs
    })
  }).catch(err => next(new ApiError(422, `Couldn't get notif.`, err)))
}