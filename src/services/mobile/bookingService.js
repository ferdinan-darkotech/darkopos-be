/**
 * Created by boo on 01/10/2018.
 */
import { getNativeQuery } from '../../native/nativeUtils'

const sqlInsertMobileBooking = "INSERT INTO tmp_booking_mobile (" +
  "bookingId, memberCardId, memberEmail, memberName, mobileNumber, policeNo, " +
  "fuel, merk, year, city, store, bookingType, scheduleDate, scheduleTime, latitude, longitude) " +
  "VALUES (" + "_BIND01" + ")"
const sqlInsertBooking = "INSERT INTO tbl_booking (" +
  "bookingId, memberCode, memberEmail, memberName, mobileNumber, policeNo, " +
  "fuel, merk, year, city, store, bookingType, scheduleDate, scheduleTime, latitude, longitude) " +
  "VALUES (" + "_BIND01" + ")"
const sqlSelectMobileBooking = "SELECT * FROM tmp_booking_mobile " +
  "WHERE bookingId = '" + "_BIND01" + "'"
const sqlSelectBooking = "SELECT * FROM tbl_booking " +
  "WHERE bookingId = '" + "_BIND01" + "'"
const sqlSelectStatusMobileBooking = sqlSelectMobileBooking + " AND status='" + "_BIND02" + "'"
const sqlSelectMobileBookings = "SELECT bookingId, memberCardId, memberEmail, memberName, " +
  "mobileNumber, policeNo, bookingType, scheduleDate, scheduleTime, latitude, longitude " +
  "FROM tmp_booking_mobile " +
  "WHERE " + "_BIND01" +
  " UNION ALL " +
  "SELECT bookingId, memberCode, memberEmail, memberName, " +
  "mobileNumber, policeNo, bookingType, scheduleDate, scheduleTime, latitude, longitude " +
  "FROM tbl_booking " +
  "WHERE " + "_BIND01"

const sqlSelectCountBookings = "SELECT scheduleDate, count(1) AS counter, " +
  "(case status " +
  "when 'OP' then 'Open' " +
  "when 'CF' then 'Confirmed' " +
  "when 'CI' then 'Check-In' " +
  "when 'CO' then 'Check-Out' " +
  "when 'RS' then 'Reschedule' " +
  "when 'CC' then 'Cancel' " +
  "when 'RJ' then 'Reject' " +
  "end) AS status " +
  "FROM tmp_booking_mobile GROUP BY scheduleDate, status"
const sqlUpdateMobileBookings = "UPDATE tmp_booking_mobile " +
  "SET " + "_BIND03" + " " +
  "WHERE bookingId = '" + "_BIND01" + "' AND status ='" + "_BIND02" + "'"
const sqlSelectMobileBookingUpdateHistory = "SELECT * FROM tba_booking_service " +
  "WHERE bookingId = '" + "_BIND01" + "'"

const stringSQL = {
  s00001: sqlInsertMobileBooking,
  s00001a: sqlInsertBooking,
  s00002: sqlSelectMobileBooking,
  s00002a: sqlSelectBooking,
  s00003: sqlSelectMobileBookings,
  s00004: sqlSelectCountBookings,
  s00005: sqlUpdateMobileBookings,
  s00006: sqlSelectMobileBookingUpdateHistory,
}

export function addMobileBooking (bookingId, bookingInfo, next) {
  const qChr = '\'', cChr = ', '
  const bookingData = qChr + bookingId + qChr + cChr +
    qChr + bookingInfo.member_card_id + qChr + cChr +
    qChr + bookingInfo.email + qChr + cChr +
    qChr + bookingInfo.name + qChr + cChr +
    qChr + bookingInfo.no_hp + qChr + cChr +
    qChr + bookingInfo.no_polisi + qChr + cChr +
    qChr + bookingInfo.bahan_bakar + qChr + cChr +
    qChr + bookingInfo.merek + qChr + cChr +
    qChr + bookingInfo.tahun_kendaraan + qChr + cChr +
    qChr + bookingInfo.kota + qChr + cChr +
    qChr + bookingInfo.cabang + qChr + cChr +
    qChr + bookingInfo.tipe_service + qChr + cChr +
    qChr + bookingInfo.schedule_date + qChr + cChr +
    qChr + bookingInfo.schedule_time + qChr + cChr +
    bookingInfo.latitude + cChr +
    bookingInfo.longitude
  const sSQL = stringSQL.s00001.replace("_BIND01", bookingData)
  return getNativeQuery(sSQL, false, 'INSERT')
}

