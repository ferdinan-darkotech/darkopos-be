import { Op } from 'sequelize'
import dbv from '../models/view'
import sequelize from '../native/sequelize'

const vwTransferOut = dbv.vw_transfer_out_detail

const Fields = [
    'id',
    'transNoId',
    'storeId',
    'storeName',
    'storeIdReceiver',
    'storeNameReceiver',
    'transNo',
    'transDate',
    'reference',
    'referenceDate',
    'transType',
    'productId',
    'productCode',
    'productName',
    'qty',
    'purchasePrice',
    'nettoTotal',
    'status',
    'active',
    'description',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt'
]

export function countData (query) {
    const { type, field, order, q, ...other } = query
    for (let key in query) {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'transDate') {
            query[key] = { between: query[key] }
        } else if (type !== 'all' && query['q'] && key !== 'order' && key !== 'storeId' && key !== 'active') {
            query[key] = { [Op.iRegexp]: query[key] }
        }
    }
    let querying = []
    if (query['q']) {
        for (let key in Fields) {
            const id = Object.assign(Fields)[key]
            if (id === 'productId' || id === 'productName' || id === 'transNo' || id === 'productCode') {
                let obj = {}
                obj[id] = query['q']
                querying.push(obj)
            }
        }
    }
    if (querying.length > 0) {
        return vwTransferOut.count({
            where: {
                [Op.or]: querying,
                [Op.and]: other
            },
        })
    } else {
        return vwTransferOut.count({
            where: {
                ...other
            }
        })
    }
}

export function getData (query, pagination) {
    const { type, field, order, q, ...other } = query
    for (let key in query) {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'transDate') {
            query[key] = query[key]
        }
    }
    const { pageSize, page } = pagination
    let querying = []
    if (query['q']) {
        for (let key in Fields) {
            const id = Object.assign(Fields)[key]
            if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || key === 'transDate')) {
                let obj = {}
                obj[id] = query['q']
                querying.push(obj)
            }
        }
    }
    if (querying.length > 0) {
        return vwTransferOut.findAndCountAll({
            attributes: Fields,
            where: {
                [Op.or]: querying,
                [Op.and]: other
            },
            order: order ? sequelize.literal(order) : null,
            limit: parseInt(pageSize || 10, 10),
            offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
        })
    } else {
        return vwTransferOut.findAndCountAll({
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
