const sqlAlertQty = "call " +
  "sp_saldo_stock_002(" + "_BIND01" + ",'" + "_BIND02" + "','" + "_BIND03" + "');"
const sqlActiveZeroQty = "CALL sp_util_exec_statement_003(_BIND01,'_BIND02',fn_query_saldo_stock_004());"
const sqlCheckProductPrice = "CALL spr_sync_product_price_001('_BIND01','_BIND02');"
const sqlSyncProductPrice = "CALL spr_sync_product_price_002('_BIND01','_BIND02','_BIND03');"


const native = {
  sqlAlertQty,
  sqlActiveZeroQty,
  sqlCheckProductPrice,
  sqlSyncProductPrice
}

module.exports = native