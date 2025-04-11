import db from '../../models'
// import dbv from '../../models/view'
import sequelize from '../../native/sequelize'
import { ApiError } from '../../services/v1/errorHandlingService'
import stringSQL from '../../native/sqlSequence'
import moment from 'moment'

let tablePos = db.tbl_pos
let tbl_sequence = db.tbl_sequence
let table = db.tbl_follow_up
let tbl_follow_up_detail = db.tbl_follow_up_detail

// Customized view
// let view = dbv.vw_follow_up_detail_002

// const Fields = [
//   'followUpDetailId',
//   'followUpId',
//   'posDetailId',
//   'productId',
//   'customerSatisfaction',
//   'code',
//   'posId',
//   'memberId',
//   'memberCode',
//   'memberName',
//   'policeNo',
//   'policeNoId',
//   'lastMeter',
//   'transNoId',
//   'transNo',
//   'transDate',
//   'transTime',
//   'transNoStatus',
//   'total',
//   'totalDiscount',
//   'DPP',
//   'PPN',
//   'nettoTotal',
//   'status',
//   'lastCaller',
//   'lastCall',
//   'customerSatisfaction',
//   'postService',
//   'postServiceReason',
//   'nextCall',
//   'pendingReason',
//   'denyOfferingReason',
//   'acceptOfferingDate',
//   'acceptOfferingReason',
//   'memo',
//   'createdBy',
//   'createdAt',
//   'updatedBy',
//   'updatedAt'
// ]

export function getDataCode (id) {
  return tablePos.findOne({
    where: {
      id: id
    },
    raw: false
  })
}
export function getDataPosId (posId) {
  return table.findOne({
    where: {
      posId: posId
    },
    raw: false
  })
}

export function getDataId (id) {
  return table.findOne({
    where: {
      id: id
    },
    raw: false
  })
}

export function dataExists (id) {
  return getDataId(id).then(exists => {
    if (exists == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function dataExistsByPosId (id) {
  return getDataCode(id).then(exists => {
    if (exists == null) {
      return false
    }
    return true
  })
}

export function dataExistsByPosIdFollow (id) {
  return getDataPosId(id).then(exists => {
    if (exists == null) {
      return false
    }
    return true
  })
}

export function insertData (data, createdBy, next) {
  return sequelize.transaction(
    function (t) {
      let sSQL = stringSQL.s00001
      return sequelize.query(sSQL, {
        replacements: {
          seqCode: 'FUP',
          seqType: 1
        },
        type: sequelize.QueryTypes.CALL
      }).then((sqc) => {
        const sequence = sqc[0]
        return table.create({
          code: sequence[0].seq,
          posId: data.posId,
          status: 0,
          lastCaller: createdBy,
          createdBy: createdBy,
          createdAt: moment(),
          updatedBy: '---'
        }, { transaction: t }).then(result => {
          return tbl_sequence.findOne({
            attributes: ['seqValue'],
            where: {
              seqCode: 'FUP',
              storeId: 1
            }
          }).then(resultSeq => {
            return tbl_sequence.update({
              seqValue: resultSeq.seqValue + 1
            }, {
                where: {
                  seqCode: 'FUP',
                  storeId: 1
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

export function updateStatusCall (id, updateBy) {
  return table.update({
    status: '2',
    lastCaller: updateBy,
    lastCall: sequelize.literal('now()'),
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}

export function updateStatusPendingCall (id, data, updateBy) {
  return table.update({
    status: '3',
    lastCall: sequelize.literal('now()'),
    lastCaller: updateBy,
    nextCall: data.nextCall,
    pendingReason: data.pendingReason,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}

export function updateStatusAcceptOffering (id, data, updateBy) {
  return table.update({
    status: '1',
    lastCall: sequelize.literal('now()'),
    lastCaller: updateBy,
    acceptOfferingDate: data.acceptOfferingDate,
    acceptOfferingReason: data.acceptOfferingReason,
    denyOfferingReason: null,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}

export function updateStatusDenyOffering (id, data, updateBy) {
  return table.update({
    status: '1',
    lastCall: sequelize.literal('now()'),
    lastCaller: updateBy,
    acceptOfferingDate: null,
    acceptOfferingReason: null,
    denyOfferingReason: data.denyOfferingReason,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}

export function updateDataCall (id, data, detail, updateBy, next) {
  return sequelize.transaction(
    function (t) {
      return table.update({
        postService: data.postService,
        customerSatisfaction: data.customerSatisfaction,
        updatedBy: updateBy
      }, {
          where: {
            id: id
          }
        }, { transaction: t }).then(result => {
          var arrayProd = []
          for (var n = 0; n < detail.length; n += 1) {
            arrayProd.push({
              followUpId: id,
              posDetailId: detail[n].posDetailId,
              customerSatisfaction: detail[n].customerSatisfaction,
              createdBy: updateBy,
              updatedBy: null
            })
          }
          return tbl_follow_up_detail.bulkCreate(
            arrayProd, { transaction: t }
          ).catch(err => {
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

    }
  )
}
