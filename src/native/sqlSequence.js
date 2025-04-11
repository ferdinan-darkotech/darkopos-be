const getSequenceNo = "select sp_sequence(:seqCode,:seqType) as seq"
const updateAndGetNextSequence = "select fn_seq_005(':seqCode',:storeId)"

const stringSQL = {
  s00001: getSequenceNo,
  s00002: updateAndGetNextSequence
}

module.exports = stringSQL