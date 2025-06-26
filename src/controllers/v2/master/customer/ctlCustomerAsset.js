import { ApiError } from '../../../../services/v1/errorHandlingService'
// import { srvGetCustomers, srvGetCustomerById, srvGetCustomerByCode, srvCustomerExist,
//   srvCreateCustomer, srvUpdateCustomer, srvDeleteCustomer }
//   from '../../../../services/v2/master/customer/srvCustomerList'
import { srvGetCustomerAssets, srvGetCustomerAssetById, srvGetCustomerAssetByNo,
  srvCustomerAssetExist, srvGetCustomerByAsset, srvCreateCustomerAsset, srvUpdateCustomerAsset, srvDeleteCustomerAsset,
  srvGetAsset, srvGetAssetByPoliceNo,
  srvCustomerAssetExistById
 }
  from '../../../../services/v2/master/customer/srvCustomerAsset'
import { getStoreQuery } from '../../../../services/setting/storeService'
import { extractTokenProfile } from '../../../../services/v1/securityService'


// new fetch asset 2020-11-25 : AFX
export function ctlGetAsset (req, res, next) {
  console.log('Requesting-ctlGetAsset', req.query)
  const { rawMode = 'Y', ...others } = req.query
  return srvGetAsset(others, rawMode).then(asset => {
    res.xstatus(200).json({
      success: true,
      data: asset.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 1000,
      total: asset.count
    })
  }).catch(err => next(new ApiError(422, `ZCCA-00000: Couldn't find area`, err)))
}

// Get Customer Assets
const getCustomerAssets = function (req, res, next, filter = false, comment = 'getCustomerAssets') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }
  if (other && other.hasOwnProperty('m')) {
    const mode = other.m.split(',')
    if (['ar','lov'].some(_ => mode.includes(_))) pagination = {}
  }

  srvGetCustomerAssets(req.params, req.query, filter).then((customer) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: customer.count,
      data: customer.rows
    })
  }).catch(err => next(new ApiError(422, `ZCCA-00001: Couldn't find Customer Assets`, err)))
}

// Get General Customer Assets
exports.getCustomerAssetsGeneral = function (req, res, next) {
  getCustomerAssets(req, res, next, false, 'getCustomerAssetsGeneral')
}

// Get Filtered Customer Assets
exports.getCustomerAssetsFilter = function (req, res, next) {
  getCustomerAssets(req, res, next, true, 'getCustomerAssetsFilter')
}

// Get A Customer Asset By No
exports.getCustomerAssetByNo = function (req, res, next) {
  console.log('Requesting-getCustomerAssetByNo: ' + JSON.stringify(req.params) + ' ...')
  srvGetCustomerAssetByNo(req.params, req.query).then((customer) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: customer
    })
  }).catch(err => next(new ApiError(422,`ZCCA-00002: Couldn't find Customer Asset`, err)))
}

// Create a Customer Asset
exports.insertCustomerAsset = function (req, res, next) {
  console.log('Requesting-insertCustomerAsset: ' + req.url + ' ...')
  let data = req.body
  data.memberCode = req.params.code
  const info = data.policeNo + ' - ' + data.memberCode
  const userLogIn = extractTokenProfile(req)
  return getStoreQuery({ store: req.body.store || '-' }, 'settingstorebyho').then(async settStore => {
    const {
      setting: settingSelf,
      settingparent: settingParent
    } = (settStore[0] || [])
    const selfUniqPoliceNo = !!(((settingSelf || {}).uniqueVal || {}).policeNo || false)
    const parentUniqPoliceNo = !!(((settingParent || {}).uniqueVal || {}).policeNo || false)
    const finalUniqPoliceNo = (parentUniqPoliceNo || selfUniqPoliceNo)
    let dataAssetByPoliceNo = null
    if (finalUniqPoliceNo) {
      dataAssetByPoliceNo = await srvGetAssetByPoliceNo(data.policeNo, true)
    }
    if((dataAssetByPoliceNo || {}).membercode) {
      throw new Error(`No. Police ${data.policeNo} has been used on member (${dataAssetByPoliceNo.membercode})`)
    } else {
      return srvCreateCustomerAsset(data, userLogIn.userid, next).then((created) => {
        if (created) {
          return srvGetCustomerAssetById(created.id).then((result) => {
            if (result) {
              let jsonObj = {
                success: true,
                message: `Customer Asset ${info} for created`,
                data: result
              }
              res.xstatus(200).json(jsonObj)
            } else {
              next(new ApiError(422, `ZCCA-00003: Couldn't create Customer Asset ${info} .`))
            }
          }).catch(err => next(new ApiError(422, `ZCCA-00004: Couldn't find Customer Asset ${info}.`, err)))
        } else {
          next(new ApiError(422, `ZCCA-00003x: Couldn't create Customer Asset ${info} .`))
        }
      })
    }
  }).catch(err => next(new ApiError(422, `ZCCA-00005: Couldn't create Customer ${data.memberCode}.`, err)))
}

