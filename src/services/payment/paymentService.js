import db from '../../models'
import dbv from '../../models/view'
import stringSQL from '../../native/sqlPayment'
import sequelize from '../../native/sequelize'
import { ApiError } from '../../services/v1/errorHandlingService'
import { srvGetPaymentOptionByCode } from '../../services/v2/master/finance/srvPaymentOption'
import { srvGetEDCMachineByCode } from '../../services/v2/master/finance/srvEDCMachine'

const tbl_payment = db.tbl_payment
const tbl_payment_history = db.tbl_payment_history
const vw_payment_001 = dbv.vw_payment_001
const vw_payment_003 = dbv.vw_payment_003
const vw_payment_005 = dbv.vw_payment_005

const groupings003 = ['transno', 'storeid', 'transdate', 'transtime', 'cashiertransid', 'typecode', 'paid', 'nettototal', 'description',
'cardname', 'cardno', 'printdate', 'active', 'createdby', 'createdat', 'updatedby', 'updatedat']

export function getTransByIdActive (id) {
    return tbl_payment.findAll({
        where: {
            id: id,
            active: 1,
        },
        raw: false
    })
}

export function getTransById (id) {
    return getTransByIdActive(id).then(result => {
        if (result.length > 0) {
            return tbl_payment.findOne({
                where: {
                    id: id
                },
                raw: false
            })
        } else {
            return false
        }
    })
}

export function getTransBySplit (transNo, storeId) {
    return vw_payment_001.findAll({
        where: {
            transNo: transNo,
            storeId: storeId,
            active: 1,
        },
        raw: false
    })
}

export function getTransByNo (query) {
    if (query.from && query.to) {
        const { from, to, order, sort, ...other } = query
        let ordering = []
        if (order) order[0].split(';').map(e => ordering.push(e.split(',')))
        return vw_payment_003.findAll({
            where: {
                transDate: {
                    $between: [from, to]
                },
                ...other,
                active: 1
            },
            group: groupings003,
            order: order ? ordering : [],
            raw: false
        })
    }
    if (query.transNo && query.storeId) {
        return vw_payment_003.findAll({
            where: {
                transNo: query.transNo,
                storeId: query.storeId,
                active: 1
            },
            group: groupings003,
            raw: false
        })
    }
    return vw_payment_003.findAll({
        raw: false,
        where: { active: 1 },
        group: groupings003
    })
}

export function getTransByNo5 (query) {
    if (query.from && query.to) {
        const { from, to, order, sort, ...other } = query
        let ordering = []
        if (order) order[0].split(';').map(e => ordering.push(e.split(',')))
        return vw_payment_005.findAll({
            where: {
                invoiceDate: {
                    $and: {
                        $gte: from,
                        $lte: to
                    }
                },
                ...other
            },
            order: order ? ordering : [],
            raw: false
        })
    }
    if (query.transNo && query.storeId) {
        return vw_payment_005.findAll({
            where: {
                transNo: query.transNo,
                storeId: query.storeId,
            },
            raw: false
        })
    }
    return vw_payment_005.findAll({
        raw: false
    })
}

export function getPosTransByNo (query) {
    let sSQL = stringSQL.s00001

    if (query.from && query.to) {
        sSQL = sSQL.replace("_BIND01", `WHERE transDate BETWEEN '${query.from}' AND '${query.to}'`)
    } else {
        sSQL = sSQL.replace("_BIND01", "")
    }
    if (query.transNo && query.storeId && query.from && query.to) {
        sSQL = sSQL.replace("_WHERECONDITION",
            query.transNo ? `AND transNo='${query.transNo}' AND storeId='${query.storeId}'` : "")
    } else if (query.transNo && query.storeId && !(query.from && query.to)) {
        sSQL = sSQL.replace("_WHERECONDITION", query.transNo ? `WHERE transNo='${query.transNo}' AND storeId='${query.storeId}'` : "")
    } else if (!query.transNo && query.storeId && !(query.from && query.to)) {
        sSQL = sSQL.replace("_WHERECONDITION",
            query.storeId ? " storeId='" + query.storeId + "'" : "")
    } else if (!query.transNo && query.storeId && query.from && query.to) {
        sSQL = sSQL.replace("_WHERECONDITION",
            query.storeId ? " AND storeId='" + query.storeId + "'" : "")
    } else {
        sSQL = sSQL.replace("_WHERECONDITION", "")
    }
    console.log('ssql', sSQL)
    return new Promise(function (resolve, reject) {
        sequelize.query(sSQL, {
            type: sequelize.QueryTypes.SELECT
        })
            .then(users => {
                resolve(users)
            })
    })
}

