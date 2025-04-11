const sqlActivateMobile = "CALL sp_mobile_001('" +
  "_BIND01" + "', '" + "_BIND02" + "');"
const sqlActivateMobileOffline = "CALL sp_mobile_002('" +
  "_BIND01" + "', '" + "_BIND02" + "', '" + "_BIND03" + "');"

const native = {
  sqlActivateMobile,
  sqlActivateMobileOffline,
}

module.exports = native