import db from '../models'
import { ApiError} from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
const sequelize = require('sequelize');

let CashierTrans = db.tbl_cashier_trans

export function setCashierTransInfo(request) {
  const getCashierTransInfo = {
    id: request.id,
    cashierNo: request.cashierNo,
    shift: request.shift,
    balance: request.balance,
    cashierId: request.cashierId,
    transDate: request.transDate,
    total: request.total,
    status: request.status,
  }

  return getCashierTransInfo
}

export function getCashierTransData() {
  return CashierTrans.findAll({raw: false});
}

// AFX : restricted function
export function getCashierTransById(cashierId, cashierNo, shift, storeId, transDate, status) {
  return CashierTrans.findOne({
    where: {
      $and: [
        { storeId: { $iRegexp: storeId } },
        { cashierId: { $iRegexp: cashierId } },
        { cashierNo: { $iRegexp: cashierNo } },
        { shift: { $iRegexp: shift } },
        { transDate: { $eq: transDate } },
        { status: { $eq: status } },
      ]
    },
    raw: false
  })
}

export function createCashierTrans(cashierTrans) {
  const dataTrans = JSON.parse(cashierTrans);

  console.log('dataTrans', dataTrans)

  return CashierTrans.create({
    storeId: dataTrans.storeId,
    cashierNo: dataTrans.cashierNo,
    shift: dataTrans.shift,
    balance: dataTrans.balance,
    cashierId: dataTrans.cashierId,
    transDate: dataTrans.transDate,
    total: dataTrans.total,
    totalCreditCard: dataTrans.totalCreditCard,
    status: dataTrans.status,
  })
}

export function updateCashierTrans(cashierTrans) {
  const dataTrans = JSON.parse(cashierTrans);
  console.log(sequelize.col('total').col)
  return CashierTrans.update({
      total: sequelize.literal('total + ' + parseInt(dataTrans.total)),
      totalCreditCard: sequelize.literal('totalCreditCard + ' + parseInt(dataTrans.totalCreditCard)),
      status: dataTrans.status,
    },
    {
      where: {
        $and: [
          {
            storeId: {
              $eq: dataTrans.storeId
            }
          },
          {
            cashierNo: {
              $eq: dataTrans.cashierNo
            }
          },
          {
            shift: {
              $eq: dataTrans.shift
            }
          },
          {
            transDate: {
              $eq: dataTrans.transDate
            }
          }
        ]
      },
    }
  )
}