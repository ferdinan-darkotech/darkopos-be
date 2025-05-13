import vw from '../../../models/viewR'
import tbl from '../../../models/tableR'
import moment from 'moment'
import { getNativeQuery } from '../../../native/nativeUtils'
import { setDefaultQuery } from '../../../utils/setQuery'
import customeSequelize from '../../../native/sequelize'
import { Op } from 'sequelize'

const tbWarrantyProduct = tbl.tbl_warranty_products
const vwWarrantyProduct = vw.vw_warranty_products

const attrWarrantyProducts = {
  mf: [
    'warranty_id', 'warranty_no', 'store_id', 'store_code', 'store_name', 'sales_no', 'sales_detail_id', 'trans_date', 'product_id',
    'product_code', 'product_name', 'product_brand', 'member_id', 'member_code', 'member_name', 'police_no', 'unit_brand_name',
    'unit_type_name', 'unit_model_name', 'unit_category_name', 'unit_km', 'by_km', 'by_period', 'list_payments', 'total_trade_in',
    'status', 'created_by', 'created_at', 'updated_by', 'updated_at', 'address', 'phone_number', 'email', 'town_name', 'price',
    'netto', 'warranty_rules'
  ],
  bf: [
    'warranty_id', 'warranty_no', 'store_code', 'store_name', 'sales_no', 'trans_date', 'product_code', 'product_name', 'product_brand',
    'member_code', 'member_name', 'police_no', 'unit_brand_name', 'unit_type_name', 'unit_model_name', 'unit_category_name', 'unit_km',
    'by_km', 'by_period', 'list_payments', 'status', 'total_trade_in', 'created_by', 'created_at', 'updated_by', 'updated_at',
    'address', 'phone_number', 'email', 'town_name', 'warranty_rules', 'price', 'netto'
  ],
  mnf: [
    'warranty_id', 'warranty_no', 'store_name', 'sales_no', 'trans_date', 'product_name', 'product_brand', 'member_name', 'police_no',
    'unit_brand_name', 'unit_type_name', 'unit_model_name', 'unit_category_name', 'unit_km', 'by_km', 'by_period', 'list_payments',
    'total_trade_in', 'status', 'address', 'phone_number', 'email', 'town_name', 'warranty_rules', 'price', 'netto'
  ]
}


export function srvGetWarrantyProducts (query, listStore = []) {
  let { mode, ...other } = query
  const tmpAttr = attrWarrantyProducts[mode] || attrWarrantyProducts.mnf

  if (Array.isArray(query.trans_date)) {
		other['trans_date@D'] = query.trans_date
		delete other.trans_date
	}

  const defaultQuery = setDefaultQuery(attrWarrantyProducts.bf, other, false)

  defaultQuery.where = { ...defaultQuery.where, store_code: { [Op.in]: listStore } }
  return vwWarrantyProduct.findAndCountAll({
    attributes: tmpAttr,
    raw: true,
    ...defaultQuery
  })
}

export async function srvCreateWarrantyProducts (data = {}, products = [], rulesWarranty = {}, transaction) {
  try {
    if(!Array.isArray(products)) throw new Error('Detail products warranty must be an arrays.')


    let details = []
    for (let x in products) {
      const items = products[x]
      const currWarranty = (rulesWarranty[items.productId.toString()] || {})

      if(items.typeCode !== 'P') continue
      else if(!currWarranty.use_warranty && (!currWarranty.valid_warranty_km && !currWarranty.valid_warranty_period)) continue

      for(let a = 0; a < items.qty; a += 1) { 
        details.push({
          store_id: data.storeId,
          sales_no: data.transNo,
          sales_detail_id: items.id,
          trans_date: data.transDate,
          member_id: data.memberCode,
          product_id: items.productId,
          police_no: data.policeNo,
          unit_km: data.vehicle_km,
          by_km: currWarranty.valid_warranty_km,
          by_period: currWarranty.valid_warranty_period,
          list_payments: data.payments,
          created_by: data.createdBy,
          created_at: data.createdAt
        })
      }
    }

    if(details.length === 0) throw new Error('No product is defined as a warranty products.')

    const createdWarranty = await tbWarrantyProduct.bulkCreate(details, { transaction, individualHooks: true })
    const newCreated = JSON.parse(JSON.stringify(createdWarranty)).map(x => ({ warranty_id: x.warranty_id, warranty_no: x.warranty_no }))

    return { success: true, message: 'Warranty has been created.', data: newCreated }
  } catch (er) {
    return { success: false, message: er.message }
  }
}

