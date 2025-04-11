const posGroupTransNo = `
  with q_pos as (
    select
      y.id,
      y.id as transnoid,
      x.storeid,
      x.policenoid,
      x.policeno,
      x.lastmeter,
      x.membercode AS memberid,
      x.transno,
      x.transdate,
      x.transtime,
      x.cashiertransid,
      y.employeeid as technicianid,
      y.employeecode as techniciancode,
      y.employeename as technicianname,
      x.cashierid,
      x.cashiername,
      x.status,
      sum(y.dpp) AS dpp,
      sum(y.ppn) AS ppn,
      sum(y.dpp + y.ppn) AS nettototal
    FROM sch_pos.vw_pos x
    left join sch_pos.vw_pos_detail y on x.storeid = y.storeid and x.transno = y.transno
    where x.status = 'A'
    GROUP BY y.id, y.id, x.storeid, x.policenoid, x.policeno, x.lastmeter, x.membercode, x.transno, x.transdate, x.transtime,
    x.cashiertransid, y.employeeid, y.employeecode, y.employeename, x.cashierid, x.cashiername, x.status
  ) select * from q_pos 
` +
  " _BIND01 " +
  " _WHERECONDITION "

const purchaseGroupTransNo = "SELECT * FROM vw_payment_ap_005 " +
  " _BIND01 " +
  " _WHERECONDITION "
const stringSQL = {
  s00001: posGroupTransNo,
  s00002: purchaseGroupTransNo
}

module.exports = stringSQL