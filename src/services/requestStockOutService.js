// [NEW]: FERDINAN - 2025-03-06
import { Op } from "sequelize";
import moment from "moment";

import db from "../models";
import dbv from "../models/view"
import dbvr from "../models/viewR"
import { srvInsertApprovalCancelStockOut } from "./v2/monitoring/srvApproval";
import sequelize from '../native/sequelize'


const tblRequestStockOut = db.tbl_request_stock_out;
const tblRequestStockOutDetail = db.tbl_request_stock_out_detail;

const vwRequestStockOut = dbv.vw_request_stock_out;
const vwRequestStockOutDetail = dbv.vw_request_stock_out_detail;

const vwQueueSales = dbvr.vw_queue_pos

const generateNumber = async () => {
    // Dapatkan bulan dan tahun saat ini
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan dalam 2 digit
    const year = String(now.getFullYear()).slice(-2); // 2 digit terakhir tahun

    // Template awal nomor
    const prefix = `RQO${month}${year}`;

    const lastRecord = await tblRequestStockOut.findOne({
        where: {
            transactionnumber: {
                [Op.like]: `%${prefix}%`, // Cari yang diawali dengan prefix
            },
        },
        order: [["transactionnumber", "DESC"]], // Urutkan dari terbesar
    });

    // Tentukan nomor urut berikutnya
    let nextSequence = "0001"; // Default jika belum ada data
    if (lastRecord) {
        const lastNumber = lastRecord.transactionnumber.slice(-4); // Ambil 4 digit terakhir
        nextSequence = String(parseInt(lastNumber, 10) + 1).padStart(4, "0");
    }

    return `${prefix}${nextSequence}`;
}

