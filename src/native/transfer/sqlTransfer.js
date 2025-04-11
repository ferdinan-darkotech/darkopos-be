const mutasiIn = "CALL sp_insert_transfer_in(:varReference)"
const mutasiOut = "select * from sp_insert_transfer_out_001(:varStoreId, :varProductId)"
const mutasiOutHpokok = "CALL sp_insert_transfer_out(:varReference)"
const mutasiOutExists = `
select * from temp_pos_detail_show(_BIND01, _BIND02, _BIND03, _BIND04)
`
const stringSQL = {
  s00001: mutasiIn,
  s00002: mutasiOut,
  s00003: mutasiOutHpokok,
  s00004: mutasiOutExists
}

module.exports = stringSQL