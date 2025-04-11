import dbv from '../../models/view'
import sequelize from '../../native/sequelize'

const vw_payment_ap_006 = dbv.vw_payment_ap_006

const reportTransFields = [
  'id',
  'supplierName',
  'supplierTaxId',
  'address01',
  'address02',
  'accountNo',
  'accountName',
  'transNo',
  'invoiceDate',
  'tempo',
  'dueDate',
  'beginValue',
  'nettoTotal',
  'transDate',
  'paid',
  'paidBank',
  'bankCode',
  'bankName',
  'checkNo',
  'statusPaid',
  'change',
  'sisa',
]

const reportSaldoAWalFields = (transDate, to) => {
  return [
    'id',   
    'supplierName',
    'supplierTaxId',
    'address01',
    'address02',
    'accountNo',
    'accountName',
    'transNo',
    'invoiceDate',
    'tempo',
    'dueDate',
    [sequelize.literal(`nettoTotal - fn_payable_001(id, '${transDate}')`), 'beginValue'],
    'transDate',
    [sequelize.literal(`CONVERT(fn_payable_002(id, '${transDate}', '${to}'), decimal(19,2))`), 'paid'],
    [sequelize.literal(`CONVERT(fn_payable_003(id, '${transDate}', '${to}'), decimal(19,2))`), 'paidBank'],
    'bankCode',
    'bankName',
    'checkNo',
    'statusPaid',
    'change',
    'sisa',
  ]
}

export function getTransByNo6 (query) {
  if (query.from && query.to) {
    const { from, to, order, sort, ...other } = query
    return vw_payment_ap_006.findAll({
      attributes: reportSaldoAWalFields(from, to),
      where: {
        invoiceDate: {
          $gte: from,
          $lte: to,
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
    return vw_payment_ap_006.findAll({
      attributes: reportSaldoAWalFields(from, to),
      where: {
        transNo: query.transNo,
        storeId: query.storeId,
      },
      raw: false
    })
  }
  return vw_payment_ap_006.findAll({
    attributes: reportTransFields,
    raw: false
  })
}

export function getTransByNoSaldoAwal (query) {
  if (query.from && query.to) {
    const { from, to, order, sort, ...other } = query
    return vw_payment_ap_006.findAll({
      attributes: query.field ? query.field.split(',') : reportSaldoAWalFields(from, to),
      where: {
        invoiceDate: {
          $lt: from
        },
        statusPaid: {
          $ne: 'PAID'
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