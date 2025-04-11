import moment from 'moment'
import db from '../../../models/tableR'
import { getNativeQuery } from '../../../native/nativeUtils'
import sequelize from '../../../native/sequelize'

const cashierBalance = db.tbl_cashier_balance

const cashierBalanceAttr = {
   mf: ['storeid', 'cashierid', 'period', 'transkind', 'beginbalance', 'status', 'createdby', 'createdat'],
   bf: ['storeid', 'cashierid', 'period', 'transkind', 'beginbalance', 'status'],
   active: ['storeid', 'cashierid', [sequelize.literal("to_char(max(period), 'YYYY-MM-DD')"), 'period'], 'transkind'], // only work on postgres
   lov: ['period', 'beginbalance', 'status']
}

export function srvGetAllActivePeriod (query) {
  return cashierBalance.findAll({
    attributes: cashierBalanceAttr.active,
    where: {
      storeid: query.store,
      cashierid: query.cashier,
      status: 'O'
    },
    group: ['storeid', 'cashierid', 'transkind'],
    raw: true
  })
}

export function srvGetActivePeriod (query, type = 'lov') {
  return cashierBalance.findOne({
    attributes: cashierBalanceAttr[type],
    where: {
      transkind: query.transkind,
      storeid: query.store,
      cashierid: query.cashier,
      status: 'O'
    },
    order: [['period', 'desc']],
    raw: false
  })
}

export function srvCreateCashBalance (data, userLogin) {
  return cashierBalance.create({
    storeid: data.store,
    cashierid: data.cashier,
    period: data.period,
    transkind: data.trans,
    beginbalance: data.balance,
    status: 'O',
    createdby: userLogin,
    createdat: moment()
  }, { returning: ['period', 'beginbalance', 'status'] })
}

export function srvGetEndBalance (query, next) {
  const {
    store, cashier, period, trans 
  } = query
  const ssql = `select * from sch_pos.fn_get_end_balance('${store}', '${cashier}', '${period}', '${trans}') val`
  return getNativeQuery(ssql, false, 'RAW', next).then(dt => {
    return dt[0][0].val ? { period, balance: dt[0][0].val } : {}
  }).catch(er => er)
}

export function srvCloseCashPeriod (query, next) {
  const {
    store, cashier, period, trans 
  } = query
  const ssql = `select * from sch_pos.fn_close_cashier_balance('${store}', '${cashier}', '${period}', '${trans}') val`
  return getNativeQuery(ssql, false, 'RAW', next).then(dt => {
    return dt[0][0].val
  }).catch(er => er)
}