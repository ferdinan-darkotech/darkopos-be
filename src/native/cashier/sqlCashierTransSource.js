const sqlTransUnion = `SELECT cashierTransId as "cashierTransId", transType as "transType", cashIn as "cashIn",
cashOut as "cashOut" FROM vw_cashier_trans_source _BIND01 _ORDER01 _LIMIT01`
const sqlTransUnionSum = `SELECT sum(cashIn) AS "cashIn", sum(cashOut) AS "cashOut" FROM vw_cashier_trans_source _BIND01 _ORDER01 _LIMIT01`
const sqlTransDetail001 = `SELECT transNo as "transNo", to_char(transDate::date, 'YYYY-MM-DD') as "transDate", transDesc as "transDesc",
cashIn as "cashIn", cashOut as "cashOut" FROM vw_cashier_trans_source_detail _BIND01 _ORDER01 _LIMIT01`
const sqlTransDetail002 = `SELECT transNo as "transNo", to_char(transDate::date, 'YYYY-MM-DD') as "transDate", transDesc as "transDesc",
cashIn as "cashIn", cashOut as "cashOut" FROM vw_cashier_trans_source_detail_002 _BIND01 _ORDER01 _LIMIT01`
const sqlTransDetailSum001 = `SELECT sum(cashIn) AS "cashIn", sum(cashOut) AS "cashOut"
FROM vw_cashier_trans_source_detail _BIND01 _ORDER01 _LIMIT01`
const sqlTransDetailSum002 = `SELECT sum(cashIn) AS "cashIn", sum(cashOut) AS "cashOut"
FROM vw_cashier_trans_source_detail_002 _BIND01 _ORDER01 _LIMIT01`

const native = {
  sqlTransUnion,
  sqlTransUnionSum,
  sqlTransDetail001,
  sqlTransDetail002,
  sqlTransDetailSum001,
  sqlTransDetailSum002
}

module.exports = native