import { ApiError} from '../../services/v1/errorHandlingService'
import sequelize from '../../native/sequelize'

const sqlUpdateDefaultRole = "UPDATE tbl_user_role SET defaultRole=0 " +
  "WHERE userId = '" + "_BIND01" + "';" +
  "UPDATE tbl_user_role SET defaultrole=1 " +
  "WHERE userId = '" + "_BIND01" + "' AND userRole = '" + "_BIND02" + "';"
const sqlDefaultRole = `SELECT userRole AS "defaultRoleName" FROM vw_user_role ` +
  "WHERE userId = '" + "_BIND01" + "' AND defaultrolestatus=1;"

const stringSQL = {
  s00001: sqlDefaultRole,
  s00002: sqlUpdateDefaultRole,
}

export function getRoleQuery(query, mode, next) {
  let sSQL
  switch (mode) {
    case 'defaultrole':
      sSQL = stringSQL.s00001
      sSQL = sSQL.replace(/_BIND01/g,query.userId)
      break
    case 'updatedefaultrole':
      sSQL = stringSQL.s00002
      sSQL = sSQL.replace(/_BIND01/g,query.userId).replace("_BIND02",query.defaultRole)
      break
    default: sSQL = stringSQL.s00001;break
  }

  console.log('sSQL', sSQL)

  return sequelize.query(sSQL, { type: sequelize.QueryTypes.SELECT}).then(data => {
    return data
  }).catch(err => {
    next(new ApiError(501, err, err))
  })
}

