import db from '../../models'
import {
  ApiError
} from '../../services/v1/errorHandlingService'

const tbl_payment_option = db.tbl_payment_option

export function getPaymentByCode (typeCode) {
  return tbl_payment_option.findOne({
    where: { typeCode: typeCode },
    raw: false
  })
}

export function getPaymentOption (query) {
  const { page, pageSize, field, type, ...other } = query
  return tbl_payment_option.findAll({
    where: {
      status: 1,
      ...other
    },
    raw: false
  })
}

export function paymentExists (typeCode) {
  return getPaymentByCode(typeCode).then(data => {
    if (data == null) {
      return false
    }
    else {
      return true
    }
  })
}

export function createPaymentOption (data, createdBy, next) {
  return tbl_payment_option.create({
    typeCode: data.typeCode,
    typeName: data.typeName,
    description: data.description,
    status: 1,
    charge: data.charge,
    cashBackNominal: data.cashBackNominal,
    cashBackPercent: data.cashBackPercent,
    discNominal: data.discNominal,
    discPercent: data.discPercent,
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

export function updatePaymentOption (id, data, updatedBy, next) {
  return tbl_payment_option.update({
    typeCode: data.typeCode,
    typeName: data.typeName,
    description: data.description,
    status: data.status,
    charge: data.charge,
    cashBackNominal: data.cashBackNominal,
    cashBackPercent: data.cashBackPercent,
    discNominal: data.discNominal,
    discPercent: data.discPercent,
    updatedBy: updatedBy
  }, {
      where: { id: id }
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

export function deletePaymentOption (id) {
  return tbl_payment_option.destroy({
    where: {
      typeCode: id
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}
