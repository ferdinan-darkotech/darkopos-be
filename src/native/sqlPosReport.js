//remove unused columns for simplification
const posDailyReportGroup = `select _FIELDNAME,
  SUM( qty ) AS qty,
  SUM( a.sellPrice ) AS "sellPrice",
  SUM( sellingPrice ) AS "sellingPrice",
  SUM( total ) AS total,
  SUM( discInvoicePercent ) AS "discInvoicePercent",
  SUM( discInvoiceNominal ) AS "discInvoiceNominal",
  SUM( discItem ) AS "discItem",
  SUM( rounding ) AS rounding,
  SUM( roundingItem ) AS "roundingItem",
  SUM( grandTotal ) AS "grandTotal",
  SUM( portion ) AS portion,
  SUM( totalDiscount ) AS "totalDiscount",
  SUM( DPP ) AS "DPP",
  SUM( PPN ) AS "PPN",
  SUM( netto ) AS netto
  from vw_sales_product_inc_spec a _JOINTABLE
  _ONKEY
  where transDate between '_BIND01' and '_BIND02' 
  _WHERECONDITION 
  _CASHIER 
  group by _GROUPNAME order by transdate`

const posDailyReportGroupProduct = posDailyReportGroup
  .replace("_FIELDNAME", `a.cashierTransId as "cashierTransId", a.productCode as "productCode", a.productName as "productName"`)
  .replace("_JOINTABLE", "")
  .replace("_ONKEY", "")
  .replace("_WHERECONDITION", "")
  .replace("_GROUPNAME", "a.productId, a.cashierTransId, a.productCode, a.productName, transdate")

const posDailyReportGroupProductCategory = posDailyReportGroup
  .replace("_FIELDNAME", `a.cashierTransId as "cashierTransId", b.categoryName as "categoryName"`)
  .replace("_JOINTABLE", " inner join vw_stock b")
  .replace("_ONKEY", "on a.productId = b.id ")
  .replace("_WHERECONDITION", "")
  .replace("_GROUPNAME", "b.categoryName, a.cashierTransId, transdate")

const posDailyReportGroupProductBrand = posDailyReportGroup
  .replace("_FIELDNAME", `a.cashierTransId as "cashierTransId", b.brandName as "brandName"`)
  .replace("_JOINTABLE", " inner join vw_stock b")
  .replace("_ONKEY", "on a.productId = b.id ")
  .replace("_WHERECONDITION", "")
  .replace("_GROUPNAME", "b.brandName, a.cashierTransId, transdate")

const posDailyReportGroupProductBrandCategory = posDailyReportGroup
  .replace("_FIELDNAME", `a.cashierTransId as "cashierTransId", b.categoryName as "categoryName", b.brandName as "brandName", a.productCode as "productCode", b.productName as "productName"`)
  .replace("_JOINTABLE", " inner join vw_stock b")
  .replace("_ONKEY", "on a.productId = b.id ")
  .replace("_GROUPNAME", "b.categoryName, b.brandName, a.productId, a.productCode, b.productName, a.cashierTransId, transdate")

const posDetailReport = "select * " +
  "from vw_pos_report_sales_detail " +
  "where transDate between '" + "_BIND01" + "' and '" + "_BIND02" + "' " +
  "_WHERECONDITION " +
  "ORDER BY id"

const turnOver = "select * from sp_turn_over(:varPeriod, :varYear, :varStoreId, :varCategory, :varService)"

const compareSalesVsInventory = "select * from sp_compare_sales_inventory(:varPeriod, :varYear, :varDate1, :varDate2, :varCategoryId, :varBrandId, :varStoreId);"

const stringSQL = {
  s00001: posDailyReportGroupProduct,
  s00002: posDailyReportGroupProductBrand,
  s00003: posDailyReportGroupProductCategory,
  s00004: posDailyReportGroupProductBrandCategory,
  s00005: posDetailReport,
  s00006: turnOver,
  s00007: compareSalesVsInventory
}

module.exports = stringSQL