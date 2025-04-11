/**
 * Created by p  a n d a .has .my .id on 2018-04-24.
 */
import project from '../../../config/project.config'
import { ApiError} from '../../services/v1/errorHandlingService'
import { srvCarBrands, srvCarModels, srvCarTypes,
  srvCarBrand, srvCarModel, srvCarType }
  from '../../services/master/assetSpesification'

// Retrieve list brands
exports.getCarBrands = function (req, res, next) {
  console.log('Requesting-getCarBrands: ' + req.url + ' ...')
  const citycode = req.params.id
  srvCarBrands(req.query).then((brands) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: brands
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Car Brands.`, err)))
}
// Retrieve a brand
exports.getCarBrand = function (req, res, next) {
  console.log('Requesting-getCarBrand: ' + req.url + ' ...')
  const brandId = req.params.id
  srvCarBrand(brandId, req.query).then((brand) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: brand
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Car Brand Id ${brandId}.`, err)))
}

exports.getCarModels = function (req, res, next) {
  console.log('Requesting-getCarModels: ' + req.url + ' ...')
  const brandId = req.params.id
  srvCarModels(brandId,req.query).then((models) => {
    console.log(models)
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: models
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Car Models for Brand Id ${brandId}.`, err)))
}
// Retrieve a model
exports.getCarModel = function (req, res, next) {
  console.log('Requesting-getCarModel: ' + req.url + ' ...')
  const modelId = req.params.id
  srvCarModel(modelId, req.query).then((model) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: model
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Car Model Id ${modelId}.`, err)))
}

exports.getCarTypes = function (req, res, next) {
  console.log('Requesting-getCarTypes: ' + req.url + ' ...')
  const modelId = req.params.id
  srvCarTypes(modelId,req.query).then((types) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: types
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Car Types for Model Id ${modelId}.`, err)))
}
// Retrieve a type
exports.getCarType = function (req, res, next) {
  console.log('Requesting-getCarType: ' + req.url + ' ...')
  const typeId = req.params.id
  srvCarType(typeId, req.query).then((type) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: type
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Car Type Id ${typeId}.`, err)))
}