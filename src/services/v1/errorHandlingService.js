import uuid from 'uuid'
import { checkJSONNested, getObjects, isEmptyObject } from '../../utils/operate/objOpr'

const listSequelizeError = [
  'SequelizeForeignKeyConstraintError',
  'SequelizeUniqueConstraintError',
  'SequelizeValidationError',
  'SequelizeDatabaseError'
]
const listSequelizeErrorMessage = [
  { error: 'SequelizeForeignKeyConstraintError', message: 'Cannot delete or update a parent row: a foreign key constraint fails', code: 'ER_ROW_IS_REFERENCED_2' },
  { error: 'SequelizeUniqueConstraintError', message: 'Column on table must be unique', code: 'ER_DUP_ENTRY' },
  { error: 'SequelizeValidationError', message: 'notNull Violation', code: '' },
  { error: 'SequelizeDatabaseError', message: 'Unknown column', code: 'ER_ROW_IS_REFERENCED_2' }, //ER_BAD_FIELD_ERROR
]

export function logException(err) {
  let errorId = uuid.v4()
  console.error(new Date().toISOString(), errorId, err)
  return errorId
}

export function ApiError(vcode, vmessage, vdetails = '', next) {
  // console.log('zzzae0', vdetails)
  // vdetails sequelize error, key name => Object.keys(vdetails)
  // Object.keys(vdetails).map((x,i)=> console.log(i, '-', x, '-', vdetails[x]))
  // [ 'name', 'parent', 'original', 'sql', 'fields', 'table', 'value', 'index', 'reltype' ]
  // console.log('zzzxxx', vdetails.errors[1])
  let detName = {}
  let detError = []
  let detParent = { code: '', sqlMessage: '' }
  let detIndex = ''
  let detCode = ''
  let detMessage = ''
  if (checkJSONNested(vdetails, 'name')) {
    detName = vdetails.name
    if (checkJSONNested(vdetails, 'parent')) {
      if (checkJSONNested(vdetails, 'parent', 'code')) detParent.code = vdetails.parent.code
      if (checkJSONNested(vdetails, 'parent', 'sqlMessage')) detParent.sqlMessage = vdetails.parent.sqlMessage
    }
    if (checkJSONNested(vdetails, 'index')) detIndex = vdetails.index
    if (checkJSONNested(vdetails, 'errors')) {
      detError = vdetails.errors
    }

    detCode = detParent.code
    if (detError.length > 0) detCode = detCode || detError[0].type

    detMessage = (detIndex || detParent.sqlMessage)
    if (detError.length > 0) detMessage = detMessage || detError[0].message

    if (listSequelizeError.includes(vdetails.name)) {
      vcode = 403
      vmessage = getObjects(listSequelizeErrorMessage, 'error', vdetails.name)[0].message
      vdetails = [{
        code: detCode,
        type: detName,
        message: detMessage
      }]
    }
  }

  this.name = 'ApiError'
  this.code = vcode
  this.message = vmessage

  let parseDetail = vdetails.toString()
  if (typeof vdetails === 'object') {
    // check if return length > 0 then vdetails is array
    if (vdetails.length > 0) {
      parseDetail = vdetails
    } else {
      // else is an object, convert it to string ==> below is some examples
      // UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'id' of undefined
      // Error: Invalid value { id: null }
      //   at Object.escape (/home/boo/.wspc/nodejs/react/dmi-pos/be/node_modules/sequelize/lib/sql-string.js:51:11)
      parseDetail = vdetails.toString()
    }
  }
  this.details = parseDetail ? parseDetail : vmessage
  typeof next === 'function' ? next() : null
  // const errObj = JSON.parse(JSON.stringify(vdetails))
  // const { parent, original, sql, ...other } = errObj
}