export function PosTransExists (query) {
    return getPosTransByNo(query).then(data => {
        if (data.length === 0) {
            return false;
        } else {
            return true;
        }
    })
}

export function ReceivableQuery (transNo, storeId) {
    const query = {
        transNo,
        storeId
    }
    return getTransByNo(query).then(result => {
        if (result.length > 0 && result[0].paid >= result[0].nettoTotal) {
            return false
        } else {
            return true
        }
    })
}

export function checkPayment (transNo, storeId, data) {
    const query = {
        transNo, storeId
    }
    return getTransByNo(query).then(result => {
        if (result.length > 0 && (result[0].paid + data.amount) > result[0].nettoTotal) {
            return false
        } else {
            return true
        }
    })
}

export function createPayment (storeId, data, createdBy, next) {
    return tbl_payment.create({
        cashierTransId: data.cashierTransId,
        reference: data.reference,
        storeId: storeId,
        storeIdPayment: data.storeIdPayment,
        typeCode: data.typeCode,
        amount: data.amount,
        description: data.description,
        cardInfo: data.cardInfo,
        cardNo: data.cardNo,
        cardDescription: data.cardDescription,
        printDate: data.printDate,
        createdBy: createdBy,
        updatedBy: null
    }).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const {
            parent,
            original,
            sql,
            ...other
        } = errObj
        next(new ApiError(400, other, err))
    })
}

export async function createBulkPayment (storeId, id, storeIdPayment, data, createdBy, next, transaction) {
  var arrayProd = []
	let listTypePayments = []

  for (let key in data) {
    let fetchOptions = {}
    const edc = (data[key].edc) ? await srvGetEDCMachineByCode(data[key].edc,'getid') : 1

    if(data[key].paymentOption) {
        fetchOptions = JSON.parse(JSON.stringify(await srvGetPaymentOptionByCode(data[key].paymentOption, 'getid') || '{}'))
    }
		listTypePayments.push((fetchOptions.paymentTypeName || 'Cash'))
		const paymentOption = (fetchOptions.id || 1)
    
    arrayProd.push({
      reference: id,
      storeId: storeId,
      storeIdPayment: storeIdPayment,
      cashierTransId: data[key].cashierTransId,
      // typeCode: data[key].typeCode,
      paymentOptionId: paymentOption,
      edcId: edc.id,
      amount: data[key].amount,
      description: data[key].description,
      cardInfo: data[key].cardInfo,
      cardNo: data[key].cardNo,
      cardDescription: data[key].cardDescription,
      printDate: data[key].printDate,
      createdBy: createdBy,
      updatedBy: null,
      indentno: data[key].indentno
    })
  }
  
  return tbl_payment.bulkCreate(
    arrayProd,
    { transaction }
  ).then(ok => {
		return { data: { listTypePayments } }
	}).catch(err => {
    // console.log(err)
    // const errObj = JSON.parse(JSON.stringify(err))
    // const { parent, original, sql, ...other } = errObj
    throw new Error(err.message)
  })
}

export async function createBulkPaymentV2 (arrayProd = [], transaction) {
    return tbl_payment.bulkCreate(
      arrayProd,
      { transaction }
    ).then(ok => {
          return { success: true, total: arrayProd.length }
      }).catch(err => {
        console.log(err)
      // console.log(err)
      // const errObj = JSON.parse(JSON.stringify(err))
      // const { parent, original, sql, ...other } = errObj
      throw new Error(err.message)
    })
  }

export function insertHistory (id, data, createdBy, next) {
    return tbl_payment_history.create({
        createdBy: createdBy,
        reference: id,
        ...data
    }).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const {
            parent,
            original,
            sql,
            ...other
        } = errObj
        next(new ApiError(400, other, err))
    })
}

export function cancelPayment (id, memo, updatedBy, next) {
    return tbl_payment.update({
        active: 0,
        memo: memo,
        updatedBy: updatedBy
    }, {
            where: {
                id: id
            }
        }).catch(err => {
            const errObj = JSON.parse(JSON.stringify(err))
            const {
                parent,
                original,
                sql,
                ...other
            } = errObj
            next(new ApiError(501, other, err))
        })
}
