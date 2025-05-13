import { ApiError } from '../../services/v1/errorHandlingService'
import dbv from '../../models/view'
import sequelize from '../../native/sequelize'
import { Op } from 'sequelize'

const vw_pos_report_trans = dbv.vw_pos_report_trans
const vw_report_purchase_trans = dbv.vw_report_purchase_trans
const reportTrans = ['name', 'title', 'Sales', 'Service']
const reportTransPurchase = [
  [sequelize.literal(`to_char(transdate::timestamp with time zone, 'dd/mm'::text)`),'name'],
  [sequelize.literal(`to_char(transdate::timestamp with time zone, 'dd/mm/yyyy'::text)`),'title'],
  [sequelize.literal('sum(netto)'), 'Purchase']
]

export function getReportPosTrans (query) {
  if (query.from && query.to && query.storeId) {
    const { from, to, storeId, sort_by, ...other } = query
    return vw_pos_report_trans.findAll({
      attributes: reportTrans,
      raw: true,
      where: {
        transDate: {
          [Op.and]: {
            [Op.gte]: query.from,
            [Op.lte]: query.to
          }
        },
        storeId: query.storeId,
        ...other
      },
      order: query.sort_by
    })
  }
}

export function getReportPurchaseTrans (query) {
  if (query.from && query.to && query.storeId) {
    const { from, to, storeId, sort_by, ...other } = query
    return vw_report_purchase_trans.findAll({
      attributes: reportTransPurchase,
      raw: true,
      where: {
        transDate: {
          [Op.and]: {
            [Op.gte]: query.from,
            [Op.lte]: query.to
          }
        },
        storeId: query.storeId,
        ...other
      },
      group: ['transdate', 'storeid'],
      order: query.sort_by
    })
  }
}