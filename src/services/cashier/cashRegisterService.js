import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import sequelize from '../../native/sequelize'
import stringSQLNative from '../../native/sqlSequence'
import { getNativeQuery, getSelectOrder } from '../../native/nativeUtils'
import moment from 'moment'

const CashierTrans = db.tbl_cashier_trans
const tbl_sequence = db.tbl_sequence
const CashRegisterRequest = db.tbl_cashier_trans_request
const vwCashierTrans = dbv.vw_cashier_trans
const vwCashierTransLog = dbv.vw_cashier_trans_request
const vwCashierTransRequest = dbv.vw_cashier_trans_collapse
const vwCashierTransLogFields = [
  'id',
  'storeId',
  'transNo',
  'transDate',
  'cashierTransId',
  'previousValue',
  'newValue',
  'problemDesc',
  'actionDesc',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'cashRegisterStore'
]
const vwCashierTransRequestFields = [
  'id',
  'storeId',
  'storeName',
  'cashierId',
  'period',
  'shiftId',
  'shiftName',
  'counterId',
  'counterName',
  'openingBalance',
  'cashIn',
  'cashOut',
  'closingBalance',
  'status',
  'employeeName',
  'isCashierActive',
  'isEmployeeActive',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'transNo',
  'transDate',
  'problemDesc',
  'actionDesc'
]

const sqlGetPeriodStatus = "SELECT * from fn_cash_register_period('" + "_BIND01" + "'," +
  "_BIND02" + ",'" + "_BIND03" + "'," + "_BIND04" + "," + "_BIND05" + "," + "_BIND06" + ") AS periodStatus"
const sqlGetStoreCashRegister = `SELECT * from fn_store_setting_001(_BIND01,'cashRegisterPeriods.active',1) AS "isActivate"`
const sqlGetCashierCurrentBalance = "SELECT * from fn_cash_register_balance('" +
  "_BIND01" + "'," + "_BIND02" + ",'" + "_BIND03" + "'," + "_BIND04" + ") AS currentBalance"


const stringSQL = {
  s00001: sqlGetPeriodStatus,
  s00002: sqlGetStoreCashRegister,
  s00003: sqlGetCashierCurrentBalance,
  s00004: stringSQLNative.s00001,
  s00005: stringSQLNative.s00002
}

export function srvSetCashRegisterInfo (request) {
  const getCashRegisterInfo = {
    storeId: request.storeId,
    cashierId: request.cashierId,
    period: request.period,
    shiftName: request.shiftName,
    counterName: request.counterName,
    cash: request.openingBalance,
    status: request.status
  }

  return getCashRegisterInfo
}

export function srvGetCashRegisterByCols (register) {
  return vwCashierTrans.findOne({
    where: {
      storeId: register.storeId,
      cashierId: register.cashierId,
      period: register.period,
      shiftId: register.shiftId,
      counterId: register.counterId,
    },
    raw: false
  })
}
export function srvGetCashRegisterById (id) {
  return vwCashierTrans.findOne({
    where: {
      id: id
    },
    raw: false
  })
}
export function srvGetCashRegisterLogById (id) {
  return vwCashierTransLog.findAll({
    attributes: vwCashierTransLogFields,
    where: {
      cashierTransId: id
    },
    raw: false
  })
}
export function srvGetCashRegisterLogByLogId (id, logid) {
  return vwCashierTransLog.findAll({
    attributes: vwCashierTransLogFields,
    where: {
      cashierTransId: id,
      id: logid
    },
    raw: false
  })
}
export function srvGetCashRegisterByIdStatus (id, status) {
  return vwCashierTrans.findOne({
    where: {
      id: id,
      status: status
    },
    raw: false
  })
}

export function srvCashRegisterExists (register) {
  return srvGetCashRegisterByCols(register).then(cashregister => {
    if (cashregister === null) {
      return false;
    }
    return true;
  })
}

