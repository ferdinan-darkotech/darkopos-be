import dbv from '../../../models/view'
import { switchModeField } from '../function/srvUtils'

// must be refactor
const viewSaleHead = dbv.vw_pos
const viewSaleHeadDay = dbv.vw_pos_report_day

const idField = ['id']
const viewSaleHeadMainFields = ['id', 'woId', 'storeId', 'cashierTransId', 'cashierName', 'transNo', 'woReference', 'technicianName', 'technicianId', 'memberId', 'memberCode', 'memberName', 'transDate', 'total', 'creditCardNo', 'creditCardType', 'creditCardCharge',
  'totalCreditCard', 'discount', 'rounding', 'paid', 'change', 'policeNo', 'policeNoId', 'year', 'merk', 'model', 'type', 'chassisNo', 'machineNo', 'lastMeter', 'discountLoyalty', 'lastCashback', 'gettingCashback', 'status', 'memo', 'paymentVia', 'taxType',
  'address01', 'address02', 'mobileNumber', 'phoneNumber', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'no_tax_series' // [NEW]: FERDINAN - 2025-03-18
]
const viewSaleHeadMinFields01 = ['transNo', 'transDate']

export async function srvGetSaleByStoreTransNo (storeId, transNo, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = viewSaleHeadMainFields
  let where = { storeId, transNo }
  const modeField = switchModeField(other)

  switch (modeField) {
    case 'main': attributes = viewSaleHeadMainFields; break
    case 'min': attributes = viewSaleHeadMinFields01; break
    case 'getid': attributes = idField; break
    default: attributes = viewSaleHeadMainFields
  }

  if (modeField === 'sdel') delete where.deletedAt

  return viewSaleHead.findOne({
    attributes,
    where,
    raw: false
  })
}

// [POS SALES ONE DAY]: FERDINAN - 2025-04-24
export async function srvGetSaleByStoreOneDay(storeid, date) {
  console.log("date >>> ", date)
  return viewSaleHeadDay.findAll({
    where: {
      storeid: storeid,
      transdate: date
    }
  })
}