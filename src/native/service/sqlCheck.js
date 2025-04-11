const sqlMandatoryChecks = `SELECT a.checkCode as "checkCode", a.checkName as "checkName", a.checkMileage as "checkMileage",
  a.checkTimePeriod "checkTimePeriod" FROM tbl_service_check a WHERE a.checkType='M'
  ORDER BY a.checkCode;`
const getServiceChecksUsage = `
SELECT
  max(transNoId) as transNo,
  policeNo,
  policeNoId,
  productName,
  lastMeter,
  nextServiceMeter,
  transDate,
  round(diffMonth / 30)                                                            AS diffDay,
  round(lastMeter / diffMonth / 30)                                                AS diffMeter,
  DATE_ADD(transDate,
           INTERVAL (round(lastMeter /
            diffMonth / 30
            )) DAY) AS nextServiceKM,
  IF(usageTimePeriod > 0, DATE_ADD(transDate, INTERVAL usageTimePeriod DAY), NULL) AS nextServiceDate
FROM vw_pos_024
WHERE 
_WHERECLAUSE
GROUP BY productId, policeNo
`
const native = {
  sqlMandatoryChecks,
  getServiceChecksUsage,
}

module.exports = native