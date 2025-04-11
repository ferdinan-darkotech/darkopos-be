import db from '../../models'
import dbv from '../../models/view'
import { ApiError } from '../../services/v1/errorHandlingService'
import { isEmpty } from '../../utils/check'
import sequelize from '../../native/sequelize'
import { getSelectOrder } from '../../native/nativeUtils'
import moment from 'moment'

let CashierShift = db.tbl_cashier_shift
let vwCashierShift = dbv.vw_cashier_shift


export function srvSetShiftInfo (request) {
  const getShiftInfo = {
    name: request.shiftName,
    start: request.startTime,
    end: request.endTime,
    sequence: request.sequence
  }

  return getShiftInfo
}

export function srvShiftNameExists (shiftName) {
  return srvGetShiftByName(shiftName).then(shift => {
    if (shift == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function srvShiftIdExists (shiftId) {
  return srvGetShiftById(shiftId).then(shift => {
    if (shift == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function srvGetShiftByName (shiftName) {
  return CashierShift.findOne({
    where:
      sequelize.where(
        sequelize.fn('lower', sequelize.col('shiftName')),
        sequelize.fn('lower', shiftName)
      )
  })
}

export function srvGetShiftById (shiftId) {
  return CashierShift.findOne({
    where: {
      id: shiftId
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
    return vwCashierShift.count({
      where: {
        $or: querying
      },
    })
  } else {
    return vwCashierShift.count({
      where: {
        ...other
      }
    })
  }
}

export function srvGetShifts (query, pagination) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { $between: query[key] }
    }
  }
  const { pageSize, page, order } = pagination
  let sort
  if (order) sort = getSelectOrder(order)
  if (query.shiftName) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'shiftId')
      query = JSON.parse(str)
    }
    return vwCashierShift.findAll({
      attributes: ['id', 'shiftName', 'startTime', 'endTime',
        'sequence', 'sequenceName',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      where: {
        $or: [
          {
            shiftName: {
              $iRegexp: query.shiftName,
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
    return vwCashierShift.findAll({
      attributes: ['id', 'shiftName', 'startTime', 'endTime',
        'sequence', 'sequenceName',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      where: other,
      order: sort,
      limit: type !== 'all' ? parseInt(pageSize || 10, 10) : null,
      offset: type !== 'all' ? parseInt(page - 1 || 0, 0) * parseInt(pageSize || 10, 10) : null
    })
  }
}

export function srvCreateShift (shift, createdBy, next) {
  return CashierShift.create({
    shiftName: shift.name,
    startTime: shift.start,
    endTime: shift.end,
    sequence: shift.sequence,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function srvUpdateShift (shiftId, shift, updateBy, next) {
  return CashierShift.update({
    shiftName: shift.name,
    startTime: shift.start,
    endTime: shift.end,
    sequence: shift.sequence,
    updatedBy: updateBy,
    updatedAt: moment()
  },
    { where: { id: shiftId } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function srvDeleteShift (shiftId, next) {
  return CashierShift.destroy({
    where: {
      id: shiftId
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}