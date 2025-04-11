import { ApiError } from '../../../../services/v1/errorHandlingService'
import {
  srvGetEmployees, srvGetEmployeeById, srvGetEmployeeByEmpId, srvEmployeeExist,
  srvCreateEmployee, srvUpdateEmployee, srvDeleteEmployee, srvGetEmployeeForReports
} from '../../../../services/v2/master/humanresource/srvEmployee'
import { srvGetStoreByCode } from '../../../../services/setting/storeService'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get Employees
const getEmployees = function (req, res, next, filter = false, comment = 'getEmployees') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  
  return new Promise((resolve, reject) => {
    let { pageSize, page, ...other } = req.query
    let pagination = {
      pageSize: parseInt(pageSize || 10),
      page: parseInt(page || 1),
    }

    if(typeof other.m !== 'string') {
      throw 'Wrong format of data mode.'
    }

    if (other && other.hasOwnProperty('m')) {
      const mode = other.m.split(',')
      if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
    }
    srvGetEmployees(req.query, filter).then((emp) => {
      const employee = JSON.parse(JSON.stringify(emp))
      resolve(res.xstatus(200).json({
        success: true,
        message: 'Ok',
        ...pagination,
        total: employee.count,
        data: employee.rows
      }))
    }).catch(err => next(new ApiError(422, `ZCEP-00001: Couldn't find Employees`, err)))
  }).catch(err => next(new ApiError(422, `ZCEP-00001: Couldn't find Employees`, err)))
}

// Get General Employees
exports.getEmployeesGeneral = function (req, res, next) {
  getEmployees(req, res, next, false, 'getEmployeesGeneral')
}

// Get Filtered Employees
exports.getEmployeesFilter = function (req, res, next) {
  getEmployees(req, res, next, true, 'getEmployeesFilter')
}

// Get An Employee By Employee Id
exports.getEmployeeForReports = function (req, res, next) {
  console.log('Requesting-getEmployeeByEmpId: ' + JSON.stringify(req.params) + ' ...')
  srvGetEmployeeForReports().then((employee) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: employee
    })
  }).catch(err => next(new ApiError(422,`ZCEP-00001: Couldn't find Employee`, err)))
}

// Get An Employee By Employee Id
exports.getEmployeeByEmpId = function (req, res, next) {
  console.log('Requesting-getEmployeeByEmpId: ' + JSON.stringify(req.params) + ' ...')
  let { empId } = req.params
  srvGetEmployeeByEmpId(empId, req.query).then((employee) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: employee
    })
  }).catch(err => next(new ApiError(422,`ZCEP-00002: Couldn't find Employee`, err)))
}

// Create a new Employee
exports.insertEmployee = async function (req, res, next) {
  console.log('Requesting-insertEmployee: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  const storeData = data.storecode ? await srvGetStoreByCode(data.storecode) : {}
  const storeid = JSON.parse(JSON.stringify(storeData)) ? JSON.parse(JSON.stringify(storeData)).id : null
  if(data.kelid === null || data.kelid === undefined) {
    next(new ApiError(422, `ZCEP-00003: Couldn't create Employee, Info Wilayah is required .`))
    return
  }
  srvCreateEmployee({ ...data, storeid }, userLogIn.userid, next).then((created) => {
    return srvGetEmployeeById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Employee ${result.employeeId} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCEP-00011: Couldn't create Employee ${data.employeeName} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCEP-00004: Couldn't find Employee ${data.employeeName}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCEP-00005: Couldn't create Employee ${data.employeeName}.`, err)))
}

//Update a Employee
exports.updateEmployee = function (req, res, next) {
  console.log('Requesting-updateEmployee: ' + req.url + ' ...')
  let data = req.body
  data.empId = req.params.empId
  const userLogIn = extractTokenProfile(req)
  if(data.kelid === null || data.kelid === undefined) {
    next(new ApiError(422, `ZCEP-00012: Couldn't create Employee, Info Wilayah is required .`))
    return
  }
  srvEmployeeExist(data.empId).then(async exists => {
    const storeData = data.storecode ? await srvGetStoreByCode(data.storecode) : {}
    const storeid = storeData ? storeData.id : null 
    if (exists) {
      return srvUpdateEmployee({ ...data, storeid }, userLogIn.userid, next).then((updated) => {
        return srvGetEmployeeByEmpId(data.empId).then((result) => {
          let jsonObj = {
            success: true,
            message: `Employee ${result.employeeId} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCEP-00007: Couldn't update Employee ${data.empId}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCEP-00008: Couldn't update Employee ${data.empId}.`, err)))
    } else {
      next(new ApiError(422, `ZCEP-00009: Couldn't find Employee ${data.empId} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCEP-00010: Couldn't find Employee ${data.empId} .`, err)))
}

// //Delete a Employee
exports.deleteEmployee = function (req, res, next) {
  console.log('Requesting-deleteEmployee: ' + req.url + ' ...')
  const employeeId  = req.params.empId
  srvEmployeeExist(employeeId).then(exists => {
    if (exists) {
      srvDeleteEmployee(employeeId, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Employee ${employeeId} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCEP-00011: Couldn't delete Employee ${employeeId}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCEP-00012: Couldn't delete Employee ${employeeId}.`, err)))
    } else {
      next(new ApiError(422, `ZCEP-00013: Employee ${employeeId} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCEP-00014: Employee ${employeeId} not exists.`, err)))
}
