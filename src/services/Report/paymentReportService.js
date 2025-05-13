import dbv from '../../models/view'
import stringSQL from '../../native/report/sqlPaymentReport'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import sequelize from '../../native/sequelize'
import { getNativeQuery } from '../../native/nativeUtils'
import { Op } from 'sequelize'

const vw_payment_005 = dbv.vw_payment_005
const vw_payment_006 = dbv.vw_payment_006
const reportSaldoAWalFields = (transDate, to) => {
  return [
    'id',
    'invoiceDate',
    'transNo',
    'memberName',
    'memberGroupName',
    [sequelize.literal(`
    nettoTotal -
    (select coalesce(sum(a.paid), 0)
    from vw_payment_004 a
      where a.id = vw_payment_006.id
    and date(printDate) < date('${transDate}'))`),
      'beginValue'],
    'transDate',
    [sequelize.literal(`CONVERT(fn_payment_cash(id, '${transDate}', '${to}'), decimal(19,2))`), 'cash'],
    [sequelize.literal(`CONVERT(fn_payment_other(id, '${transDate}', '${to}'), decimal(19,2))`), 'otherPayment'],
    'paid',
    'status',
    ['paid', 'receiveable'],
  ]
}

export function getTransByNo5 (query) {
  if (query.from && query.to) {
    const { from, to, order, sort, ...other } = query
    let ordering = []
    if (order) order[0].split(';').map(e => ordering.push(e.split(',')))
    return vw_payment_005.findAll({
      where: {
        invoiceDate: {
          [Op.and]: {
            [Op.gte]: from,
            [Op.lte]: to
          }
        },
        ...other
      },
      order: order ? ordering : [],
      raw: false
    })
  }
  if (query.transNo && query.storeId) {
    return vw_payment_005.findAll({
      where: {
        transNo: query.transNo,
        storeId: query.storeId,
      },
      raw: false
    })
  }
  return vw_payment_005.findAll({
    raw: false
  })
}

export function getPaymentReportAR (query) {
  let sSQL = stringSQL.s00001.replace(/_DATEPARAMS/g, `'${query.date}'`)
    .replace(/_WHERECLAUSE/g, query.storeId ? ` AND x.storeId in (${query.storeId}) _WHERECLAUSE` : '')
    .replace(/_WHERECLAUSE/g, query.memberGroupId ? ` AND y.memberGroupId in (${query.memberGroupId}) _WHERECLAUSE` : '')
    .replace(/_WHERECLAUSE/g, query.memberName ? ` AND y.memberName like '%${query.memberName}%'` : '')
  sSQL.replace(/_WHERECLAUSE/g, '')

  return getNativeQuery(sSQL, false, 'SELECT')
}

// export function getPaymentReportARGroup (query) {
//   let sSQL = stringSQL.s00002
//     .replace(/_PARAMPERIOD/g, query.period ? query.period : '')
//     .replace(/_PARAMYEAR/g, query.year ? query.year : '')
//     .replace(/_DATEPARAMS/g, query.period ? `a.period <= '${query.period}' _DATEPARAMS` : '')
//     .replace(/_DATEPARAMS/g, query.year ? `AND a.year <= '${query.year}' _DATEPARAMS` : '')
//     .replace(/_DATEPARAMS/g, query.year ? `AND a.invPeriod = '${query.period}' _DATEPARAMS` : '')
//     .replace(/_DATEPARAMS/g, query.year ? `AND a.invYear = '${query.year}'` : '')
//     // .replace(/_WHERECLAUSE/g, query.storeId ? ` AND a.storeId in (${query.storeId}) _WHERECLAUSE` : '')
//     .replace(/_WHERECLAUSE/g, query.memberGroupId ? ` AND b.memberGroupId in (${query.memberGroupId}) _WHERECLAUSE` : '')
//     .replace(/_WHERECLAUSE/g, query.memberName ? ` AND b.memberName like '%${query.memberName}%'` : '')
//     .replace(/_WHERECLAUSE/g, '')
//     .replace(/_ORDERCLAUSE/g, query.sort_by ? `ORDER BY ${query.sort_by}` : '')
//     .replace(/_ORDERCLAUSE/g, '')

//   return getNativeQuery(sSQL, false, 'SELECT')
// }

export function getTransByNo6 (query) {
  if (query.from && query.to) {
    console.log(query)
    const { from, to, order, sort, ...other } = query
    return vw_payment_006.findAll({
      attributes: reportSaldoAWalFields(from, to),
      where: {
        invoiceDate: {
          [Op.gte]: from,
          [Op.lte]: to,
        },
        ...other
      },
      order: [
        ['invoiceDate', 'ASC'],
        ['transNo', 'ASC']
      ],
      raw: false
    })
  }
  if (query.transNo && query.storeId) {
    return vw_payment_006.findAll({
      attributes: reportSaldoAWalFields(from, to),
      where: {
        transNo: query.transNo,
        storeId: query.storeId,
      },
      raw: false
    })
  }
  return vw_payment_006.findAll({
    attributes: reportSaldoAWalFields(from, to),
    raw: false
  })
}

export function getPaymentReportARGroup (query) {
  if (query.from && query.to) {
    const { from, to, order, sort, ...other } = query
    return vw_payment_006.findAll({
      attributes: query.field ? query.field.split(',') : reportSaldoAWalFields(from, to),
      where: {
        invoiceDate: {
          [Op.lt]: from
        },
        status: {
          [Op.ne]: 'PAID'
        },
        ...other
      },
      order: [
        ['invoiceDate', 'ASC'],
        ['transNo', 'ASC']
      ],
      raw: false
    })
  }
}