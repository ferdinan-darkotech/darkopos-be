import db from '../../models'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import stringSQL from '../../native/sqlSequence'

const tbl_sequence = db.tbl_sequence
const tbl_bank_entry = db.tbl_bank_entry
const tbl_bank_entry_detail = db.tbl_bank_entry_detail
const Fields = [
  'id',
  'storeId',
  'transNo',
  'transDate',
  'reference',
  'supplierId',
  'memberId',
  'type',
  'cashierTransId',
  'description',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

export function srvSetShiftInfo (request) {
  const getShiftInfo = {
    name: request.shiftName,
    start: request.startTime,
    end: request.endTime,
    sequence: request.sequence
  }

  return getShiftInfo
}

export function srvShiftIdExists (id) {
  return srvGetExpenseById(id).then(shift => {
    if (shift == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function srvGetExpenseById (id) {
  return tbl_bank_entry.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function srvGetExpenses (query, pagination) {
  const { type, field, order, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
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
    return tbl_bank_entry.findAll({
      attributes: query.field ? query.field.split(',') : Fields,
      where: {
        $or: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return tbl_bank_entry.findAll({
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

export function srvCreateExpense (data, detail, createdBy, next) {
  return sequelize.transaction(
    function (t) {
      let sSQL = stringSQL.s00001
      return sequelize.query(sSQL, {
        replacements: {
          seqCode: 'BTR',
          seqType: data.storeId
        },
        type: sequelize.QueryTypes.CALL
      }).then((sequence) => {
        return tbl_bank_entry.create({
          storeId: data.storeId,
          transNo: sequence[0].seq,
          transDate: data.transDate,
          reference: data.reference,
          supplierId: data.supplierId,
          memberId: data.memberId,
          transType: data.transType,
          type: data.type,
          cashierTransId: data.cashierTransId,
          description: data.description,
          createdBy: createdBy,
          updatedBy: null
        }, { transaction: t }).then(result => {
          var arrayProd = []
          for (var n = 0; n < detail.length; n += 1) {
            arrayProd.push({
              storeId: data.storeId,
              transNoId: result.dataValues.id,
              accountId: detail[n].accountId,
              amountIn: detail[n].amountIn,
              amountOut: detail[n].amountOut,
              description: detail[n].description,
              createdBy: createdBy,
              updatedBy: null
            })
          }
          return tbl_bank_entry_detail.bulkCreate(
            arrayProd, { transaction: t }
          ).then(result => {
            return tbl_sequence.findOne({
              attributes: ['seqValue'],
              where: {
                seqCode: 'BTR',
                storeId: data.storeId
              }
            }).then(resultSeq => {
              return tbl_sequence.update({
                seqValue: resultSeq.seqValue + 1
              }, {
                  where: {
                    seqCode: 'BTR',
                    storeId: data.storeId
                  }
                }).catch(err => {
                  t.rollback()
                  next(new ApiError(422, err + `Couldn't update sequence.`, err))
                })
            })
          }).catch(err => {
            t.rollback()
            const errObj = JSON.parse(JSON.stringify(err))
            const { parent, original, sql, ...other } = errObj
            next(new ApiError(422, other, err))
          })
        }).catch(err => {
          t.rollback()
          const errObj = JSON.parse(JSON.stringify(err))
          const { parent, original, sql, ...other } = errObj
          next(new ApiError(422, other, err))
        })
      }).catch(err => {
        t.rollback()
        const errObj = JSON.parse(JSON.stringify(err))
        const {
          parent,
          original,
          sql,
          ...other
        } = errObj
        next(new ApiError(501, `Couldn't find sequence.`, err))
      })
    }
  )
}

export function srvUpdateExpense (id, data, updateBy, next) {
  return tbl_bank_entry.update({
    storeId: data.storeId,
    transDate: data.transDate,
    reference: data.reference,
    supplierId: data.supplierId,
    memberId: data.memberId,
    type: data.type,
    cashierTransId: data.cashierTransId,
    description: data.description,
    updatedBy: updateBy
  },
    { where: { id: id } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvDeleteExpense (id, next) {
  return tbl_bank_entry.destroy({
    where: {
      id: id
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}