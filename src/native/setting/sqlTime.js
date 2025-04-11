const getTime = "select current_time as time"
const getDate = "select current_date as time"
const getTimeStamp = "select current_timestamp as time"

const stringSQL = {
  s00001: getTime,
  s00002: getDate,
  s00003: getTimeStamp
}

module.exports = stringSQL