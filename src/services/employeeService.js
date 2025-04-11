import db from '../models/tableR'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import sequelize from '../native/sequelize'

const Employee = db.tbl_employee

const vwEmployee = dbv.vw_employee
const vwEmployeeNotUser = dbv.vw_employee_not_user

const emplFields = ['employeeId', 'idType', 'idNo', 'employeeName', 'positionId', 'address01', 'address02',
  'cityId', 'state', 'zipCode', 'mobileNumber', 'phoneNumber', 'email',
  'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
]
const emplBrowseFields = ['id', 'idType', 'idNo', 'employeeId', 'employeeName', 'positionId', 'positionName',
  'address01', 'address02', 'cityId', 'cityName', 'mobileNumber', 'phoneNumber', 'email', 'createdBy',
  'createdAt', 'updatedBy', 'updatedAt'
]


export function getEmployeeById (employeeId) {
  return Employee.findOne({
    where: {
      $or: [
        { employeeId: employeeId },
        { employeeName: employeeId },
      ]
    },
    raw: false
  })
}

export function getEmployeesData (query) {
  console.log('employeeSearch', query)
  if (query) {
    for (let key in query) {
      if (key === 'createdAt') {
        query[key] = { between: query[key] }
      }
    }
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'employeeId')
      query = JSON.parse(str)
      return vwEmployee.findAll({
        attributes: emplFields,
        where: {
          ...query
        }
      })
    } else if (query.hasOwnProperty('fields')) {
      if (query.hasOwnProperty('for') && query.for === 'user') {
        // lov for filter employee that not a user
        return vwEmployeeNotUser.findAll({
          attributes: query.fields.split(',')
        })
      } else {
        return vwEmployee.findAll({
          attributes: query.fields.split(',')
        })
      }
    } else if (query.employeeName) {
      return vwEmployee.findAll({
        attributes: emplBrowseFields,
        where: {
          employeeName: {
            $iRegexp: query.employeeName
          }
        }
      })
    } else {
      return vwEmployee.findAll({
        attributes: emplBrowseFields,
      })
    }
  } else {
    return vwEmployee.findAll({
      attributes: emplFields
    })
  }
}

export function setEmployeeInfo (request) {
  const getEmployeeInfo = {
    employeeId: request.employeeId,
    employeeName: request.employeeName,
    employeePositionId: request.employeePositionId
  }

  return getEmployeeInfo
}

export function employeeExists (employeeId) {
  return getEmployeeById(employeeId).then(employee => {
    if (employee == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createEmployee (employeeid, employee, createdBy, next) {
  return Employee.create({
    employeeId: employeeid,
    idNo: employee.idNo,
    idType: employee.idType,
    employeeName: employee.employeeName,
    positionId: employee.positionId,
    address01: employee.address01,
    address02: employee.address02,
    cityId: employee.cityId,
    state: employee.state,
    zipCode: employee.zipCode,
    mobileNumber: employee.mobileNumber,
    phoneNumber: employee.phoneNumber,
    email: employee.email,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateEmployee (employeeid, employee, updateBy, next) {
  return Employee.update({
    idNo: employee.idNo,
    idType: employee.idType,
    employeeName: employee.employeeName,
    positionId: employee.positionId,
    address01: employee.address01,
    address02: employee.address02,
    cityId: employee.cityId,
    state: employee.state,
    zipCode: employee.zipCode,
    mobileNumber: employee.mobileNumber,
    phoneNumber: employee.phoneNumber,
    email: employee.email,
    updatedBy: updateBy
  },
    { where: { employeeId: employeeid } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteEmployee (employeeid) {
  return Employee.destroy({
    where: {
      employeeId: employeeid
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteEmployees (employees, next) {
  if (!isEmpty(employees)) {
    return Employee.destroy({
      where: employees
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
