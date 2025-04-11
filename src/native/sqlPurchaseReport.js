//remove unused columns for simplification
const sqlPurchaseDailyReportGroup = "select _FIELDNAME, " +
  "SUM( qty ) AS qty, " +
  "SUM( purchasePrice ) AS purchasePrice, " +
  "SUM( total ) AS total, " +
  "SUM( discInvoicePercent ) AS discInvoicePercent, " +
  "SUM( discInvoiceNominal ) AS discInvoiceNominal, " +
  "SUM( discItem ) AS discItem, " +
  "SUM( discInvoice ) AS discInvoice, " +
  "SUM( rounding ) AS rounding, " +
  "SUM(roundingItem) + SUM(rounding_netto) AS roundingItem, " +
  "SUM( grandTotal ) AS grandTotal, " +
  "SUM( portion ) AS portion, " +
  "SUM( totalDiscount ) AS totalDiscount, " +
  "SUM(DPP + rounding_dpp) AS DPP, " +
  "SUM(PPN + rounding_ppn) AS PPN, " +
  "SUM( totalDiscount ) AS discounts, " +
  "(SUM(roundingItem + rounding_netto) + (SUM(PPN + rounding_ppn) + SUM(DPP + rounding_dpp))) AS netto " +
  "from vw_purchase_detail a _JOINTABLE " +
  "_ONKEY " +
  "where transDate between '" + "_BIND01" + "' and '" + "_BIND02" + "' " +
  "_WHERECONDITION " +
  "group by _GROUPNAME " +
  "order by transDate"

const sqlPurchaseDailyReportGroupProduct = sqlPurchaseDailyReportGroup
  .replace("_FIELDNAME", "a.productCode, a.productName")
  .replace("_JOINTABLE", "")
  .replace("_ONKEY", "")
  .replace("_WHERECONDITION", "")
  .replace("_GROUPNAME", "a.productId, transdate")

const sqlPurchaseDailyReportGroupProductCategory = sqlPurchaseDailyReportGroup
  .replace("_FIELDNAME", "b.categoryName")
  .replace("_JOINTABLE", " inner join vw_stock b")
  .replace("_ONKEY", "on a.productId = b.id ")
  .replace("_WHERECONDITION", "")
  .replace("_GROUPNAME", "b.categoryName, transdate")

const sqlPurchaseDailyReportGroupProductBrand = sqlPurchaseDailyReportGroup
  .replace("_FIELDNAME", "b.brandName")
  .replace("_JOINTABLE", " inner join vw_stock b")
  .replace("_ONKEY", "on a.productId = b.id ")
  .replace("_WHERECONDITION", "")
  .replace("_GROUPNAME", "b.brandName, transdate")

const sqlPurchaseDailyReportGroupProductBrandCategory = sqlPurchaseDailyReportGroup
  .replace("_FIELDNAME", `a.categoryName as "categoryName", a.brandName as "brandName",
                          a.productCode as "productCode", a.productName as "productName"`
  )
  .replace("_JOINTABLE", "")
  .replace("_ONKEY", "")
  .replace("_GROUPNAME", "a.categoryName, a.brandName, a.productid, a.productCode, a.productName, transdate")

const stringSQL = {
  s00001: sqlPurchaseDailyReportGroupProduct,
  s00002: sqlPurchaseDailyReportGroupProductBrand,
  s00003: sqlPurchaseDailyReportGroupProductCategory,
  s00004: sqlPurchaseDailyReportGroupProductBrandCategory,
}

module.exports = stringSQL