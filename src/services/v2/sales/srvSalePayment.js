import vw from '../../../models/viewR'
import { switchModeField } from '../function/srvUtils'

// must be refactor
const viewSalePayment = vw.vwi_sale_payment

const idField = ['transNo']
const viewSalePaymentMainFields = ['transNo', 'transDate', 'paymentOptionCode', 'paymentTypeName', 'providerName',
  'cardNo', 'cardInfo', 'edcName', 'netto'
]
const viewSalePaymentMinFields01 = ['paymentOptionCode', 'netto']
const viewSalePaymentMinFields02 = ['paymentOptionCode', 'paymentTypeName', 'providerName',
  'cardNo', 'cardInfo', 'edcName', 'netto'
]

export async function srvGetSalePaymentByStoreTransNo (storeId, transNo, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = viewSalePaymentMinFields01
  let where = { storeId, transNo }
  const modeField = switchModeField(other)

  switch (modeField) {
    case 'main': attributes = viewSalePaymentMainFields; break
    case 'min': attributes = viewSalePaymentMinFields01; break
    case 'brow': attributes = viewSalePaymentMinFields02; break
    case 'getid': attributes = idField; break
    default: attributes = viewSalePaymentMinFields02
  }

  if (modeField === 'sdel') delete where.deletedAt

  return viewSalePayment.findAll({
    attributes,
    where,
    raw: false
  })
}

