/**
 * Created by panda .has .my .id on 4/17/27.
 */
import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
  setEmployeeInfo, getEmployeeById, employeeExists,
  getEmployeesData, createEmployee, updateEmployee, deleteEmployee, deleteEmployees
}
  from '../services/employeeService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrieve list an employee
exports.getEmployee = function (req, res, next) {
  console.log('Requesting-getEmployee: ' + req.url + ' ...')
  const employeeid = req.params.id
  getEmployeeById(employeeid).then((employee) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      employee: employee
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Employee ${employeeid}.`, err)))
}

// Retrieve list of employees
exports.getEmployees = function (req, res, next) {
  console.log('Requesting-getEmployees: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getEmployeesData(other).then((employees) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(employees)),
      total: employees.length
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Employees.`, err)))
}

// Retrieve list a mechanic
exports.getMechanic = function (req, res, next) {
  console.log('Requesting-getMechanic: ' + req.url + ' ...')
  const employeeid = req.params.id
  getEmployeeById(employeeid).then((employee) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      mechanic: employee
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Mechanic ${employeeid}.`, err)))
}

// Retrieve list of mechanics
exports.getMechanics = function (req, res, next) {
  console.log('Requesting-getMechanics: ' + req.url + ' ...')
  console.log('req.query', req.query)
  let { pageSize, page, ...other } = req.query
  getEmployeesData(other).then((employees) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(employees)),
      total: employees.length
    })
  }).catch(err => next(new ApiError(422, `Couldn't find getMechanics.`, err)))
}

// Create a new employee
exports.insertEmployee = function (req, res, next) {
  console.log('Requesting-insertEmployee: ' + req.url + ' ...')
  const employeeid = req.params.id
  const employee = req.body
  const userLogIn = extractTokenProfile(req)
  employeeExists(employeeid).then(exists => {
    if (exists) {
      next(new ApiError(409, `Employee ${employeeid} already exists.`))
    } else {
      createEmployee(employeeid, employee, userLogIn.userid, next).then((employeeCreated) => {
        getEmployeeById(employeeCreated.employeeId).then((employeeById) => {
          const employeeInfo = setEmployeeInfo(employeeById)
          let jsonObj = {
            success: true,
            message: `Employee ${employeeInfo.employeeId} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { employee: employeeInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find employee ${employeeid}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create employee ${employeeid}.`, err)))
    }
  })
}

//Update an Employee
exports.updateEmployee = function (req, res, next) {
  console.log('Requesting-updateEmployee: ' + req.url + ' ...')
  const employeeid = req.params.id
  let employee = req.body
  const userLogIn = extractTokenProfile(req)
  employeeExists(employeeid).then(exists => {
    if (exists) {
      return updateEmployee(employeeid, employee, userLogIn.userid, next).then((employeeUpdated) => {
        return getEmployeeById(employeeid).then((employeeById) => {
          const employeeInfo = setEmployeeInfo(employeeById)
          let jsonObj = {
            success: true,
            message: `User ${employeeById.employeeId} - ${employeeById.employeeName}  updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { employee: employeeInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Employee ${employeeid}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update Employee ${employeeid}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Employee ${employeeid}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Employee ${employee}.`, err)))
}

//Delete a Employee
exports.deleteEmployee = function (req, res, next) {
  console.log('Requesting-deleteEmployee: ' + req.url + ' ...')
  const employeeid = req.params.id
  employeeExists(employeeid).then(exists => {
    if (exists) {
      return deleteEmployee(employeeid).then((employeeDeleted) => {
        if (employeeDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Employee ${employeeid} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { employees: employeeDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Employee ${employeeid}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Employee ${employeeid}}.`, err)))
    } else {
      next(new ApiError(422, `Employee ${employeeid} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Employee ${employeeid} not exists.`, err)))
}

//Delete some Employee
exports.deleteEmployees = function (req, res, next) {
  console.log('Requesting-deleteEmployees: ' + req.url + ' ...')
  let employees = req.body;
  deleteEmployees(employees, next).then((employeeDeleted) => {
    if (employeeDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Employees [ ${employees.employeeId} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { employees: employeeDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Employees [ ${employees.employeeId} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Employees [ ${employees.employeeId} ].`, err)))
}
