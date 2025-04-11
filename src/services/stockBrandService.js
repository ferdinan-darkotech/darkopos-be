import db from '../models'
import dbv from '../models/view'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import moment from 'moment'

let StockBrand = db.tbl_stock_brand
let vwStockBrand = dbv.vw_stock_brand

export function getBrandByCode (brandCode) {
  return StockBrand.findOne({
    where: {
      brandCode: brandCode
    },
    raw: false
  })
}

export function getBrandsData (query) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key] = { between: query[key] }
    }
  }
  if (query.brandName) {
    if (query.hasOwnProperty('id')) {
      let str = JSON.stringify(query)
      str = str.replace(/id/g, 'brandCode')
      query = JSON.parse(str)
    }
    return StockBrand.findAll({
      attributes: ['id', 'brandCode', 'brandName', 'brandImage',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      where: {
        $or: [
          {
            brandCode: {
              $iRegexp: query.brandName,
            }
          },
          {
            brandName: {
              $iRegexp: query.brandName,
            }
          }
        ]
      }
    })
  } else {
    return StockBrand.findAll({
      attributes: ['id', 'brandCode', 'brandName', 'brandImage',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ]
    })
  }
}

export function setBrandInfo (request) {
  const getBrandInfo = {
    brandCode: request.brandCode,
    brandName: request.brandName,
    brandImage: request.brandImage
  }

  return getBrandInfo
}

export function brandExists (brandCode) {
  return getBrandByCode(brandCode).then(brand => {
    if (brand == null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createBrand (brandcode, brand, createdBy, next) {
  return StockBrand.create({
    brandCode: brandcode,
    brandName: brand.brandName,
    brandImage: brand.brandImage,
    createdBy: createdBy,
    createdAt: moment()
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateBrand (brandcode, brand, updateBy, next) {
  return StockBrand.update({
    brandName: brand.brandName,
    brandImage: brand.brandImage,
    updatedBy: updateBy,
    updatedAt: moment()
  },
    { where: { brandCode: brandcode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteBrand (brandcode, next) {
  return StockBrand.destroy({
    where: {
      brandCode: brandcode
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteBrands (brands, next) {
  if (!isEmpty(brands)) {
    return StockBrand.destroy({
      where: brands
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}