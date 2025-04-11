/**
 * Created by boo on 01/10/18.
 */
import sequelize from './sequelize'

export function getNativeQuery (sSQL, plain, queryTypes, next, transaction) {
  // console.log('sSQL', queryTypes, ' - ', sSQL)
  let seqQueryType = sequelize.QueryTypes.SELECT
  if (queryTypes === 'INSERT') {
    seqQueryType = sequelize.QueryTypes.INSERT
  } else if (queryTypes === 'UPDATE') {
    seqQueryType = sequelize.QueryTypes.UPDATE
  } else if (queryTypes === 'CALL') {
    seqQueryType = sequelize.QueryTypes.CALL
  } else if (queryTypes === 'RAW') {
    seqQueryType = sequelize.QueryTypes.RAW
  }

  return new Promise(function (resolve, reject) {
    sequelize.query(sSQL, { plain: plain, raw: queryTypes === 'RAW', type: seqQueryType, transaction })
      .then(data => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })

}

export function getSelectAddition (query) {
  const { page, pageSize, order, ...other } = query
  const offset = page ? " OFFSET " + Math.max(page - 1, 0) * (pageSize || 0) : ""
  const limit = (pageSize ? " LIMIT " + pageSize + offset : "")
  let sort = ''
  if (order) {
    sort = order.replace('-', ' DESC')
    sort = " ORDER BY " + sort
  }
  return { 'limit': limit, 'order': sort }
}

export function getSelectOrder (orderBy) {
  const splitOrder = orderBy.split(",")
  let splitDash
  let arrayOrder = []
  for (var i = 0; i < splitOrder.length; i++) {
    splitDash = splitOrder[i].split("-");
    arrayOrder.push(splitDash);
  }
  for (var i = 0; i < arrayOrder.length; i++) {
    if (typeof arrayOrder[i][1] === 'undefined') {
      arrayOrder[i][1] = "ASC"
    }
    else {
      arrayOrder[i][1] = "DESC"
    }
  }
  return arrayOrder
}