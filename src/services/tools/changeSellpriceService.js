import { Op } from 'sequelize'
import db from '../../models'
import dbv from '../../models/view'
import sequelize from '../../native/sequelize'
import stringSQL from '../../native/sqlSequence'
import { ApiError } from '../../services/v1/errorHandlingService'

const tbl_stock = db.tbl_stock
const tbl_sequence = db.tbl_sequence
const tbl_change_sellprice = db.tbl_change_sellprice
const tbl_change_sellprice_detail = db.tbl_change_sellprice_detail
const tba_change_sellprice = db.tba_change_sellprice
const vwd_change_sellprice = dbv.vwd_change_sellprice
const vwh_change_sellprice = dbv.vwh_change_sellprice
const headerFields = [
  'id', 'transNo', 'transDate', 'description', 'status',
  'employeeId', 'employeeCode', 'employeeName',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const changesFields = [
  'id', 'transNoId', 'transNo', 'transDate', 'productId', 'productCode', 'productName', 'status',
  'categoryId', 'categoryName', 'brandId', 'brandName',
  'prevSellPrice', 'prevDistPrice01', 'prevDistPrice02',
  'distPrice01', 'distPrice02', 'sellPrice',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

export function getChangeSellpriceHeader (query, createdBy) {
  const { type, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in changesFields) {
      const id = Object.assign(changesFields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'status' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if ((querying || []).length > 0) {
    return vwh_change_sellprice.findAll({
      attributes: headerFields,
      where: {
        [Op.or]: querying,
        status: 0
      },
      order: [
        ['createdAt', 'ASC']
      ]
    })
  } else {
    return vwh_change_sellprice.findAll({
      attributes: headerFields,
      where: {
        ...other
      },
      order: [
        ['createdAt', 'ASC']
      ]
    })
  }
}

export function getChangeSellpriceData (query, pagination, createdBy) {
  const { type, ...other } = query
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
    }
  }
  let querying = []
  const { pageSize, page } = pagination
  if (query['q']) {
    for (let key in changesFields) {
      const id = Object.assign(changesFields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'status' || id === 'createdAt' || id === 'updatedAt')) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      }
    }
  }
  if (querying.length > 0) {
    return vwd_change_sellprice.findAll({
      attributes: changesFields,
      where: {
        [Op.or]: querying
      }
    })
  } else {
    return vwd_change_sellprice.findAll({
      attributes: changesFields,
      where: {
        ...other
      },
      limit: pageSize ? parseInt(pageSize || 10, 10) : null,
      offset: pageSize ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function createSellPrice (data, header, createdBy, next) {
  return sequelize.transaction(function (t) {
    let sSQL = stringSQL.s00001
    return sequelize.query(sSQL, {
      replacements: {
        seqCode: 'SPH',
        seqType: 1
      },
      type: sequelize.QueryTypes.CALL
    }).then((users) => {
      return tbl_change_sellprice.create({
        transNo: users[0].seq,
        employeeId: header.employeeId || null,
        description: header.description || null,
        createdBy: createdBy
      }, { transaction: t }).then((result) => {
        var arrayProd = []
        for (var n = 0; n < data.length; n++) {
          arrayProd.push({
            transNoId: result.dataValues.id,
            productId: data[n].productId,
            prevDistPrice01: data[n].prevDistPrice01,
            prevDistPrice02: data[n].prevDistPrice02,
            prevSellPrice: data[n].prevSellPrice,
            distPrice01: data[n].distPrice01,
            distPrice02: data[n].distPrice02,
            sellPrice: data[n].sellPrice,
            status: 0,
            createdBy: createdBy,
            updatedBy: '-----'
          })
        }
        return tbl_change_sellprice_detail.bulkCreate(
          arrayProd,
          { transaction: t }
        ).then(resultDetail => {
          return tbl_sequence.findOne({
            attributes: ['seqValue'],
            where: {
              seqCode: 'SPH',
              storeId: 1
            }
          }).then(resultSeq => {
            return tbl_sequence.update({
              seqValue: resultSeq.seqValue + 1
            }, {
                where: {
                  seqCode: 'SPH',
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
          next(new ApiError(422, err + `Couldn't save sellprice detail.`, err))
        })
      }).catch(err => {
        t.rollback()
        next(new ApiError(422, `Couldn't save sellprice.`, err))
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
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const {
      parent,
      original,
      sql,
      ...other
    } = errObj
    next(new ApiError(422, other, err))
    next(new ApiError(422, err + `Couldn't save sellprice.`, err))
  })
}
export function checkStatus (header, updatedBy, next) {
  return tbl_change_sellprice.findOne(
    {
      attributes: ['status', 'transNo'],
      where: {
        id: header.transNoId
      },
      raw: false
    }
  )
}

export function checkStatusForDelete (header, updatedBy, next) {
  return vwd_change_sellprice.findAll(
    {
      attributes: ['status', 'transNo'],
      where: {
        id: header,
        status: 0
      }
    }
  )
}

export function updateSellPrice (data, header, updatedBy, next) {
  return sequelize.transaction(function (t) {
    var arrayProd = []
    for (var n = 0; n < data.length; n++) {
      tbl_stock.update({
        sellPrice: data[n].sellPrice,
        distPrice01: data[n].distPrice01,
        distPrice02: data[n].distPrice02,
        updatedBy: updatedBy
      },
        {
          where: { id: data[n].productId }
        },
        { transaction: t }
      ).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const { parent, original, sql, ...other } = errObj
        t.rollback()
        next(new ApiError(400, other, err))
      })
      arrayProd.push({
        transNoId: header.transNoId,
        productId: data[n].productId,
        prevDistPrice01: data[n].prevDistPrice01,
        prevDistPrice02: data[n].prevDistPrice02,
        prevSellPrice: data[n].prevSellPrice,
        distPrice01: data[n].distPrice01,
        distPrice02: data[n].distPrice02,
        sellPrice: data[n].sellPrice,
        status: 1,
        createdBy: updatedBy
      })
    }
    return tbl_change_sellprice.update({
      status: 1,
      updatedBy: updatedBy
    }, {
        where: {
          id: header.transNoId
        }
      }, { transaction: t }).then(resultUpdate => {
        return tba_change_sellprice.bulkCreate(
          arrayProd,
          { transaction: t }
        ).catch(err => {
          t.rollback()
          const errObj = JSON.parse(JSON.stringify(err))
          const { parent, original, sql, ...other } = errObj
          next(new ApiError(400, other, err))
        })
      }).catch(err => {
        t.rollback()
        const errObj = JSON.parse(JSON.stringify(err))
        const { parent, original, sql, ...other } = errObj
        next(new ApiError(422, 'Cannot update status sellprice', err))
      })
  })
}

export function cancelSellPrice (id, updatedBy, next) {
  console.log('cancelSellPrice', id)
  return tbl_change_sellprice.update(
    {
      status: 2,
      updatedBy: updatedBy
    },
    {
      where: {
        id: id,
        status: 0
      }
    }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function deleteSellPrice (id, next) {
  console.log('deleteSellPrice', id)
  return tbl_change_sellprice_detail.destroy({
    where: {
      id: id
    }
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}
