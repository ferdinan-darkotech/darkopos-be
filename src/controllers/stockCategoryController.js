/**
 * Created by panda .has .my .id on 4/17/27.
 */
import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import {
  setStockCategoryInfo, getStockCategoryByCode, stockCategoryExists,
  getStockCategoriesData, checkParent, getStockCategoriesParent, createStockCategory, updateStockCategory, deleteStockCategory, deleteStockCategories,
  srvCategoryProducts
} from '../services/stockCategoryService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrieve list a brand
exports.getCategory = function (req, res, next) {
  console.log('Requesting-getCategory: ' + req.url + ' ...')
  const categorycode = req.params.id
  getStockCategoryByCode(categorycode).then((category) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: category
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Stock Category ${categorycode}.`, err)))
}

// Retrieve list of brands
exports.getCategories = function (req, res, next) {
  console.log('Requesting-getCategories: ' + req.url + ' ...')
  let { pageSize, page, id, type, ...other } = req.query
  if (type === 'lov') {
    // checkParent(id).then((checked) => {
    //   if (checked.length === 0) {
    //     return getStockCategoriesParent(id).then((categories) => {
    //       res.xstatus(200).json({
    //         success: true,
    //         message: 'Ok',
    //         total: categories.length,
    //         data: categories
    //       })
    //     }).catch(err => next(new ApiError(422, `Couldn't find Categories.`, err)))
    //   } else {
    //     return getStockCategoriesParent(id).then((categories) => {
    //       res.xstatus(200).json({
    //         success: true,
    //         message: 'Ok',
    //         total: [],
    //         data: []
    //       })
    //     }).catch(err => next(new ApiError(422, `Couldn't find Categories.`, err)))
    //   }
    // }).catch(err => next(new ApiError(422, `Couldn't find Categories.`, err)))
    return getStockCategoriesParent(id).then((categories) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: categories.length,
        data: categories
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Categories.`, err)))
  } else {
    getStockCategoriesData(other).then((categories) => {
      res.xstatus(200).json({
        success: true,
        message: 'Ok',
        total: categories.length,
        data: categories
      })
    }).catch(err => next(new ApiError(422, `Couldn't find Categories.`, err)))
  }
}

// Create a new brand
exports.insertCategory = function (req, res, next) {
  console.log('Requesting-insertCategory: ' + req.url + ' ...')
  const categorycode = req.params.id
  const category = req.body
  const userLogIn = extractTokenProfile(req)
  stockCategoryExists(categorycode).then(exists => {
    if (exists) {
      next(new ApiError(409, `Category ${categorycode} already exists.`))
    } else {
      createStockCategory(categorycode, category, userLogIn.userid, next).then((categoryCreated) => {
        return getStockCategoryByCode(categoryCreated.categoryCode).then((categoryByCode) => {
          const categoryInfo = setStockCategoryInfo(categoryByCode)
          let jsonObj = {
            success: true,
            message: `Category ${categoryInfo.categoryCode} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { brand: categoryInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find Stock Category ${categorycode}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create Stock Category ${categorycode}.`, err)))
    }
  })
}

//Update a Category
exports.updateCategory = function (req, res, next) {
  console.log('Requesting-updateCategory: ' + req.url + ' ...')
  const categorycode = req.params.id
  let category = req.body
  const userLogIn = extractTokenProfile(req)
  stockCategoryExists(categorycode).then(exists => {
    if (exists) {
      return updateStockCategory(categorycode, category, userLogIn.userid, next).then((categoryUpdated) => {
        return getStockCategoryByCode(categorycode).then((categoryByCode) => {
          const categoryInfo = setStockCategoryInfo(categoryByCode)
          let jsonObj = {
            success: true,
            message: `User ${categoryByCode.categoryCode} - ${categoryByCode.categoryName}  updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { category: categoryInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Category ${categorycode}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update brand ${categorycode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find Category ${categorycode}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Category ${categorycode}.`, err)))
}

//Delete a Category
exports.deleteCategory = function (req, res, next) {
  console.log('Requesting-deleteCategory: ' + req.url + ' ...')
  const categorycode = req.params.id
  stockCategoryExists(categorycode).then(exists => {
    if (exists) {
      return deleteStockCategory(categorycode).then((categoryDeleted) => {
        if (categoryDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `Category ${categorycode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { category: categoryDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `Couldn't delete Category ${categorycode}.`))
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete Category ${categorycode}}.`, err)))
    } else {
      next(new ApiError(422, `Category ${categorycode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `Category ${categorycode} not exists.`, err)))
}

//Delete some Category
exports.deleteCategories = function (req, res, next) {
  console.log('Requesting-deleteCategorys: ' + req.url + ' ...')
  let categories = req.body;
  deleteStockCategories(categories).then((categoryDeleted) => {
    if (categoryDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Categories [ ${categories.categoryCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { categories: categoryDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next(new ApiError(422, `Couldn't delete Categories [ ${categories.categoryCode} ].`))
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Categories [ ${categories.categoryCode} ].`, err)))
}
exports.getCategoryProducts = function (req, res, next) {
  console.log('Requesting-getCategory: ' + req.url + ' ...')
  const categorycode = req.params.id
  srvCategoryProducts(categorycode).then((category) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      total: category[0].length,
      data: category[0]
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Stock Category ${categorycode}.`, err)))
}