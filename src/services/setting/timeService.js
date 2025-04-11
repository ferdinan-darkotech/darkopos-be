import sequelize from '../../native/sequelize'
import stringSQL from '../../native/setting/sqlTime'
import {
  ApiError
} from '../../services/v1/errorHandlingService'
import {
  isEmpty
} from '../../utils/check'

export function getDateTime (id, next) {
  let sSQL = ''
  if (id === 'time') {
    sSQL = stringSQL.s00001
  } else if (id === 'date') {
    sSQL = stringSQL.s00002
  } else if (id === 'timestamp') {
    sSQL = stringSQL.s00003
  }
  console.log('sSQL', sSQL)
  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, {
      type: sequelize.QueryTypes.SELECT
    })
      .then((data) => {
        resolve(data[0].time)
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