export const addNewRequestStockOut = async (data, user) => {
    try {
        const transactionnumber = await generateNumber()
        await tblRequestStockOut.create({
            ...data,
            transactionnumber,
            createdBy: user,
            createdAt: moment()
        })

        const products = data.products.map((product) => ({
            ...product,
            transactionnumber,
            createdBy: user,
            createdAt: moment()
        }))

        await tblRequestStockOutDetail.bulkCreate(products)
        return { success: true, message: 'Request Stock Out created successfully' }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
};

export const changeRequestStockOut = async (transactionnumber, user, data) => {
    try {
        await tblRequestStockOut.update({ status: 'Y', updatedBy: user, updatedAt: moment(), exitdate: moment() }, { where: { transactionnumber } })
        for (const item of data.products) {
            await tblRequestStockOutDetail.update(
                { qtyreceived: item.qtyreceived }, 
                { where: { transactionnumber, productcode: item.productcode } }
            )
        }

        return { success: true, message: 'Request Stock Out updated successfully' }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
};

export const removeRequestStockOut = async (transactionnumber) => {
    try {
        await tblRequestStockOutDetail.destroy({ where: { transactionnumber } }) // [NEW]: FERDINAN - 2025-03-07
        const data = await tblRequestStockOut.findOne({ where: { transactionnumber } })
        if (data.status === 'Y') {
            return { success: false, message: 'Cannot delete request stock out that has been used' }
        }

        await tblRequestStockOut.destroy({ where: { transactionnumber } })
        return { success: true, message: 'Request Stock Out deleted successfully' }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
};

export const fetchRequestStockOut = async (storeid, search, pagination) => {
    try {
        const { pageSize, page } = pagination
        const data = await vwRequestStockOut.findAndCountAll({
            attributes: ['transactionnumber', 'queuenumber', 'storename', 'created_by_fullname', 'createdat', 'statuscancel', 'memocancel', 'policeno'],
            where: { 
                [Op.or]: [
                    { status: 'N' },
                    { statuscancel: 'APPROVE' }
                ],
                storeid,
                [Op.and]: [
                    { 
                        [Op.or]: [
                            { transactionnumber: { [Op.iLike]: `%${search || ''}%` } },
                            { queuenumber: { [Op.iLike]: `%${search || ''}%` } }
                        ]
                    }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: parseInt(pageSize || 10, 10),
            offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
        })
        return { 
            success: true, 
            message: 'Request Stock Out fetched successfully', 
            pageSize: pageSize || 10,
            page: page || 1,
            total: data.count,
            data: JSON.parse(JSON.stringify(data.rows))
        }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
};

export const fetchRequestStockOutByTransNo = async (transactionnumber) => {
    try {
        const data = await vwRequestStockOutDetail.findAll({ where: { transactionnumber } })
        return { success: true, message: 'Request Stock Out fetched successfully', data }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
}

export const fetchTransactionRequestStockOut = async (transactionnumber) => {
    try {
        // const requestStockOut = await vwRequestStockOutReport.findOne({ where: { transactionnumber }, raw: true })
        const requestStockOut = await vwRequestStockOut.findOne({ where: { transactionnumber }, raw: true })
        const queue = await vwQueueSales.findOne({ 
            attributes: ['queuenumber', 'wono', 'woid', 'wonumber', 'memberCode', 'memberName', 'employeeId', 'employeeCode', 'employeeName', 'policeNo'],
            where: { queuenumber: requestStockOut.queuenumber, storeid: requestStockOut.storeid }, 
            raw: true 
        })
        const products = await vwRequestStockOutDetail.findAll({ where: { transactionnumber }, raw: true })

        const data = {
            ...requestStockOut,
            ...queue,
            products,
        }
        return { success: true, message: 'Request Stock Out fetched successfully', data }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
}

export const changeStatusCancel = async (transactionnumber, body, user) => {
    const { status } = body
    let transaction
    try {
        transaction = await sequelize.transaction()
        let payload = {}
        switch (status) {
            case 'REQUEST':
                payload.statuscancel = status
                payload.memocancel = body.memo
                break;
            case 'APPROVE':
                payload.statuscancel = status
                payload.cancelat = moment()
                payload.cancelby = user
                break;
            case 'REJECT':
                payload.statuscancel = status
                payload.cancelat = null
                payload.cancelby = null
                payload.memocancel = null
                break;
            case 'APPROVE-GUDANG':
                payload.statuscancel = status
                break;
        }

        if (status === 'REQUEST') {
            const approval = await srvInsertApprovalCancelStockOut({ transactionnumber, memo: body.memo }, user, moment(), transaction)

            const appvid = approval.success ? approval.appvid : null
            await tblRequestStockOut.update({ ...payload, appvid }, { where: { transactionnumber } })
        } else {
            await tblRequestStockOut.update({ ...payload }, { where: { transactionnumber } })
        }


        return { success: true, message: 'Request Stock Out updated successfully' }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
}

// [DELETE RSO WHEN QUEUE IS DELETED]: FERDINAN - 2025-06-03
export const removeRequestStockOutByQueue = async (queuenumber) => {
    try {
        await tblRequestStockOut.destroy({ where: { queuenumber, status: 'N' } })
        return { success: true, message: 'Request Stock Out deleted successfully' }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
}

// [ACCEPT REQUEST STOCK OUT REPORT]: FERDINAN - 2025/06/30
export const fetchFinishRequestStockOut = async (storeid, query) => {
    const { search, dateFrom, dateTo, productcode } = query

    try {
        const data = await vwRequestStockOutDetail.findAll({
            where: {
                [Op.or]: [
                    { status: 'Y' },
                    { statuscancel: 'APPROVE' }
                ],
                storeid,
                [Op.and]: [
                    { 
                        [Op.or]: [
                            { transactionnumber: { [Op.iLike]: `%${search || ''}%` } },
                            { queuenumber: { [Op.iLike]: `%${search || ''}%` } },
                            { policeno: { [Op.iLike]: `%${search || ''}%` } },
                            { productname: { [Op.iLike]: `%${search || ''}%` } },
                            { productcode: { [Op.iLike]: `%${search || ''}%` } },
                            { requestby: { [Op.iLike]: `%${search || ''}%` } },
                            { updaterequestby: { [Op.iLike]: `%${search || ''}%` } },
                        ]
                    }
                ],
                exitdate: { [Op.between]: [dateFrom, dateTo] },
                ...(productcode ? { productcode } : {})
            },
            order: [['transactionnumber', 'DESC']]
        })
        return { 
            success: true, 
            message: 'Request Stock Out fetched successfully',
            data
        }
    } catch (error) {
        return { success: false, message: error.message, data: {} }
    }
};