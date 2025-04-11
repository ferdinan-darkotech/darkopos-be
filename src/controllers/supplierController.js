import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
  setSupplierInfo, getSupplierByCode, supplierExists, getData, countData, createSupplier,
  updateSupplier, deleteSupplier, deleteSuppliers, srvGetAPISupplier
}
  from '../services/supplierService'
import { getCityByCode } from '../services/cityService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrive list a supplier
exports.ctlGetAPISupplier = function (req, res, next) {
  console.log('Requesting-getSupplierAPI: ' + req.url + ' ...')
  const { type, vendorcode } = req.query
  return srvGetAPISupplier(type, vendorcode).then((supplier) => {
    if(!supplier) {
      throw new Error('Reference doesn\'t exists')
    }
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: supplier
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find reference of Supplier ${vendorcode}.`, err)))
}


exports.getSupplier = function (req, res, next) {
  console.log('Requesting-getSupplier: ' + req.url + ' ...')
  const suppliercode = req.params.id
  getSupplierByCode(suppliercode).then((supplier) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      supplier: supplier
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Supplier ${suppliercode}.`, err)))
}

// Retrive list of suppliers
exports.getSuppliers = function (req, res, next) {
  console.log('Requesting-getSuppliers: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  console.log('req.query', req.query)
  const pagination = {
    pageSize,
    page
  }
  return getData(other, pagination).then((data) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      pageSize: pageSize || 10,
      page: page || 1,
      total: data.count,
      data: data.rows
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Suppliers.`, err)))
}

// Create a new supplier
exports.insertSupplier = async function (req, res, next) {
  console.log('Requesting-insertSupplier: ' + req.url + ' ...')
  const suppliercode = req.params.id
  let supplier = req.body
  const userLogIn = extractTokenProfile(req)
  if(supplier.kelid === null || supplier.kelid === undefined) {
    next(new ApiError(422, `ZSPC-00015: Couldn't create Employee, Info Wilayah is required .`))
    return
  }
  try {
    const exists = await supplierExists(suppliercode)
    if (exists) {
      next(new ApiError(409, `Stock ${stockcode} already exists.`))
    } else {
      // const city = await getCityByCode(supplier.cityId)
      // supplier.cityId = city.id
      createSupplier(suppliercode, supplier, userLogIn.userid, next).then((supplierCreated) => {
        getSupplierByCode(supplierCreated.supplierCode).then((supplierByCode) => {
          let supplierInfo = setSupplierInfo(supplierByCode)
          let jsonObj = {
            success: true,
            message: `Supplier ${supplierInfo.supplierName} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { supplier: supplierInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find supplier ${suppliercode}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create supplier ${suppliercode}.`, err)))
    }
  } catch (err) {
    next(new ApiError(501, err + `ZSPC-0001. Couldn't find Product.`, err))
  }
}

//Update Supplier
exports.updateSupplier = function (req, res, next) {
  console.log('Requesting-updateSupplier: ' + req.url + ' ...')
  const suppliercode = req.params.id
  let supplier = req.body
  const userLogIn = extractTokenProfile(req)
  if(supplier.kelid === null || supplier.kelid === undefined) {
    next(new ApiError(422, `ZSPC-00016: Couldn't create Employee, Info Wilayah is required .`))
    return
  }
  supplierExists(suppliercode).then(exists => {
    if (exists) {
      return updateSupplier(suppliercode, supplier, userLogIn.userid, next).then((supplierUpdated) => {
        return getSupplierByCode(suppliercode).then((supplierByCode) => {
          const supplierInfo = setSupplierInfo(supplierByCode)
          let jsonObj = {
            success: true,
            message: `Supplier ${supplierByCode.supplierName} updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { supplier: supplierInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Supplier ${supplierCode}.`, err)))
      }).catch(err => next(new ApiError(422, `Couldn't find Supplier ${supplierCode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Supplier ${suppliercode} .`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Supplier ${supplier.supplierCode} .`, err)))
}

//Delete a Supplier
exports.deleteSupplier = function (req, res, next) {
  console.log('Requesting-deleteSupplier: ' + req.url + ' ...')
  let suppliercode = req.params.id
  supplierExists(suppliercode).then(exists => {
    if (exists) {
      deleteSupplier(suppliercode).then((supplierDeleted) => {
        if (supplierDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Supplier ${suppliercode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { supplier: supplierDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Supplier ${suppliercode} fail to delete.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Supplier ${suppliercode}.`, err)))
    } else {
      next(new ApiError(422, `Supplier ${suppliercode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Supplier ${suppliercode} not exists.`, err)))
}

//Delete some Supplier
exports.deleteSuppliers = function (req, res, next) {
  console.log('Requesting-deleteSuppliers: ' + req.url + ' ...')
  let suppliers = req.body;
  deleteSuppliers(suppliers).then((supplierDeleted) => {
    if (supplierDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Suppliers [ ${suppliers.supplierCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { suppliers: supplierDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Suppliers [ ${suppliers.supplierCode} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Suppliers [ ${suppliers.supplierCode} ].`, err)))
}

// // Daftar Supplier By Code
// exports.getSupplierByCode = function (req, res, next) {
//   console.log('Requesting /api/suppliers/listById ...')
//   const supplierCode = req.params.supplierCode
//
//   getSupplierByCode(supplierCode).then((supplier) => {
//     const supplierToReturn = setSupplierInfo(supplier)
//
//     res.xstatus(200).json({
//       suppliers: supplierToReturn
//     })
//   }).catch(err => next(new ApiError(501, `Couldn't find Supplier ${supplierCode}.`, err)))
// }