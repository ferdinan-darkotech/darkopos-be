import db from '../models'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import sequelize from '../native/sequelize'
import { getNativeQuery } from '../native/nativeUtils'
import native from '../native/product/sqlStockCategory'
import moment from 'moment'
import { Op } from 'sequelize'

const stringSQL = {
  s00001: native.sqlCategoryProducts
}

let StockCategory = db.tbl_stock_category
let vwStockCategory = dbv.vw_stock_category

export function getStockCategoryByCode (stockCategoryCode) {
  return vwStockCategory.findOne({
    where: {
      categoryCode: stockCategoryCode
    },
    raw: false
  })
}

export function getStockCategoriesData (query) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { between: query[key] }
    }
  }
  if (!isEmpty(query)) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'categoryCode')
      query = JSON.parse(str)
    }
    return vwStockCategory.findAll({
      where: query
    })
  } else {
    return vwStockCategory.findAll()
  }
}
export function getStockCategoriesParent (id) {
  if (id) {
    return vwStockCategory.findAll({
      where: {
        categoryParentId: {
          [Op.ne]: id
        },
        id: {
          [Op.ne]: id
        }
      },
    })
  } else if (!id) {
    return vwStockCategory.findAll()
  }
}
export function checkParent (id) {
  // const data = vwStockCategory.findAll({
  //   where: {
  //     categoryParentId: id,
  //   }
  // })
  // if (data.length > 0) return false
  // return true
  return vwStockCategory.findAll({
    where: {
      categoryParentId: id,
    }
  })
}

export function setStockCategoryInfo (request) {
  const getStockCategoryInfo = {
    id: request.id,
    categoryCode: request.categoryCode,
    categoryName: request.categoryName,
    categoryImage: request.categoryImage,
    categoryParentId: request.categoryParentId
  }

  return getStockCategoryInfo
}

export function stockCategoryExists (stockCategoryCode) {
  return getStockCategoryByCode(stockCategoryCode).then(brand => {
    if (brand == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createStockCategory (categorycode, category, createdBy, next) {
  return StockCategory.create({
    categoryCode: categorycode,
    categoryName: category.categoryName,
    categoryImage: category.categoryImage,
    categoryParentId: category.categoryParentId,
    max_disc: category.max_disc,
    max_disc_nominal: category.max_disc_nominal,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateStockCategory (categorycode, category, updateBy, next) {
  return StockCategory.update({
    categoryName: category.categoryName,
    categoryImage: category.categoryImage,
    categoryParentId: category.categoryParentId ? category.categoryParentId : null,
    max_disc: category.max_disc,
    max_disc_nominal: category.max_disc_nominal,
    updatedBy: updateBy,
    updatedAt: moment()
  },
    { where: { categoryCode: categorycode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteStockCategory (categorycode) {
  return StockCategory.destroy({
    where: {
      categoryCode: categorycode
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteStockCategories (categories) {
  if (!isEmpty(categories)) {
    return StockCategory.destroy({
      where: categories
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}

export function srvCategoryProducts (categoryCode) {
  const sSQL = stringSQL.s00001.replace("_BIND01", categoryCode)
  return getNativeQuery(sSQL, false, 'RAW')
}