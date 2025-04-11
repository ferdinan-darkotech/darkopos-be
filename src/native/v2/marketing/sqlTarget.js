// without stock outlet
const realizationsProduct = `select * from fn_realization_target_product('_BIND01', '_BIND02', '_BIND03', '_BIND04', _BIND05)`
// with stock outlet
const realizationsOther = `select * from fn_realization_target_other('_BIND01', '_BIND02', '_BIND03', '_BIND04')`
// params => (storeid, headerid, mtd)
const native = {
  realizationsProduct,
  realizationsOther
}

module.exports = native