export function srvCashRegisterActive (register) {
  return vwCashierTrans.findOne({
    where: {
      storeId: register.storeId,
      cashierId: register.cashierId,
      status: 'O',
      shiftId: register.shiftId,
      counterId: register.counterId,
    },
    raw: false
  })
}

export function srvCashRegisterIdExists (id) {
  return srvGetCashRegisterById(id).then(cashregister => {
    if (cashregister == null) {
      return false;
    }
    else {
      return true;
    }
  })
}
export function srvCashRegisterIdStatusExists (id, status) {
  return srvGetCashRegisterByIdStatus(id, status).then(cashregister => {
    if (cashregister == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function srvGetCashRegisters (query, pagination) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { $between: query[key] }
    }
  }
  const { pageSize, page, order } = pagination
  let sort
  if (order) sort = getSelectOrder(order)

  if ((query.hasOwnProperty('from')) && (query.hasOwnProperty('to'))) {
    query.period = { $between: [query.from, query.to] }
    delete query.from
    delete query.to
  }
  if (query.hasOwnProperty('from')) {
    query.period = { $between: [query.from, query.from] }
    delete query.from
  }
  if (query.status === 'R') {
    return vwCashierTransRequest.findAndCountAll({
      attributes: vwCashierTransRequestFields,
      where: {
        ...query,
      },
      order: sort,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vwCashierTrans.findAndCountAll({
      where: {
        ...query,
      },
      order: sort,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  }
}

export function srvCreateCashRegister (register, createdBy, next) {
  return srvGetCashierCurrentBalance(register.cashierId, register.storeId, register.period, register.shiftId, next).then(cashregister => {
    return CashierTrans.create({
      storeId: register.storeId,
      cashierId: register.cashierId,
      period: register.period,
      shiftId: register.shiftId,
      counterId: register.counterId,
      openingBalance: (cashregister.currentBalance || register.cash) || 0,
      cashIn: 0,
      cashOut: 0,
      closingBalance: (cashregister.currentBalance || register.cash) || 0,
      status: register.status,
      createdBy: createdBy,
      createdAt: moment()
    }).catch(err => {
      const errObj = JSON.parse(JSON.stringify(err))
      const { parent, original, sql, ...other } = errObj
      next(new ApiError(400, other, err))
    })
  })
}

export function srvUpdateCashRegister (id, register, updateBy, newStatus, next) {
  let nextStatus
  if (newStatus) nextStatus = newStatus.next
  return CashierTrans.update({
    storeId: register.storeId,
    cashierId: register.cashierId,
    period: register.period,
    shiftId: register.shiftId,
    counterId: register.counterId,
    openingBalance: register.cash,
    status: nextStatus || register.status,
    updatedBy: updateBy,
    updatedAt: moment()
  },
    { where: { id: id } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvCloseCashRegister (id, updateBy, next) {
  return CashierTrans.update({
    status: 'C',
    updatedBy: updateBy
  },
    { where: { id: id, status: 'O' } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvRequestOpenCashRegister (id, updateBy, next) {
  return CashierTrans.update({
    status: 'R',
    updatedBy: updateBy
  },
    { where: { id: id, status: 'C' } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvUpdateCashRegisterStatus (id, status, register, updateBy, next) {
  let registerValue = {}
  if (register) {
    registerValue = register
  }
  return CashierTrans.update({
    status: status.next,
    ...registerValue,
    updatedBy: updateBy
  },
    { where: { id: id, status: status.current } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvCloseOtherCashRegister (id, status, register, updateBy, next) {
  let registerValue = {}
  if (register) {
    registerValue = register
  }

  return srvGetCashRegisterById(id).then(register => {
    if (!isEmpty(register)) {
      return CashierTrans.update({
        status: 'C',
        ...registerValue,
        updatedBy: updateBy
      },
        { where: { storeId: register.storeId, cashierId: register.cashierId, status: 'O', id: { $ne: id } } }
      ).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const { parent, original, sql, ...other } = errObj
        next(new ApiError(501, other, err))
      })
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}



export function srvDeleteUserCashier (id, next) {
  return CashierTrans.destroy({
    where: {
      id: id
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function srvCreateCashRegisterLog (id, register, paramStatus, createdBy, next) {
  return srvGetCashRegisterById(id, next).then(cashregister => {
    let previousValue = {}
    if (cashregister) previousValue = cashregister
    return sequelize.transaction(
      function (t) {
        let sSQL = stringSQL.s00004
        return sequelize.query(sSQL, {
          replacements: {
            seqCode: 'CRR',
            seqType: register.storeId
          },
          type: sequelize.QueryTypes.CALL
        }).then((sqc) => {
          const sequence = sqc[0]
          let desc = {
            newValue: paramStatus,
            problemDesc: register.problemDesc,
            actionDesc: register.actionDesc
          }
          if (paramStatus.next === 'O') {
            desc = {
              newValue: paramStatus,
              problemDesc: '---',
              actionDesc: 'approved'
            }
          } else if (paramStatus.next === 'C') {
            desc = {
              newValue: paramStatus,
              problemDesc: '---',
              actionDesc: 'closed'
            }
          }
          return CashRegisterRequest.create({
            storeId: register.storeId,
            transNo: sequence[0].seq,
            transDate: register.transDate || new Date().toISOString().split('T')[0],
            cashierTransId: id,
            previousValue: previousValue,
            newValue: { "status": "R" },
            ...desc,
            createdBy: createdBy,
            createdAt: moment()
          }, { transaction: t }).then(result => {

            /******************/
            return tbl_sequence.findOne({
              attributes: ['seqValue'],
              where: {
                seqCode: 'CRR',
                storeId: register.storeId
              }
            }).then(resultSeq => {
              return tbl_sequence.update({
                seqValue: resultSeq.seqValue + 1
              }, {
                  where: {
                    seqCode: 'CRR',
                    storeId: register.storeId
                  }
                }).catch(err => {
                  t.rollback()
                  next(new ApiError(422, err + `Couldn't update sequence.`, err))
                })
            }).catch(err => {
              t.rollback()
              next(new ApiError(422, err + `Couldn't update sequence.`, err))
            })
            /*******************/

            // let retObject = {};
            // retObject = result['dataValues']
            // if (!isEmpty(retObject)) {
            //   getNativeQuery(stringSQL.s00005
            //     .replace(":seqCode", 'CRR')
            //     .replace(":storeId", register.storeId)
            //     , true)
            // }
            // return retObject
          }).catch(err => {
            t.rollback()
            const errObj = JSON.parse(JSON.stringify(err))
            const { parent, original, sql, ...other } = errObj
            next(new ApiError(400, other, err))
          })
        }).catch(err => {
          t.rollback()
          const errObj = JSON.parse(JSON.stringify(err))
          const { parent, original, sql, ...other } = errObj
          next(new ApiError(404, `Couldn't find sequence.`, err))
        })
      }).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const { parent, original, sql, ...other } = errObj
        next(new ApiError(422, err + `Couldn't create ${cashregister}.`, err))
      })
  })
}

export function srvGetPeriodStatus (cashierId, storeId, period, shiftId, counterId, mode = 0, next) {
  const sSQL = stringSQL.s00001
  return getNativeQuery(sSQL
    .replace("_BIND01", cashierId)
    .replace("_BIND02", storeId)
    .replace("_BIND03", period)
    .replace("_BIND04", shiftId)
    .replace("_BIND05", counterId)
    .replace("_BIND06", mode)
    , true)
}
export function srvGetStoreCashRegisterActivate (storeId, next) {
  const sSQL = stringSQL.s00002
  return getNativeQuery(sSQL
    .replace("_BIND01", storeId)
    , true)
}
export function srvGetCashierCurrentBalance (cashierId, storeId, period, shiftId, next) {
  const sSQL = stringSQL.s00003
  return getNativeQuery(sSQL
    .replace("_BIND01", cashierId)
    .replace("_BIND02", storeId)
    .replace("_BIND03", period)
    .replace("_BIND04", shiftId)
    , true)
}