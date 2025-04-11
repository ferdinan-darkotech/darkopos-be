const mutasi = "select * from sp_mutasi_out_new(:varPeriod, :varYear, :varStoreId, :varTransNo)"

const stringSQL = {
  s00001: mutasi
}

module.exports = stringSQL