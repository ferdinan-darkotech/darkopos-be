const sqlGetMemberByAsset = "SELECT b.memberCode,  b.memberName, b.address01, b.mobileNumber " +
  "FROM tbl_member_unit a INNER JOIN tbl_member b " +
  "ON a.memberId = b.id " +
  "WHERE " + "_BIND01"

const native = {
  sqlGetMemberByAsset,
}

module.exports = native