import { Op } from 'sequelize'
import db from '../models'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'

const PosDetail = db.tbl_pos_detail
const PosDetailInfo = dbv.vw_pos_detail
const PosReportDetail = dbv.vw_report_pos

const posField = ['id', 'typeCode', 'transNo', 'bundlingId', 'bundlingCode', 'bundlingName', 'productId', 'serviceCode', 'serviceName', 'productCode', 'productName', 'qty',
    'sellPrice', 'sellingPrice', 'DPP', 'PPN', 'discountLoyalty', 'discount', 'disc1', 'disc2', 'disc3'
]

const posReportField = ['transNo', 'productId', 'productCode', 'productName', ['sum(Qty)', 'Qty'],
    ['sum(Total)', 'Total'], 'discount', 'disc1Total', 'disc2Total', 'disc3Total', ['sum(discountTotal)', 'discountTotal'],
    ['sum(Total - discountTotal)', 'Netto'], ['transDate', 'transDate']
]
//getPosDetailByCode,
export function getPosDetailByCode (transNo, storeId) {
    return PosDetailInfo.findAll({
        attributes: posField,
        where: {
            transNo: transNo,
            storeId: storeId
        },
        raw: false
    })
}

export function getPosDetailTableByCode (transNo) {
    return PosDetail.findAll({
        where: {
            transNo: transNo
        },
        raw: false
    })
}

export function getPosDetailData (query) {
    for (let key in query) {
        if (key === 'createdAt') {
            query[key] = { between: query[key] }
        }
    }
    if (query) {
        if (query.hasOwnProperty('id')) {
            let str = JSON.stringify(query)
            str = str.replace(/id/g, 'transNo')
            query = JSON.parse(str)
        }
        return PosDetailInfo.findAll({
            attributes: posField,
            where: query
        })
    } else {
        return PosDetailInfo.findAll({
            attributes: posField
        })
    }
}

export function getPosReportData (query) {
    if (query.from) {
        return PosReportDetail.findAll({
            attributes: posReportField,
            where: {
                transDate: {
                    [Op.between]: [query.from, query.to]
                },
                storeId: query.storeId,
                cashierTransId: query.cashierTransId ? query.cashierTransId : null
            },
            group: [
                ['productCode']
            ],
            order: [
                ['productId']
            ]
        })
    } else {
        return PosReportDetail.findAll({
            attributes: posReportField,
            where: {
                storeId: query.storeId,
            },
            group: [
                ['productCode']
            ]
            ,
            order: [
                ['productId']
            ]
        })
    }
}

export function setPosDetailInfo (request) {
    var arrayProd = []
    for (var key = 0; key < request.length; key++) {
        arrayProd.push({
            transNo: request[key].transNo,
            productId: request[key].productId,
            productCode: request[key].productCode,
            qty: request[key].qty,
            sellingPrice: request[key].sellingPrice,
            DPP: request[key].DPP,
            PPN: request[key].PPN,
            discount: request[key].discount,
            disc1: request[key].disc1,
            disc2: request[key].disc2,
            disc3: request[key].disc3,
            createdBy: request[key].createdBy
        })
    }
    return arrayProd
}

export function posDetailExists (transNo) {
    return getPosByCode(transNo).then(posDetail => {
        if (posDetail == null) {
            return false;
        }
        else {
            return true;
        }
    })
}

export function updatePosDetail (id, posDetail, updatedBy, next) {
    return PosDetail.update({
        productId: posDetail.productId,
        productCode: posDetail.productCode,
        qty: posDetail.qty,
        sellPrice: posDetail.sellPrice,
        typeCode: posDetail.typeCode,
        sellingPrice: posDetail.sellingPrice,
        DPP: posDetail.DPP,
        PPN: posDetail.PPN,
        discount: posDetail.discount,
        disc1: posDetail.disc1,
        disc2: posDetail.disc2,
        disc3: posDetail.disc3,
        updatedBy: updatedBy
    },
        {
            where: {
                id: id
            }
        }
    )
}

export function deletePosDetail (id, posDetail, updatedBy, next) {
    return PosDetail.destroy({
        where: {
            id: id
        }
    })
}

export function createPosDetail (transNo, posDetail, createdBy, next) {
    var arrayProd = []
    for (var n = 0; n < posDetail.length; n++) {
        arrayProd.push({
            storeId: posDetail[n].storeId,
            transNo: transNo,
            productId: posDetail[n].productId,
            productCode: posDetail[n].productCode,
            qty: posDetail[n].qty,
            sellPrice: posDetail[n].sellPrice,
            typeCode: posDetail[n].typeCode,
            sellingPrice: posDetail[n].sellingPrice,
            DPP: posDetail[n].DPP,
            PPN: posDetail[n].PPN,
            discount: posDetail[n].discount,
            disc1: posDetail[n].disc1,
            disc2: posDetail[n].disc2,
            disc3: posDetail[n].disc3,
            createdBy: createdBy,
            updatedBy: '---'
        })
    }
    return PosDetail.bulkCreate(
        arrayProd
    ).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const { parent, original, sql, ...other } = errObj
        next(new ApiError(400, other, err))
    })
}
