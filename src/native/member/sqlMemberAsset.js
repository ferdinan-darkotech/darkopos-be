const sqlGetMemberByAsset = `SELECT 
    b.id,
    a.id as memberUnitId,
    a.policeNo,
    b.memberCode,  
    b.memberName,
    b.gender,  
    b.memberPendingPayment,
    b.memberSellPrice,
    b.showAsDiscount,
    b.memberTypeId,
    b.memberTypeName,
    b.address01, 
    b.mobileNumber
  FROM tbl_member_unit a INNER JOIN vw_member b 
  ON a.memberId = b.id
  WHERE _BIND01`

const native = {
  sqlGetMemberByAsset,
}

module.exports = native