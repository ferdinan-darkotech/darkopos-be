/**
 * Created by Veirry on 29/09/2017.
 */
import dbv from '../../models/view'

const vw_report_in_trans = dbv.vw_report_adjust_in
const vw_report_out_trans = dbv.vw_report_adjust_out
const vw_report_rbb_product = dbv.vw_report_rbb_product

const reportAdjIn = ['productCode', 'productName', 'transDate', 'qtyIn', 'costPrice', 'amount', 'reference', 'referencedate']
const reportAdjOut = ['productCode', 'productName', 'transDate', 'qtyOut', 'costPrice', 'amount', 'reference', 'referencedate', 'transType']
// Retur Beli
const reportReturnOut = ['transNo', 'transDate', 'productCode', 'productName', 'transDate', 'qty', 'amount', 'reference', 'memo']

export function getReportAdjInTrans (query) {
    if (query.from) {
        return vw_report_in_trans.findAll({
            attributes: reportAdjIn,
            where: {
                transDate: {
                    $between: [query.from, query.to]
                },
                storeId: query.storeId
            },
            order: [
                ['productName']
            ],
        })
    } else {
        return vw_report_in_trans.findAll({
            attributes: reportAdjIn,
            where: {
                storeId: query.storeId
            },
            order: [
                ['productName']
            ],
        })
    }
}

export function getReportAdjOutTrans (query) {
    if (query.from) {
        return vw_report_out_trans.findAll({
            attributes: reportAdjOut,
            where: {
                transDate: {
                    $between: [query.from, query.to]
                },
                storeId: query.storeId
            },
        })
    } else {
        return vw_report_out_trans.findAll({
            attributes: reportAdjOut,
            where: {
                storeId: query.storeId
            }
        })
    }
}

export function getReportReturnOutTrans (query) {
    if (query.from) {
        return vw_report_rbb_product.findAll({
            attributes: reportReturnOut,
            where: {
                transDate: {
                    $between: [query.from, query.to]
                },
                storeId: query.storeId
            },
        })
    } else {
        return []
    }
}