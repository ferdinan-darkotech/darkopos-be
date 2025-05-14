/**
 * Created by Veirry on 17/09/2017.
 */
import { Op } from 'sequelize'
import dbv from '../../models/view'
import dbv2 from '../../models/viewR'
import sequelize from '../../native/sequelize'
import { ApiError } from '../../services/v1/errorHandlingService'

const vwd_pos_sales = dbv2.vwd_pos_sales
const vw_report_service_trans = dbv.vw_report_service_trans
const vw_report_service_mechanic = dbv.vw_report_service_mechanic
const serviceByItem = dbv2.vw_report_service_by_item


const fieldsServiceByItem = ['transDate','technicianCode','technicianName','employeeDetailCode','employeeDetailName','transNo',
'typeCode','productName','productCode','qty','totalDiscount','sellingPrice','sellPrice', 'memberCode', 'memberName', 'policeNo',
'discountLoyalty', 'discount', 'disc1', 'disc2', 'disc3', 'DPP', 'PPN']

const Fields = [
    'id',
    'storeId',
    'transNoId',
    'transNo',
    'technicianId',
    'typeCode',
    'technicianCode',
    'technicianName',
    // ['employeeid', 'employeeDetailId'],
    ['employeecode', 'employeeDetailCode'],
    ['employeename', 'employeeDetailName'],
    'transDate',
    'transTime',
    'cashierTransId',
    'productId',
    'productCode',
    'productName',
    'totalDiscount',
    'qty',
    'sellPrice',
    'sellingPrice',
    'total',
    'grandTotal',
    'discountLoyalty',
    'discount',
    'disc1',
    'disc2',
    'disc3',
    'DPP',
    'PPN',
    'rounding',
    'discInvoicePercent',
    'discInvoiceNominal',
    'status',
    'typeCode',
    'memberCode',
    'policeNo',
    'policeNoId',
    'lastMeter',
    'createdAt',
    'updatedAt'
]
const reportTrans = ['cashierTransId', 'transNo', 'transDate', 'total', 'discount', 'DPP', 'PPN', 'netto', 'status']
const reportTransMechanic = [
    'storeId',
    'storeCode',
    'storeName',
    'transDate',
    'transNo',
    'status',
    'hasEmployee',
    'technicianId',
    'employeeName',
    'productId',
    'serviceCode',
    'serviceName',
    'serviceType',
    'qty',
    'sellingPrice',
    'discount',
    'amount'
]

export function countDataServiceDetail (query) {
    const { type, field, order, ...other } = query
    for (let key in other) {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'transDate') {
            query[key] = { [Op.between]: query[key] }
            other[key] = query[key]
        } else if (type !== 'all' && query['q']) {
            query[key] = { [Op.iRegexp]: query[key] }
        }
    }
    let querying = []
    if (query['q']) {
        for (let key in Fields) {
            const id = Object.assign(Fields)[key]
            if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
                let obj = {}
                obj[id] = query['q']
                querying.push(obj)
            }
        }
    }
    if (querying.length > 0) {
        return vwd_pos_sales.count({
            where: {
                [Op.or]: querying
            },
        })
    } else {
        return vwd_pos_sales.count({
            where: {
                ...other
            }
        })
    }
}

export function getDataServiceDetail (query, pagination) {
    const { type, field, order, ...other } = query
    const { pageSize, page } = pagination
    let querying = []
    if (query['q']) {
        for (let key in Fields) {
            const id = Object.assign(Fields)[key]
            if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt')) {
                let obj = {}
                obj[id] = query['q']
                querying.push(obj)
            }
        }
    }
    if (querying.length > 0) {
        return vwd_pos_sales.findAll({
            attributes: Fields,
            where: {
                [Op.or]: querying
            },
            order: order ? sequelize.literal(order) : null,
            limit: parseInt(pageSize || 10, 10),
            offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
        })
    } else {
        return vwd_pos_sales.findAll({
            attributes: query.field ? query.field.split(',') : Fields,
            where: {
                ...other
            },
            order: order ? sequelize.literal(order) : null,
            limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
            offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
        })
    }
}

export function getReportServiceTrans (query) {
    const { from, to, ...other } = query
    console.log('\n\n\n>>>>>>aaaaaa\n\n', )
    if (query.from) {
        return vw_report_service_trans.findAll({
            attributes: reportTrans,
            where: {
                transDate: {
                    [Op.gte]: query.from,
                    [Op.lte]: query.to
                },
                ...other
            },
            order: [
                ['transNo']
            ],
        })
    }
}

export function getReportServiceMechanic (query) {
    const { from, to, storeId, ...other } = query
    if (query.from) {
        return vw_report_service_mechanic.findAll({
            attributes: reportTransMechanic,
            where: {
                transDate: {
                    [Op.between]: [from, to]
                },
                storeId: storeId,
                status: 'A',
                ...other
            }
        })
    }
}


export function getReportServiceByItem (query) {
    const { transDate, storeId, ...other } = query
    const [startdate, enddate] = transDate
    return serviceByItem.findAndCountAll({
        attributes: fieldsServiceByItem,
        where: {
            storeid: storeId,
            [Op.and]: [ { transDate: { [Op.gte]: startdate } }, { transDate: { [Op.lte]: enddate } } ]
        }
    })
}