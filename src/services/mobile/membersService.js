/**
 * Created by boo on 01/10/2018.
 */
import { getNativeQuery } from '../../native/nativeUtils'

const sqlAddMobileMember = "INSERT INTO tmp_user_mobile (" +
  "memberCardId, memberEmail, memberName, memberPoint, validThrough, mobileNumber) " +
  "VALUES (" + "_BIND01" + ")"
const sqlAddMobileMemberAsset = "INSERT INTO tmp_user_mobile_asset (" +
  "memberCardId, policeNo, merk, model, type, year, chassisNo, machineNo," +
  "createdBy, createdAt) " +
  "VALUES (" + "_BIND01" + ")"
const sqlAddMemberAsset = "INSERT INTO tbl_member_unit (" +
  "memberId, policeNo, merk, model, type, year, chassisNo, machineNo," +
  "createdBy, createdAt) " +
  "VALUES (" + "_BIND01" + ")"
const sqlSelectMobileMember = "SELECT * FROM tmp_user_mobile " +
  "WHERE memberCardId = '" + "_BIND01" + "' and mobileActivate=0"
const sqlSelectMobileMemberAsset = "SELECT * FROM tmp_user_mobile_asset " +
  "WHERE memberCardId = '" + "_BIND01" + "' AND policeNo = '" + "_BIND02" + "'"
const sqlGetMemberAsset = "SELECT * FROM tbl_member_unit " +
  "WHERE memberId = (SELECT id FROM tbl_member WHERE memberCode='" + "_BIND01" + "') AND policeNo = '" + "_BIND02" + "'"
const sqlSelectMobileMemberAdd = "SELECT a.policeNo, a.merk, a.model, a.type, a.year, " +
  "a.chassisNo, a.machineNo " +
  "FROM tmp_user_mobile a " +
  "LEFT JOIN tbl_member b on a.memberCardId = b.memberCode " + "WHERE b.memberCode is null AND a.memberCardId = '" + "_BIND01" + "'"
const sqlGetMemberStatus = "SELECT fn_member('" + "_BIND01" + "'," + "_BIND02" + ") AS memberStatus"
const sqlGetTmpMemberMobile = "SELECT memberEmail, memberName, memberPoint, mobileNumber, validThrough " +
  "FROM tmp_user_mobile WHERE memberCardId='" + "_BIND01" + "';"
const sqlGetTmpMemberMobileAsset = "SELECT policeNo, merk, model, type, year, chassisNo, machineNo " +
  "FROM tmp_user_mobile_asset WHERE memberCardId='" + "_BIND01" + "';"
const sqlGetTmpBookingMobile = "SELECT bookingId, scheduleDate, scheduleTime, store " +
  "FROM tmp_booking_mobile WHERE memberCardId='" + "_BIND01" + "';"

const stringSQL = {
  s00001: sqlAddMobileMember,
  s00002: sqlSelectMobileMember,
  s00003: sqlSelectMobileMemberAdd,
  s00004: sqlGetMemberStatus,
  s00005: sqlAddMobileMemberAsset,
  s00006: sqlSelectMobileMemberAsset,
  s00007: sqlAddMemberAsset,
  s00008: sqlGetMemberAsset,
  s00009: sqlGetTmpMemberMobile,
  s00010: sqlGetTmpMemberMobileAsset,
  s00011: sqlGetTmpBookingMobile
}

export function srvAddMobileMember (memberCardId, memberInfo, next) {
  const qChr = '\'', cChr = ', '
  const sSQL = stringSQL.s00001
  let memberData = qChr + memberCardId + qChr + cChr +
    qChr + memberInfo.email + qChr + cChr +
    qChr + memberInfo.name + qChr + cChr +
    memberInfo.point + cChr +
    qChr + memberInfo.valid_thru + qChr + cChr +
    qChr + memberInfo.mobile_no + qChr

  return getNativeQuery(sSQL.replace("_BIND01", memberData), false, 'INSERT')
}

export function srvAddMobileMemberAsset (memberCardId, licensePlate, memberInfo, next) {
  const qChr = '\'', cChr = ', '
  const sSQL = stringSQL.s00005
  let memberAssetData = qChr + memberCardId + qChr + cChr +
    qChr + licensePlate + qChr + cChr +
    qChr + memberInfo.merk + qChr + cChr +
    qChr + memberInfo.model + qChr + cChr +
    qChr + memberInfo.type + qChr + cChr +
    memberInfo.year + cChr +
    qChr + memberInfo.chassisNo + qChr + cChr +
    qChr + memberInfo.machineNo + qChr + cChr +
    qChr + memberCardId + qChr + cChr +
    qChr + new Date().toISOString().split('T')[0] +
    ' ' + new Date().toISOString().split('T')[1].split('.')[0] + qChr

  return getNativeQuery(sSQL.replace("_BIND01", memberAssetData), false, 'INSERT')
}

export function srvAddMemberAsset (memberCardId, licensePlate, memberInfo, next) {
  const qChr = '\'', cChr = ', '
  const sSQL = stringSQL.s00007
  let memberAssetData = "(SELECT id FROM tbl_member WHERE memberCode=\'" + memberCardId + "\')" + cChr +
    qChr + licensePlate + qChr + cChr +
    qChr + memberInfo.merk + qChr + cChr +
    qChr + memberInfo.model + qChr + cChr +
    qChr + memberInfo.type + qChr + cChr +
    memberInfo.year + cChr +
    qChr + memberInfo.chassisNo + qChr + cChr +
    qChr + memberInfo.machineNo + qChr + cChr +
    qChr + memberCardId + qChr + cChr +
    qChr + new Date().toISOString().split('T')[0] +
    ' ' + new Date().toISOString().split('T')[1].split('.')[0] + qChr

  return getNativeQuery(sSQL.replace("_BIND01", memberAssetData), false, 'INSERT')
}

export function srvGetMobileMember (memberCardId, next) {
  const sSQL = stringSQL.s00002
  return getNativeQuery(sSQL.replace("_BIND01", memberCardId), false)
}

export function srvGetMobileMemberAsset (memberCardId, licensePlate, next) {
  const sSQL = stringSQL.s00006
  return getNativeQuery(sSQL
    .replace("_BIND01", memberCardId)
    .replace("_BIND02", licensePlate)
    , false)
}

export function srvGetMemberAsset (memberCardId, licensePlate, next) {
  const sSQL = stringSQL.s00008
  return getNativeQuery(sSQL
    .replace("_BIND01", memberCardId)
    .replace("_BIND02", licensePlate)
    , false)
}

export function getMobileMemberActive (memberCardId, next) {
  const sSQL = stringSQL.s00003
  return getNativeQuery(sSQL.replace("_BIND01", memberCardId), false)
}

export function srvGetMemberStatus (memberCardId, mode = 0, next) {
  const sSQL = stringSQL.s00004
  return getNativeQuery(sSQL
    .replace("_BIND01", memberCardId)
    .replace("_BIND02", mode)
    , true)
}

export function srvGetTmpMobileMember (memberCardId) {
  const sSQL = stringSQL.s00009
  return getNativeQuery(sSQL
    .replace("_BIND01", memberCardId)
    , true)
}

export function srvGetTmpMobileMemberAsset (memberCardId) {
  const sSQL = stringSQL.s00010
  return getNativeQuery(sSQL
    .replace("_BIND01", memberCardId)
    , false)
}

export function srvGetTmpBookingMobile (memberCardId) {
  const sSQL = stringSQL.s00011
  return getNativeQuery(sSQL
    .replace("_BIND01", memberCardId)
    , false)
}
