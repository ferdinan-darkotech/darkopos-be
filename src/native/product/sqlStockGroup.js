// [MASTER PRODUCT GROUP]: FERDINAN - 16/06/2025
const sqlGroupProducts = "SELECT b.productCode, b.productName " +
  "FROM tbl_stock_group a INNER JOIN tbl_stock b " +
  "ON a.id = b.groupId " +
  "WHERE groupCode = '" + "_BIND01" + "';"


const native = {
  sqlGroupProducts
}

module.exports = native