// Main Update a Customer Asset
const updateCustomerAssetMain = function (req, res, next, data, userLogIn, mode, info) {
  return srvUpdateCustomerAsset(data, userLogIn.userid, mode, next).then((updated) => {
    return srvGetCustomerAssetByNo(req.params).then((result) => {
      let jsonObj = {
        success: true,
        message: `Customer ${info} updated`,
        data: result
      }
      res.xstatus(200).json(jsonObj)
    }).catch(err => next(new ApiError(422, `ZCCA-00007: Couldn't update Customer Asset ${info}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCCA-00008: Couldn't update Customer Asset ${info}.`, err)))
}

// Update a Customer Asset
const updateCustomerAsset = function (req, res, next, mode = '', comment = 'updateCustomerAsset') {
  console.log('Requesting-' + comment + ': ' + req.url + ' ...')
  let data = req.body
  const { code: memberCode, no: policeNo } = req.params
  data.memberCode = memberCode
  data.policeNo = req.body.editPoliceNoEnabled ? req.body.policeNo : policeNo
  const info = policeNo + ' - ' + memberCode
  const userLogIn = extractTokenProfile(req)

  // [ENABLED EDIT POLICE NO]: FERDINAN - 2025/06/26
  if (req.body.editPoliceNoEnabled) {
    srvCustomerAssetExistById({ id: req.body.memberUnitId }, mode).then(exists => {
      srvCustomerAssetExist({ no: req.body.policeNo, code: memberCode }, mode).then(response => {
        if (response) {
          return next(new ApiError(409, `Police No ${req.body.policeNo} already exists.`))
        }
      })

      if (exists) {
        updateCustomerAssetMain(req, res, next, data, userLogIn, mode, info)
      } else {
        next(new ApiError(422, `ZCCA-00009: Customer Asset already exists.`))
      }
    }).catch(err => next(new ApiError(409, `ZCCA-00010: Couldn't find Customer Asset ${info} .`)))
  } else {
    srvCustomerAssetExist(req.params, mode).then(exists => {
      if (exists) {
        updateCustomerAssetMain(req, res, next, data, userLogIn, mode, info)
      } else {
        next(new ApiError(422, `ZCCA-00009: Couldn't find Customer Asset ${info} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCCA-00010: Couldn't find Customer Asset ${info} .`, err)))
  }
}

// Update General Customer Asset
exports.updateCustomerAssetGeneral = function (req, res, next) {
  updateCustomerAsset(req, res, next, '', 'updateCustomerAssetGeneral')
}


// Un-Delete a Customer Asset
exports.undeleteCustomerAsset = function (req, res, next) {
  updateCustomerAsset(req, res, next, 'undelete', 'updateCustomerAssetDeletedAt')
}

// Delete a Customer Asset
exports.deleteCustomerAsset = function (req, res, next) {
  console.log('Requesting-deleteCustomerAsset: ' + req.url + ' ...')
  const { code: memberCode, no: policeNo } = req.params
  const info = policeNo + ' - ' + memberCode
  const userLogIn = extractTokenProfile(req)
  srvCustomerAssetExist(req.params).then(exists => {
    if (exists) {
      srvDeleteCustomerAsset(req.params, next).then((deleted) => {
        if (deleted === 1) {
          updateCustomerAssetMain(req, res, next, { memberCode, policeNo }, userLogIn, 'delete', info)
          // let jsonObj = {
          //   success: true,
          //   message: `Customer Asset ${info} deleted`,
          //   data: deleted
          // }
          // res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCCA-00011: Couldn't delete Customer Asset ${info}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCCA-00012: Couldn't delete Customer Asset ${info}.`, err)))
    } else {
      next(new ApiError(422, `ZCCA-00013: Customer Asset ${info} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCCA-00014: Customer Asset ${info} not exists.`, err)))
}

// Get A Customer By Asset
exports.getCustomerByAsset = function (req, res, next) {
  console.log('Requesting-getCustomerByAsset: ' + JSON.stringify(req.params) + ' ...')
  let { pageSize, page, ...other } = req.query
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  }
  srvGetCustomerByAsset(req.params, req.query).then((customer) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: customer.count,
      data: customer.rows
    })
  }).catch(err => next(new ApiError(422,`ZCCA-00002: Couldn't find Customer By Asset`, err)))
}