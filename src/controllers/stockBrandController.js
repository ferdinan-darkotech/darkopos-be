/**
 * Created by panda .has .my .id on 4/17/27.
 */
import project from '../../config/project.config'
import { ApiError} from '../services/v1/errorHandlingService'
import { setBrandInfo, getBrandByCode, brandExists,
  getBrandsData, createBrand, updateBrand, deleteBrand, deleteBrands }
  from '../services/stockBrandService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrieve list a brand
exports.getBrand = function (req, res, next) {
  console.log('Requesting-getBrand: ' + req.url + ' ...')
  const brandcode = req.params.id
  getBrandByCode(brandcode).then((brand) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: brand
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Brand ${brandcode}.`, err)))
}

// Retrieve list of brands
exports.getBrands = function (req, res, next) {
  console.log('Requesting-getBrands: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getBrandsData(other).then((brands) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(brands)),
      total: brands.length
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Brands.`, err)))
}

// Create a new brand
exports.insertBrand = function (req, res, next) {
  console.log('Requesting-insertBrand: ' + req.url + ' ...')
  const brandcode = req.params.id
  const brand = req.body
  const userLogIn=extractTokenProfile(req)
  brandExists(brandcode).then(exists => {
    if (exists) {
      next(new ApiError(409, `Brand ${brandcode} already exists.`))
    } else {
      createBrand(brandcode, brand, userLogIn.userid, next).then((brandCreated) => {
        getBrandByCode(brandCreated.brandCode).then((brandGetByCodeName) => {
          const brandInfo = setBrandInfo(brandGetByCodeName)
          let jsonObj = {
            success: true,
            message: `Brand ${brandInfo.brandCode} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { brand: brandInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find brand ${brandcode}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create brand ${brandcode}.`, err)))
    }
  })
}

//Update a Brand
exports.updateBrand = function (req, res, next) {
  console.log('Requesting-updateBrand: ' + req.url + ' ...')
  const brandcode = req.params.id
  let brand = req.body
  const userLogIn=extractTokenProfile(req)
  brandExists(brandcode).then(exists => {
    if (exists) {
      return updateBrand(brandcode, brand, userLogIn.userid, next).then((brandUpdated) => {
        return getBrandByCode(brandcode).then((brandGetByCode) => {
          const brandInfo = setBrandInfo(brandGetByCode)
          let jsonObj = {
            success: true,
            message: `User ${brandGetByCode.brandCode} - ${brandGetByCode.brandName}  updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { brand: brandInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Brand ${brandcode}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update brand ${brandcode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Brand ${brandcode}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Brand ${brandcode}.`, err)))
}

//Delete a Brand
exports.deleteBrand = function (req, res, next) {
  console.log('Requesting-deleteBrand: ' + req.url + ' ...')
  const brandcode = req.params.id
  brandExists(brandcode).then(exists => {
    if (exists) {
      return deleteBrand(brandcode, next).then((brandDeleted) => {
        if (brandDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Brand ${brandcode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { brands: brandDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next( new ApiError(422, `Couldn't delete Brand ${brandcode}.`) )
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Brand ${brandcode}}.`, err)))
    } else {
      next( new ApiError(422, `Brand ${brandcode} not exists.`) )
    }
  }).catch(err => next(new ApiError(422, `Brand ${brandcode} not exists.`, err)))
}

//Delete some Brand
exports.deleteBrands = function (req, res, next) {
  console.log('Requesting-deleteBrands: ' + req.url + ' ...')
  let brands = req.body;
  deleteBrands(brands, next).then((brandDeleted) => {
    if (brandDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Brands [ ${brands.brandCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { brands: brandDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next( new ApiError(422, `Couldn't delete Brands [ ${brands.brandCode} ].`) )
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Brands [ ${brands.brandCode} ].`, err)))
}
