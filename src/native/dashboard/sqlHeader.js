/**
 * Created by p a n da . has . my . id on 2018-03-13.
 */
const sqlHeaderInfo = "SELECT 'bday' AS info, COUNT(1) AS counter " +
  "FROM tbl_member a " +
  "WHERE extract(month from a.birthDate) = extract(month from NOW()) " +
  "UNION ALL " +
  "SELECT 'notif' AS info, COUNT(1) AS counter " +
  "FROM tmp_notification WHERE storeId=" + "_BIND01" + ";"
const sqlNotificationGroup = `SELECT notificationCode as "notificationCode", notificationName as "notificationName", counter 
  FROM tmp_notification WHERE storeId=_BIND01;`
const sqlReloadNotificationGroup = "select * from sp_notification_001(" +
  "_BIND01" + ", '" + "_BIND02" + "' , '" + "_BIND03" + "', '" + "_BIND04" + "');"


const native = {
  sqlHeaderInfo,
  sqlNotificationGroup,
  sqlReloadNotificationGroup,
}

module.exports = native