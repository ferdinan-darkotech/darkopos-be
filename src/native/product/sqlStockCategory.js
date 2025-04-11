const sqlCategoryProducts = "SELECT b.productCode, b.productName " +
  "FROM tbl_stock_category a INNER JOIN tbl_stock b " +
  "ON a.id = b.categoryId " +
  "WHERE categoryCode = '" + "_BIND01" + "';"


const native = {
  sqlCategoryProducts
}

module.exports = native