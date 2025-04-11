import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import stringSQL from '../../native/sqlSequence'
import moment from 'moment'
import { getTotalDisc } from '../../utils/pos'

let table = db.tbl_bundling
let tbl_sequence = db.tbl_sequence
let tbl_bundling_rules = db.tbl_bundling_rules
let tbl_bundling_reward = db.tbl_bundling_reward
const Fields = [
  'id',
  'type',
  'code',
  'name',
  'startDate',
  'endDate',
  'startHour',
  'endHour',
  'availableDate',
  'availableStore',
  'applyMultiple',
  'ttl_rules_qty_services',
  'ttl_rules_qty_product',
  'ttl_reward_qty_services',
  'ttl_reward_qty_product',
  'ttl_reward_price_services',
  'ttl_reward_price_product',
  'generate_key_number',
  'status',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt'
]

export function checkIfBundlingNeedUniqueKey (listCode = []) {
  return table.findAll({
    attributes: ['id', 'code'],
    where: {
      code: { $in: listCode },
      generate_key_number: { $gt: 0 }
    },
    raw: true
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

export function getDataCode (id) {
  return table.findOne({
    where: {
      code: id
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
export function dataExistsCode (code, returnData) {
  return getDataCode(code).then(exists => {
    if (exists == null) {
      return returnData ? exists : false
    }
    return returnData ? exists : true
  })
}

export function countData (query) {
  const { type, field, order, tmpId, activeOnly, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all' || (key !== 'id' && tmpId)) {
      query[key] = { $iRegexp: query[key] }
    }
  }
  let querying = []
  if (query['q']) {
    for (let key in Fields) {
      const id = Object.assign(Fields)[key]
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || key === 'id') || !tmpId) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      } else if (key === 'id' || tmpId) {
        querying.push({ id: query['q'] })
      } else if (key === 'status' && !!JSON.parse(activeOnly || 'false')) {
        querying.push({ status: { $eq: true } })
      }
    }
  }
  if (querying.length > 0) {
    return table.count({
      where: {
        $or: querying
      },
    })
  } else if (other.text !== undefined || other.text !== null) {
    const statusActiveOnly = !!JSON.parse(activeOnly || 'false') ? { status: 'true' } : {}
    return table.count({
      where: {
        $and: [{$or: { code: { $iRegexp: other.text }, name: { $iRegexp: other.text } }}, statusActiveOnly]
      }
    })
  } else {
    return table.count({
      where: {
        ...other
      }
    })
  }
}

export function getData (query, pagination) {
  const { type, field, order, tmpItem, tmpId, activeOnly, ...other } = query
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
      if (!(id === 'createdBy' || id === 'updatedBy' || id === 'createdAt' || id === 'updatedAt' || key === 'id') || !tmpId) {
        let obj = {}
        obj[id] = query['q']
        querying.push(obj)
      } else if (key === 'id' || tmpId) {
        querying.push({ id: query['q'] })
      } else if (key === 'status' && !!JSON.parse(activeOnly || 'false')) {
        querying.push({ status: { $eq: true } })
      }
    }
  }

  if (querying.length > 0) {
    return table.findAll({
      attributes: Fields,
      where: {
        $or: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else if (other.text !== undefined && other.text !== null) {
    const statusActiveOnly = !!JSON.parse(activeOnly || 'false') ? { status: 'true' } : {}
    return table.findAll({
      where: {
        $and: [{$or: { code: { $iRegexp: other.text }, name: { $iRegexp: other.text } }}, statusActiveOnly]
      },
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      order: order ? sequelize.literal(order) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  } else {
    return table.findAll({
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



export function insertData (data, rules = [], _reward = [], createdBy, next) {
  const reward = _reward.map(x => ({
    type: x.type,
    productId: x.productId,
    sellingPrice: x.sellingPrice,
    qty: x.qty,
    disc1: data.type === '0' ? 100 : x.disc1,
    disc2: data.type === '0' ? 0 : x.disc2,
    disc3: data.type === '0' ? 0 : x.disc3,
    discount: data.type === '0' ? 0 : x.discount
  }))

  const sumReward = reward.reduce(
    (x, { type, total, qty, disc1, disc2, disc3, discount }) => ({
      pQty: x.pQty + (type === 'P' ? qty : 0),
      sQty: x.sQty + (type === 'S' ? qty : 0),
      pPrice: x.pPrice + (type === 'P' ? getTotalDisc({ price: x.sellingPrice, qty, disc1, disc2, disc3, discn: discount }) : 0),
      sPrice: x.sPrice + (type === 'S' ? getTotalDisc({ price: x.sellingPrice, qty, disc1, disc2, disc3, discn: discount }) : 0)
    }),
    { pQty: 0, sQty: 0, pPrice: 0, sPrice: 0 })
  
  const sumRules = rules.reduce(
    (x, { type, qty }) => ({
      pQty: x.pQty + (type === 'P' ? qty : 0),
      sQty: x.sQty + (type === 'S' ? qty : 0)
    }),
    { pQty: 0, sQty: 0 })
  return sequelize.transaction(
    function (t) {
      let sSQL = stringSQL.s00001
      return sequelize.query(sSQL, {
        replacements: {
          seqCode: 'PRM',
          seqType: 1
        },
        type: sequelize.QueryTypes.CALL
      }).then((sqc) => {
        const sequence = sqc[0]
        return table.create({
          type: data.type,
          reg_id: data.regID,
          code: sequence[0].seq,
          name: data.name,
          startDate: moment(data.startDate).format('YYYY-MM-DD'),
          endDate: moment(data.endDate).format('YYYY-MM-DD'),
          startHour: data.startHour,
          endHour: data.endHour,
          ttl_rules_qty_services: sumRules.sQty,
          ttl_rules_qty_product: sumRules.pQty,
          ttl_reward_qty_services: sumReward.sQty,
          ttl_reward_qty_product: sumReward.pQty,
          ttl_reward_price_services: sumReward.sPrice,
          ttl_reward_price_product: sumReward.pPrice,
          availableDate: data.availableDate,
          availableStore: data.availableStore,
          applyMultiple: false, // +data.applyMultiple,
          generate_key_number: +data.generate_key_number,
          createdBy: createdBy,
          createdAt: moment(),
          updatedBy: '---'
        }, { transaction: t }).then(result => {
          // if (rules.length === 0) {
          //   t.rollback()
          //   return next(new ApiError(409, 'Rules is Required'))
          // }
          let arrayProdRules = []
          for (var n = 0; n < rules.length; n += 1) {
            arrayProdRules.push({
              type: rules[n].type,
              bundleId: result.dataValues.id,
              productId: rules[n].type === 'P' ? rules[n].productId : null,
              serviceId: rules[n].type !== 'P' ? rules[n].productId : null,
              qty: rules[n].qty,
              sellingPrice: rules[n].sellingPrice,
              createdBy: createdBy,
              updatedBy: null
            })
          }
          
          return tbl_bundling_rules.bulkCreate(
            arrayProdRules, { transaction: t }
          ).then(resultRules => {
            if (reward.length === 0) {
              t.rollback()
              return next(new ApiError(409, 'Reward is Required'))
            }
            let arrayProdReward = []
            for (var n = 0; n < reward.length; n += 1) {
              arrayProdReward.push({
                type: reward[n].type,
                bundleId: result.dataValues.id,
                productId: reward[n].type === 'P' ? reward[n].productId : null,
                serviceId: reward[n].type !== 'P' ? reward[n].productId : null,
                sellingPrice: reward[n].sellingPrice,
                qty: reward[n].qty,
                disc1: reward[n].disc1,
                disc2: reward[n].disc2,
                disc3: reward[n].disc3,
                discount: reward[n].discount,
                createdBy: createdBy,
                updatedBy: null
              })
            }

            return tbl_bundling_reward.bulkCreate(
              arrayProdReward,
              { transaction: t }
            ).then(resultReward => {
              return tbl_sequence.findOne({
                attributes: ['seqValue'],
                where: {
                  seqCode: 'PRM',
                  storeId: 1
                }
              }).then(resultSeq => {
                // throw 'stop'
                return tbl_sequence.update({
                  seqValue: resultSeq.seqValue + 1
                }, {
                    where: {
                      seqCode: 'PRM',
                      storeId: 1
                    }
                  }).catch(err => {
                    t.rollback()
                    return err
                  })
              })
            })
          }).catch(err => {
            t.rollback()
            const errObj = JSON.parse(JSON.stringify(err))
            const { parent, original, sql, ...other } = errObj
            return err
          })
        }).catch(err => {
          t.rollback()
          const errObj = JSON.parse(JSON.stringify(err))
          const { parent, original, sql, ...other } = errObj
          return err
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
        return err
      })
    }
  )
}

export function updateData (id, data, updateBy) {
  return table.update({
    type: data.type,
    name: data.name,
    startDate: moment(data.startDate).format('YYYY-MM-DD'),
    endDate: moment(data.endDate).format('YYYY-MM-DD'),
    startHour: data.startHour,
    endHour: data.endHour,
    availableDate: data.availableDate,
    availableStore: data.availableStore,
    applyMultiple: data.applyMultiple,
    status: data.status,
    updatedBy: updateBy,
    updatedAt: moment()
  },
    {
      where: {
        id: id
      }
    }
  )
}

export function cancelData (id, data, updateBy) {
  return table.update({
    status: data.status ? data.status : false,
    updatedBy: updateBy
  },
    {
      where: {
        id: id
      }
    }
  )
}

export function deleteData (id, next) {
  return table.destroy({
    where: {
      id: id
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}