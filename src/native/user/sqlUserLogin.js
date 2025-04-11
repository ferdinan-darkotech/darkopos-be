const vwUserRoleFields = ` id, userid as "userId", username as "userName", email, fullname as "fullName",
                           active, isemployee as "isEmployee", hash, salt, totp, resetpassword as "resetPassword",
                           createdat as "createdAt", updatedat as "updatedAt",createdby as "createdBy", updatedby as "updatedBy",
                           defaultstore as "defaultStore", defaultrole as "defaultRole"`

const sqlUser = `SELECT getCompany() AS "companyName", ${vwUserRoleFields} FROM vw_user_role_store a WHERE a.userId = '_BIND01'`

const sqlRolePermission = `SELECT userRole as "userRole", userRoleName as "userRoleName", defaultrolestatus as "defaultRole"
  FROM vw_user_role WHERE userId = '_BIND01'`

const sqlSaveLoginSuccess = "INSERT INTO tbl_user_login (" +
  "sessionId, userId, ipAddress1, ipAddress2, role, storeId, loginTime)" +
  "VALUES (" + "_BIND01" + ")"
const sqlCheckLogin = "SELECT count(1) FROM tbl_user_login a WHERE userId = '" + "_BIND01" + "' AND a.logoutTime IS NULL;"
const sqlSaveLogout = "UPDATE tbl_user_login SET logoutTime = now() " +
  "WHERE userId = '" + "_BIND01" + "' AND sessionId = '" + "_BIND02" + "';"
const sqlCheckLogout = "SELECT count(1) AS counter FROM tbl_user_login " +
  "WHERE userId = '" + "_BIND01" + "' AND sessionId = '" + "_BIND02" + "' " +
  "AND logoutTime IS NULL;"
const sqlGetLogout = "SELECT logoutTime FROM tbl_user_login " +
  "WHERE userId = '" + "_BIND01" + "' AND sessionId = '" + "_BIND02" + "' " +
  "AND logoutTime IS NOT NULL;"
const sqlSaveLoginFail = "INSERT INTO tba_user_login (" +
  "sessionId, userId, ipAddress1, ipAddress2, role, storeId, loginTime, message)" +
  "VALUES (" + "_BIND01" + ")"
const sqlSaveLogoutFail = "INSERT INTO tba_user_login (" +
  "sessionId, userId, ipAddress1, ipAddress2, role, storeId, loginTime, message)" +
  "VALUES (" + "_BIND01" + ")"

const native = {
  sqlUser,
  sqlRolePermission,
  sqlSaveLoginSuccess,
  sqlCheckLogin,
  sqlSaveLogout,
  sqlCheckLogout,
  sqlGetLogout,
  sqlSaveLoginFail,
  sqlSaveLogoutFail
}

module.exports = native