const sqlNPSInsert = "INSERT INTO tbl_member_nps (" +
  "memberId, npsDate, npsScore, npsMemo, createdAt)" +
  "VALUES (" + "_BIND01" + ")"

const sqlNPSGetByMemberId = "SELECT npsDate, npsScore, npsMemo FROM tbl_member_nps " +
  "WHERE memberId=" + "_BIND01"

const sqlNPSGetByMemberIdDate = sqlNPSGetByMemberId + " AND npsDate ='" + "_BIND02" + "'"

const sqlNPSGetByMemberIdLastDate = "SELECT * FROM (" +
  "SELECT MAX(npsDate) AS lastDate FROM tbl_member_nps " +
  "WHERE memberId=" + "_BIND01" + ") a, (" +
  "SELECT json_extract(settingValue, '$.NPS.nextScoreDate') AS nextScoreDate " +
  "FROM tbl_setting " +
  "WHERE settingCode = 'Validation') b"

const native = {
  sqlNPSInsert,
  sqlNPSGetByMemberId,
  sqlNPSGetByMemberIdDate,
  sqlNPSGetByMemberIdLastDate
}

module.exports = native