export function addBooking (bookingId, bookingInfo, next) {
  const qChr = '\'', cChr = ', '
  const bookingData = qChr + bookingId + qChr + cChr +
    qChr + bookingInfo.member_card_id + qChr + cChr +
    qChr + bookingInfo.email + qChr + cChr +
    qChr + bookingInfo.name + qChr + cChr +
    qChr + bookingInfo.no_hp + qChr + cChr +
    qChr + bookingInfo.no_polisi + qChr + cChr +
    qChr + bookingInfo.bahan_bakar + qChr + cChr +
    qChr + bookingInfo.merek + qChr + cChr +
    qChr + bookingInfo.tahun_kendaraan + qChr + cChr +
    qChr + bookingInfo.kota + qChr + cChr +
    qChr + bookingInfo.cabang + qChr + cChr +
    qChr + bookingInfo.tipe_service + qChr + cChr +
    qChr + bookingInfo.schedule_date + qChr + cChr +
    qChr + bookingInfo.schedule_time + qChr + cChr +
    bookingInfo.latitude + cChr +
    bookingInfo.longitude
  const sSQL = stringSQL.s00001a.replace("_BIND01", bookingData)
  return getNativeQuery(sSQL, false, 'INSERT')
}

export function getMobileBooking (bookingId, status, next) {
  const qChr = '\'', cChr = ', '
  let sSQL = stringSQL.s00002.replace("_BIND01", bookingId)
  if (status) {
    sSQL = sSQL.replace("_BIND01", status)
  }
  return getNativeQuery(sSQL, false)
}
export function getBooking (bookingId, status, next) {
  const qChr = '\'', cChr = ', '
  let sSQL = stringSQL.s00002a.replace("_BIND01", bookingId)
  if (status) {
    sSQL = sSQL.replace("_BIND01", status)
  }
  return getNativeQuery(sSQL, false)
}

export function getMobileBookings (condition, next) {
  const qChr = '\''
  let sSQL, whereCondition = 'status=status'
  if (condition) {
    if (condition.hasOwnProperty('status') && condition.hasOwnProperty('dateBooking')) {
      whereCondition = ' status=' + qChr + condition.status + qChr +
        'AND scheduleDate=' + qChr + condition.dateBooking + qChr
      sSQL = stringSQL.s00003
    } else if (condition.hasOwnProperty('groupMonth')) {
      whereCondition = 'date_format(scheduleDate,' + qChr + '%Y-%m' + qChr + ') =' + qChr + condition.groupMonth + qChr
      sSQL = stringSQL.s00004
    } else {
      whereCondition = ' scheduleDate=' + qChr + condition.dateBooking + qChr
      sSQL = stringSQL.s00003
    }
  } else {
    whereCondition = 'date_format(scheduleDate,' + qChr + '%Y-%m' + qChr + ') =' + qChr + condition.groupMonth + qChr
    sSQL = stringSQL.s00004
  }
  sSQL = sSQL.replace(/_BIND01/g, whereCondition)
  return getNativeQuery(sSQL, false)
}

export function setMobileBooking (bookingInfo, next) {
  const qChr = '\'', cChr = ', '
  let sSET = "status='" + bookingInfo.newStatus + "', " +
    "updatedBy='" + bookingInfo.updateBy + "', " +
    "updatedAt=now() "
  if (bookingInfo.newStatus === 'RS') {
    sSET = sSET + "," + "scheduleDate='" + bookingInfo.newScheduleDate + "', " +
      "scheduleTime='" + bookingInfo.newScheduleTime + "'"
  }

  const sSQL = stringSQL.s00005
    .replace("_BIND01", bookingInfo.id)
    .replace("_BIND02", bookingInfo.oldStatus)
    .replace("_BIND03", sSET)

  return getNativeQuery(sSQL, false, 'UPDATE', next)
    .catch(err => ({ err: err.original.sqlMessage }))
}

export function getMobileBookingUpdateHistory (bookingId, status, next) {
  const qChr = '\'', cChr = ', '
  let sSQL = stringSQL.s00006.replace("_BIND01", bookingId)
  if (status) {
    sSQL = sSQL.replace("_BIND01", status)
  }
  return getNativeQuery(sSQL, false)
}