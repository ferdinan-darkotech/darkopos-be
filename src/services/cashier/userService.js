import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'
import { getSelectOrder } from '../../native/nativeUtils'
import { setDefaultQuery } from '../../utils/setQuery'
import moment from 'moment'
import { Op } from 'sequelize'

let CashierUser = db.tbl_user_cashier
let vwCashierUser = dbv.vw_user_cashier
let vwCashierTrans = dbv.vw_cashier_trans
let Fields = ['id', 'cashierId', 'employeeName', 'cashierName', 'period',
  'openingCash', 'isCashierActive', 'isEmployeeActive',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]

export function srvSetCashierInfo (request) {
  const getUserInfo = {
    cashierId: request.cashierId,
    name: request.name,
    period: request.period,
    openingCash: request.openingCash,
    isCashierActive: request.isCashierActive,
    isEmployeeActive: request.isEmployeeActive,
  }

  return getUserInfo
}

export function srvGetUserCashierById (id) {
  return CashierUser.findOne({
    where: {
      cashierid: id
    },
    raw: false
  })
}


export function srvCashierIdExists (cashierId) {
  return srvGetUserCashierById(cashierId).then(cashier => {
    if (cashier == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function countData (query) {
  const { type, field, order, ...other } = query
  for (let key in other) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = { between: query[key] }
    } else if (type !== 'all' && query['q']) {
      query[key] = { [Op.iRegexp]: query[key] }
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
    return vwCashierUser.count({
      where: {
        [Op.or]: querying
      },
    })
  } else {
    return vwCashierUser.count({
      where: {
        ...other
      }
    })
  }
}

export function srvGetUserCashiers (query, pagination) {
  const { pageSize, page } = pagination
  const { type, field, order, q, ...other } = query
  let sort
  if (order) sort = getSelectOrder(order)

  if (other.hasOwnProperty('active')) {
    other.isCashierActive = other.active
    delete other.active
  }
  if (other.hasOwnProperty('employee')) {
    other.isEmployeeActive = other.employee
    delete other.employee
  }
  for (let key in query) {
    if (key === 'createdAt' || key === 'updatedAt') {
      query[key] = query[key]
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
    return vwCashierUser.findAll({
      attributes: Fields,
      where: {
        [Op.or]: querying
      },
      order: order ? sequelize.literal(order) : null,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10)
    })
  } else {
    return vwCashierUser.findAll({
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

export function srvGetUserCashiersV2 (query) {
  const { m, mode, ...other } = query
  let queryDefault = setDefaultQuery(Fields, { ...other, browsedata: true }, true)
  return vwCashierUser.findAndCountAll({
    attributes: Fields,
    ...queryDefault,
    raw: false
  })
}

export function srvCreateUserCashier (cashier, createdBy, next) {
  return CashierUser.create({
    cashierId: cashier.cashierId,
    period: cashier.period,
    openingCash: cashier.cash,
    active: +cashier.active,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function srvUpdateUserCashier (id, cashier, updateBy, next) {
  return CashierUser.update({
    cashierId: cashier.cashierId,
    period: cashier.period,
    openingCash: cashier.cash,
    active: +cashier.active,
    updatedBy: updateBy,
    updatedAt: moment(),
  },
    { where: { id: id } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvDeleteUserCashier (id, next) {
  return CashierUser.destroy({
    where: {
      id: id
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function srvGetUserCashierPeriods (cashierId, query, pagination) {
  const { pageSize, page, order } = pagination
  let sort
  if (order) sort = getSelectOrder(order)
  return vwCashierTrans.findAll({
    where: {
      cashierId: cashierId
    },
    order: sort,
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10),
    raw: false
  })
}
export function srvGetUserCashierPeriodByStatus (params, query, pagination) {
  const { pageSize, page, order } = pagination
  let sort
  if (order) sort = getSelectOrder(order)
  return vwCashierTrans.findAll({
    where: {
      cashierId: params.cashierid,
      status: params.status
    },
    order: sort,
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10),
    raw: false
  })
}

export function srvGetUserCashierPeriodByStore (params, query, pagination) {
  const { pageSize, page, order } = pagination
  let sort
  if (order) sort = getSelectOrder(order)

  let whereCondition = {
    cashierId: params.cashierid,
    storeId: params.storeid
  }

  if (query.hasOwnProperty('period')) {
    whereCondition = {
      ...whereCondition,
      period: { [Op.between]: query.period }
    }
  }

  return vwCashierTrans.findAll({
    where: whereCondition,
    order: sort,
    limit: parseInt(pageSize || 10, 10),
    offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10),
    raw: false
  })
}

export function srvGetUserCashierPeriodByStoreStatus (params, query, pagination, mode = 'all') {
  const { pageSize, page, order } = pagination
  let sort = [['period', 'ASC'], ['shiftId', 'DESC'], ['counterId', 'ASC']]
  if (order) sort = getSelectOrder(order)

  let whereCondition = {
    cashierId: params.cashierid,
    storeId: params.storeid,
    status: params.status
  }

  if (query.hasOwnProperty('period')) {
    whereCondition = {
      ...whereCondition,
      period: { [Op.between]: query.period }
    }
  }
  if (mode === 'all') {
    sort = [['period', 'ASC'], ['shiftId', 'DESC'], ['counterId', 'ASC']]
    return vwCashierTrans.findAll({
      where: whereCondition,
      order: sort,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10),
      raw: false
    }).then(rs => {
      let data = JSON.parse(JSON.stringify(rs))
      if(rs.length > 0) {
        return data.map(x => ({ ...x, period: moment(x.period).format('YYYY-MM-DD') }))
      } else {
        return data
      }
    }).catch(er => er)
  } else {
    sort = [['period', 'DESC'], ['shiftId', 'DESC'], ['counterId', 'ASC']]
    return vwCashierTrans.findOne({
      where: whereCondition,
      order: sort,
      limit: parseInt(pageSize || 10, 10),
      offset: parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10),
      raw: false
    }).then(rs => {
      let data = JSON.parse(JSON.stringify(rs))
      if(rs) {
        return { ...data, period: moment(data.period).format('YYYY-MM-DD') }
      } else {
        return data
      }
    }).catch(er => er)
  }

}