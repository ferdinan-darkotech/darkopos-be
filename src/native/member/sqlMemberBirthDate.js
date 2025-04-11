const sqlCounterByMonth = "SELECT count(1) AS counter " +
  "FROM tbl_member a " +
  "WHERE DATE_FORMAT(a.birthDate, '%m') = '" + "_BIND01" + "';"
const sqlCounterByDate = "SELECT DATE_FORMAT(a.birthDate, '%d') AS birthDate, " +
  "count(1) AS counter " +
  "FROM tbl_member a " +
  "WHERE DATE_FORMAT(a.birthDate, '%m') = '" + "_BIND01" + "'" +
  "GROUP BY DATE_FORMAT(a.birthDate, '%d');"
const sqlListMember = "SELECT b.memberCode, b.memberName, "  +
  "b.address01, b.address02, b.cityId, b.state, b.birthDate, " +
  "b.mobileNumber, b.phoneNumber, b.email, b.gender " +
  "FROM tbl_member b "
const sqlListMemberByMonth = sqlListMember +
  "WHERE DATE_FORMAT(b.birthDate, '%m') = '" + "_BIND01" + "';"
const sqlListMemberByDate = sqlListMember +
  "WHERE DATE_FORMAT(b.birthDate, '%m%d') = '" + "_BIND01" + "';"

const native = {
  sqlCounterByMonth,
  sqlCounterByDate,
  sqlListMemberByMonth,
  sqlListMemberByDate
}

module.exports = native