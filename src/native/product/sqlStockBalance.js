const sqlGetCurrentStock = "select * from sp_saldo_stock_003('" +
  "_BIND01" + "', '" + "_BIND02" + "', '" + "_BIND03" + "', '" + "_BIND04" + "');"

const native = {
  sqlGetCurrentStock
}

module.exports = native