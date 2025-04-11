import db from '../../models'
import sequelize from '../../native/sequelize'
import stringSQL from '../../native/transfer/sqlTransfer'
import {
  ApiError
} from '../../services/v1/errorHandlingService'
import {
  isEmpty
} from '../../utils/check'

const tbl_transfer_out_detail_hpokok = db.tbl_transfer_out_detail_hpokok
const tbl_transfer_in_detail_hpokok = db.tbl_transfer_in_detail_hpokok

export function createTransferInHp (reference, next) {
  let sSQL = stringSQL.s00001
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, {
      replacements: {
        varReference: reference
      },
      type: sequelize.QueryTypes.CALL
    })
      .then((data) => {
        resolve(data)
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

export function createTransferOutHp (reference, next) {
  let sSQL = stringSQL.s00002
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, {
      replacements: {
        varStoreId: reference
      },
      type: sequelize.QueryTypes.CALL
    })
      .then((data) => {
        resolve(data)
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

export function createTransferOutHpokok (reference, next) {
  let sSQL = stringSQL.s00003
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, {
      replacements: {
        varReference: reference
      },
      type: sequelize.QueryTypes.CALL
    })
      .then((data) => {
        resolve(data)
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

export function dropOutDetail (id, next) {
  console.log('dropOutDetail', id)
  return tbl_transfer_out_detail_hpokok.destroy({
    where: {
      id: id
    }
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function dropOutDetailByProduct (query, transaction) {
  return tbl_transfer_out_detail_hpokok.destroy({
    where: {
      productId: query.productId,
      transNo: query.transNo,
      storeId: query.storeId
    },
    transaction
  })
}

export function dropInDetail (id, next) {
  console.log('dropInDetail', id)
  return tbl_transfer_in_detail_hpokok.destroy({
    where: {
      id: id
    }
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}