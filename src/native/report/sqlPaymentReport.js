const payment001 = `
  SELECT
    x.invoiceDate,
    x.transNo,
    x.memberId,
    y.memberName,
    y.memberGroupId,
    y.memberGroupName,
    COALESCE(x.paid, 0) AS paid,
    CONVERT(x.nettoTotal, DECIMAL(19,2)) AS nettoTotal,
    CONVERT(x.nettoTotal, DECIMAL(19,2)) - COALESCE(x.paid, 0) AS restNetto,
    x.status,
    TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) AS Time,
    CASE WHEN TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) > 120
              AND x.nettoTotal - COALESCE(x.paid, 0) > 0
      THEN CONVERT(x.nettoTotal - COALESCE(x.paid, 0), DECIMAL(19,2))
    ELSE NULL
    END                                                              AS gt120days,
    CASE WHEN TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) > 90 AND
              TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) <= 120
              AND x.nettoTotal - COALESCE(x.paid, 0) > 0
      THEN CONVERT(x.nettoTotal - COALESCE(x.paid, 0), DECIMAL(19,2))
    ELSE NULL
    END                                                              AS gt90days,
    CASE WHEN TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) > 60 AND
              TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) <= 90
              AND x.nettoTotal - COALESCE(x.paid, 0) > 0
      THEN CONVERT(x.nettoTotal - COALESCE(x.paid, 0), DECIMAL(19,2))
    ELSE NULL
    END                                                              AS gt60days,
    CASE WHEN TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) > 30 AND
              TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) <= 60
              AND x.nettoTotal - COALESCE(x.paid, 0) > 0
      THEN CONVERT(x.nettoTotal - COALESCE(x.paid, 0), DECIMAL(19,2))
    ELSE NULL
    END                                                              AS gt30days,
    CASE WHEN TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) > 16 AND
              TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) <= 30
              AND x.nettoTotal - COALESCE(x.paid, 0) > 0
      THEN CONVERT(x.nettoTotal - COALESCE(x.paid, 0), DECIMAL(19,2))
    ELSE NULL
    END                                                              AS gt15days,
    CASE WHEN TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) > 0 AND
              TIMESTAMPDIFF(DAY, CONVERT(x.invoiceDate, DATE), _DATEPARAMS) <= 15
              AND x.nettoTotal - COALESCE(x.paid, 0) > 0
      THEN CONVERT(x.nettoTotal - COALESCE(x.paid, 0), DECIMAL(19,2))
    ELSE NULL
    END                                                              AS gte0day
  FROM vw_payment_005 x
    INNER JOIN vw_member y ON x.memberId = y.id
    WHERE x.invoiceDate <= _DATEPARAMS
    AND x.status != 'PAID'
    _WHERECLAUSE
    ORDER BY x.invoiceDate
`

const payment002 = `
  SELECT
  a.transDate,
  a.invoiceDate,
  a.transNo,
  a.status,
  b.memberName,
  b.memberTypeId,
  b.memberTypeName,
  b.memberGroupId,
  b.memberGroupName,
  a.nettoTotal - a.paid as beginValue,
  a.nettoTotal,
  0 AS cash,
  0 AS otherPayment,
  0 AS paid,
  COALESCE(a.nettoTotal, 0) - COALESCE(a.paid, 0) AS receiveable
FROM vw_payment_005 a
  INNER JOIN vw_member b
    ON a.memberId = b.id
WHERE a.invoiceDate < (SELECT DATE_ADD(MAKEDATE(_PARAMYEAR, 1), INTERVAL (_PARAMPERIOD) - 1 MONTH))
AND a.status <> 'PAID'
_WHERECLAUSE
UNION ALL
SELECT
  a.transDate,
  a.invoiceDate,
  a.transNo,
  a.status,
  b.memberName,
  b.memberTypeId,
  b.memberTypeName,
  b.memberGroupId,
  b.memberGroupName,
  a.nettoTotal - a.paid as beginValue,
  a.nettoTotal,
  CASE WHEN a.typeCode = 'C'
    THEN a.paid
  ELSE 0 END cash,
  CASE WHEN a.typeCode != 'C'
    THEN a.paid
  ELSE 0 END AS otherPayment,
  COALESCE(a.paid, 0) as paid,
  COALESCE(a.nettoTotal, 0) - COALESCE(a.paid, 0) as receiveable
FROM vw_payment_005 a
INNER JOIN vw_member b
ON a.memberId = b.id
where _DATEPARAMS
AND a.status <> 'PAID'
_WHERECLAUSE
 _ORDERCLAUSE
`

const stringSQL = {
  s00001: payment001,
  s00002: payment002
}

module.exports = stringSQL