import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import sequelize from '../../native/sequelize'
import { getSelectOrder } from '../../native/nativeUtils'
import moment from 'moment'

let CashierCounter = db.tbl_cashier_counter
// let vwStockBrand = dbv.vw_stock_brand


export function srvSetCounterInfo (request) {
  const getCounterInfo = {
    name: request.counterName,
    desc: request.counterDesc
  }

  return getCounterInfo
}

export function srvCounterNameExists (counterName) {
  return srvGetCounterByName(counterName).then(counter => {
    if (counter == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function srvCounterIdExists (counterId) {
  return srvGetCounterById(counterId).then(counter => {
    if (counter == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function srvGetCounterByName (counterName) {
  return CashierCounter.findOne({
    where:
      sequelize.where(
        sequelize.fn('lower', sequelize.col('counterName')),
        sequelize.fn('lower', counterName)
      )
  })
}

export function srvGetCounterById (counterId) {
  return CashierCounter.findOne({
    where: {
      id: counterId
    },
    raw: false
  })
}

export function countData (query) {
  const { type, field, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { $iRegexp: query[key] }
    }
  }
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
    return CashierCounter.count({
      where: {
        $or: querying
      },
    })
  } else {
    return CashierCounter.count({
      where: {
        ...other
      }
    })
  }
}

export function srvGetCounters (query, pagination) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { $between: query[key] }
    }
  }
  const { pageSize, page, order } = pagination
  let sort
  if (order) sort = getSelectOrder(order)
  if (query.counterName) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'counterId')
      query = JSON.parse(str)
    }
    return CashierCounter.findAll({
      attributes: ['id', 'counterName', 'counterDesc',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      where: {
        $or: [
          {
            counterName: {
              $iRegexp: query.counterName,
            }
          }
        ]
      },
      order: sort,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    const { type, ...other } = query
    return CashierCounter.findAll({
      attributes: ['id', 'counterName', 'counterDesc',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      where: other,
      order: sort,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function srvCreateCounter (counter, createdBy, next) {
  return CashierCounter.create({
    counterName: counter.name,
    counterDesc: counter.desc,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function srvUpdateCounter (counterId, counter, updateBy, next) {
  return CashierCounter.update({
    counterName: counter.name,
    counterDesc: counter.desc,
    updatedBy: updateBy,
    updateAt: moment()
  },
    { where: { id: counterId } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvDeleteCounter (counterId, next) {
  return CashierCounter.destroy({
    where: {
      id: counterId
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}