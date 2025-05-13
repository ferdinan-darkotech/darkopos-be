import { Op } from 'sequelize'
import db from '../models/tableR'
import { ApiError} from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'

let City = db.tbl_city

export function getCityByCode (cityCode) {
  return City.findOne({
    where: {
      cityCode: cityCode
    },
    raw: false
  })
}

export function getCityById (cityId) {
  return City.findOne({
    where: {
      id: cityId
    },
    raw: false
  })
}

export function getCitiesData (query) {
  for (let key in query) {
    if (key === 'createdAt') {
      query[key]={between: query[key]}
    }
  }
  if (query.userName) {
    console.log('query.userName', query.userName)
    return City.findAll({
      attributes: ['id', 'cityCode', 'cityName',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ],
      where: {
        cityName: {
          [Op.iRegexp]: query.userName
        }
      }
    })
  } else {
    return City.findAll({
      attributes: ['id', 'cityCode', 'cityName',
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt'
      ]
    })
  }
}

export function setCityInfo (request) {
  const getCityInfo = {
    cityCode: request.cityCode,
    cityName: request.cityName
  }

  return getCityInfo
}

export function cityExists (cityCode) {
  return getCityByCode(cityCode).then(city => {
    if ( city == null ) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function createCity (citycode, city, createdBy, next) {
  return City.create({
    cityCode: citycode,
    cityName: city.cityName,
    createdBy: createdBy,
    updatedBy: '---'
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(400, other, err))
  })
}

export function updateCity (citycode, city, updateBy, next) {
  return City.update({
      cityName: city.cityName,
      updatedBy: updateBy
    },
    { where: { cityCode: citycode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function deleteCity (citycode, next) {
  return City.destroy({
    where: {
      cityCode: citycode
    }
  }).catch(err => (next(new ApiError(501, err, err))))
}

export function deleteCities (cities, next) {
  if (!isEmpty(cities)) {
    return City.destroy({
      where: cities
    }).catch(err => (next(new ApiError(501, err, err))))
  } else {
    return null
  }
}
