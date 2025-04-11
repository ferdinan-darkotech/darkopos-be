import dbv from '../../../models/view'
import { switchModeField } from '../function/srvUtils'

// must be refactor
const viewSaleDetail = dbv.vw_pos_detail

const idField = ['id']
const viewSaleDetailMainFields = ['id', 'typeCode', 'transNo', 'bundlingId', 'bundlingCode', 'bundlingName',
  'productId', 'serviceCode', 'serviceName', 'productCode', 'productName', 'qty', 'trade_in_id',
  'sellPrice', 'sellingPrice', 'DPP', 'PPN', 'discountLoyalty', 'discount', 'disc1', 'disc2', 'disc3',

  // [NEW]: FERDINAN - 2025-03-26
  'salestype', 'additionalpricepercent', 'additionalpricenominal'
]
const viewSaleDetailMinFields01 = ['transNo', 'productCode', 'serviceCode']
const viewSaleDetailMinFields02 = ['typeCode', 'transNo', 'trade_in_id',
  'serviceCode', 'serviceName', 'productCode', 'productName', 'qty',
  'sellPrice', 'sellingPrice', 'DPP', 'PPN', 'discountLoyalty', 'discount', 'disc1', 'disc2', 'disc3', 'keterangan',

  // [NEW]: FERDINAN - 2025-03-26
  'salestype', 'additionalpricepercent', 'additionalpricenominal'
]

export async function srvGetSaleDetailByStoreTransNo (storeId, transNo, query = {}) {
  let { pageSize, page, order, q, ...other } = query
  let attributes = viewSaleDetailMainFields
  let where = { storeId, transNo }
  const modeField = switchModeField(other)

  switch (modeField) {
    case 'main': attributes = viewSaleDetailMainFields; break
    case 'min': attributes = viewSaleDetailMinFields01; break
    case 'brow': attributes = viewSaleDetailMinFields02; break
    case 'getid': attributes = idField; break
    default: attributes = viewSaleDetailMainFields
  }

  if (modeField === 'sdel') delete where.deletedAt

  return viewSaleDetail.findAll({
    attributes,
    where,
    raw: false
  })
}

