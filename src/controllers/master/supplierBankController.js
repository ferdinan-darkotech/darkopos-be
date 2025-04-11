import project from '../../../config/project.config'
import { ApiError } from '../../services/v1/errorHandlingService'
import {
  getBankSupplierId,
  getBankById,
  countData,
  getBankData,
  bankExists,
  createBank,
  updateBank,
  deleteBank
}
  from '../../services/master/supplierBankService'
import { extractTokenProfile } from '../../services/v1/securityService'
import { bankExistsByid } from '../../services/master/bankService';

// Retrieve list a bank by supplierId
exports.getBankSupplierId = function (req, res, next) {
  console.log('Requesting-getSupplierBankById: ' + req.url + ' ...')
  const id = req.params.id
  getBankSupplierId(id).then((result) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: result
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Bank ${id}.`, err)))
}

// Retrieve list a bank by id
exports.getBankById = function (req, res, next) {
  console.log('Requesting-getSupplierBankById: ' + req.url + ' ...')
  const id = req.params.id
  getBankById(id).then((result) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: result
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Bank ${id}.`, err)))
}

// Retrieve list of bank
exports.getBankData = function (req, res, next) {
  console.log('Requesting-getSupplierBankData: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  const pagination = {
    pageSize,
    page
  }
  countData(other).then((count) => {
    return getBankData(other, pagination).then((data) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        pageSize: pageSize || 10,
        page: page || 1,
        total: count,
        data: data
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Bank.`, err)))
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Bank.`, err)))
}

// Create a new bank
exports.insertBank = function (req, res, next) {
  console.log('Requesting-insertSupplierBank: ' + req.url + ' ...')
  const name = req.body.bankName
  const data = req.body
  const userLogIn = extractTokenProfile(req)
  bankExists(name).then(exists => {
    if (exists) {
      next(new ApiError(409, `Bank ${name} already exists.`))
    } else {
      return createBank(data, userLogIn.userid, next).then((result) => {
        return getBankById(result.id).then((resultName) => {
          let jsonObj = {
            success: true,
            message: `Supplier ${resultName.accountName} Account created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { bank: resultName }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find bank ${name}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create bank ${name}.`, err)))
    }
  })
}

//Update a Bank
exports.updateBank = function (req, res, next) {
  console.log('Requesting-updateBank: ' + req.url + ' ...')
  const id = req.params.id
  let data = req.body
  const userLogIn = extractTokenProfile(req)
  bankExists(id).then(exists => {
    if (exists) {
      return updateBank(id, data, userLogIn.userid, next).then((result) => {
        if (result) {
          let jsonObj = {
            success: true,
            message: `Bank ${id} updated`,
          }
          res.xstatus(200).json(jsonObj)
        }
      }).catch(err => next(new ApiError(500, `Couldn't update Bank ${id}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Bank ${id}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Bank ${id}.`, err)))
}

//Delete a Bank
exports.deleteBank = function (req, res, next) {
  console.log('Requesting-supplierDeleteBank: ' + req.url + ' ...')
  const id = req.params.id
  const userLogIn = extractTokenProfile(req)
  bankExistsByid(id).then(exists => {
    if (exists) {
      return deleteBank(id, userLogIn.userid, next).then((result) => {
        if (result) {
          let jsonObj = {
            success: true,
            message: `Supplier Bank ${id} deleted`,
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Bank ${id}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Bank ${id}.`, err)))
    } else {
      next(new ApiError(422, `Bank ${id} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Bank ${id} not exists.`, err)))
}
