import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getDataId, getData, countData, insertData, updateData, deleteData,
  cancelData, dataExists, dataExistsCode
} from '../../services/master/bundlingService'
import sequelize from '../../native/sequelize'

// Retrieve list a row
exports.getDataId = function (req, res, next) {
  console.log('Requesting-getDataId: ' + req.url + ' ...')
  const id = req.params.id
  getDataId(id).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: data
    })
  }).catch(err => next(new ApiError(422, `Couldn't find data ${id}.`, err)))
}

// Retrieve list of stocks
exports.getData = function (req, res, next) {
  console.log('Requesting-getDataPromo: ' + req.url + ' ...')
  let {
    pageSize,
    page,
    storeId,
    day,
    startDate,
    ...other
  } = req.query
  const pagination = {
    pageSize,
    page
  }
  if (other.name) {
    other.name = {
      $iRegexp: other.name
    }
  }
  other.type = 'all'
  other.status = '1'
  if (storeId) {
    other.availableStore = {
      $or: [
        {
          $like: `${storeId}`
        },
        {
          $like: `%,${storeId},%`
        },
        {
          $like: `%,${storeId}`
        },
        {
          $like: `${storeId},%`
        },
        {
          $eq: null
        }
      ]
    }
  }
  if (day) {
    other.availableDate = {
      $or: [
        {
          $like: `${day}`
        },
        {
          $like: `%,${day},%`
        },
        {
          $like: `%,${day}`
        },
        {
          $like: `${day},%`
        },
        {
          $eq: null
        }
      ]
    }
  }
  other.endDate = {
    $gte: sequelize.literal('current_date')
  }
  other.startDate = {
    $lte: sequelize.literal('current_date')
  }
  other.endHour = {
    $gte: sequelize.literal('current_time')
  }
  other.startHour = {
    $lte: sequelize.literal('current_time')
  }

  countData(other).then((count) => {
    return getData(other, pagination).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: count,
        data: data
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Data.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

// Retrieve list of stocks
exports.countData = function (req, res, next) {
  console.log('Requesting-countDataPromo: ' + req.url + ' ...')
  let {
    pageSize,
    page,
    storeId,
    day,
    startDate,
    ...other
  } = req.query
  const pagination = {
    pageSize,
    page
  }
  if (other.name) {
    other.name = {
      $like: `%${other.name}%`
    }
  }
  other.type = 'all'
  other.status = '1'
  if (storeId) {
    other.availableStore = {
      $or: [
        {
          $like: `${storeId}`
        },
        {
          $like: `%,${storeId},%`
        },
        {
          $like: `%,${storeId}`
        },
        {
          $like: `${storeId},%`
        },
        {
          $eq: null
        }
      ]
    }
  }
  if (day) {
    other.availableDate = {
      $or: [
        {
          $like: `${day}`
        },
        {
          $like: `%,${day},%`
        },
        {
          $like: `%,${day}`
        },
        {
          $like: `${day},%`
        },
        {
          $eq: null
        }
      ]
    }
  }
  other.endDate = {
    $gte: sequelize.literal('current_date')
  }
  other.startDate = {
    $lte: sequelize.literal('current_date')
  }
  other.endHour = {
    $gte: sequelize.literal('current_time')
  }
  other.startHour = {
    $lte: sequelize.literal('current_time')
  }

  countData(other).then((count) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: count,
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Data.`, err)))
}

// Create a new data
exports.insertData = function (req, res, next) {
  console.log('Requesting-insertData-Promo: ' + req.url + ' ...')
  const body = req.body
  const userLogIn = req.$userAuth
  dataExistsCode(body.data.code).then(exists => {
    if (!exists) {
      return insertData(body.data, body.listRules, body.listReward, userLogIn.userid, next).then((created) => {
        let jsonObj = {
          success: true,
          message: `Data created`,
        }
        if (project.message_detail === 'ON') { Object.assign(jsonObj, { data: created }) }
        res.xstatus(200).json(jsonObj)
      }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
    } else {
      next(new ApiError(422, `Record ${body.data.code} - ${body.data.name} already exists.`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't create stock.`, err)))
}

//Update a Data
exports.updateData = function (req, res, next) {
  console.log('Requesting-updateDataPromo: ' + req.url + ' ...')
  const id = req.params.id
  console.log('id', id)
  let data = req.body
  const userLogIn = req.$userAuth
  dataExists(id).then(exists => {
    if (exists) {
      return updateData(id, data, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: `Data updated`,
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

exports.cancelData = function (req, res, next) {
  console.log('Requesting-cancelDataBundling01: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body
  const userLogIn = req.$userAuth
  dataExists(id).then(exists => {
    if (exists) {
      return cancelData(id, data, userLogIn.userid).then((updated) => {
        if (updated) {
          let jsonObj = {
            success: true,
            message: 'Data success void',
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Data ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Data ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Data ${id}.`, err)))
}

// Delete a Record
exports.deleteData = function (req, res, next) {
  console.log('Requesting-deleteData: ' + req.url + ' ...')
  const id = req.params.id
  dataExists(id).then(exists => {
    if (exists) {
      return deleteData(id, next).then((stockDeleted) => {
        if (stockDeleted) {
          let jsonObj = {
            success: true,
            message: `Data ${id} deleted`,
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Data ${id}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Data ${id}.`, err)))
    } else {
      next(new ApiError(404, `Data ${id} not exists.`))
    }
  }).catch(err => next(new ApiError(404, `Data ${id} not exists.`, err)))
}
