import project from '../../config/project.config'
import { ApiError} from '../services/v1/errorHandlingService'
import { setCityInfo, getCityByCode, getCityById, cityExists,
  getCitiesData, createCity, updateCity, deleteCity, deleteCities }
  from '../services/cityService'
import { extractTokenProfile } from '../services/v1/securityService'

// Retrieve list a city
exports.getCity = function (req, res, next) {
  console.log('Requesting-getCity: ' + req.url + ' ...')
  const citycode = req.params.id
  getCityByCode(citycode).then((city) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: city
    })
  }).catch(err => next(new ApiError(422, `Couldn't find City ${citycode}.`, err)))
}

// Retrieve list a city by id
exports.getCityId = function (req, res, next) {
  console.log('Requesting-getCity: ' + req.url + ' ...')
  const cityid = req.params.id
  getCityById(cityid).then((city) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: city
    })
  }).catch(err => next(new ApiError(422, `Couldn't find City ${cityid}.`, err)))
}

// Retrieve list of cities
exports.getCities = function (req, res, next) {
  console.log('Requesting-getCities: ' + req.url + ' ...')
  let { pageSize, page, ...other } = req.query
  getCitiesData(other).then((cities) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: JSON.parse(JSON.stringify(cities)),
      total: cities.length
    })
  }).catch(err => next(new ApiError(422, `Couldn't find Cities.`, err)))
}

// Create a new city
exports.insertCity = function (req, res, next) {
  console.log('Requesting-insertCity: ' + req.url + ' ...')
  const citycode = req.params.id
  const city = req.body
  const userLogIn=extractTokenProfile(req)
  cityExists(citycode).then(exists => {
    if (exists) {
      next(new ApiError(409, `City ${citycode} already exists.`))
    } else {
      createCity(citycode, city, userLogIn.userid, next).then((cityCreated) => {
        getCityByCode(cityCreated.cityCode).then((cityGetByCodeName) => {
          const cityInfo = setCityInfo(cityGetByCodeName)
          let jsonObj = {
            success: true,
            message: `City ${cityInfo.cityCode} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { city: cityInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, err + `Couldn't find city ${citycode}.`, err)))
      }).catch(err => next(new ApiError(501, `Couldn't create city ${citycode}.`, err)))
    }
  })
}

//Update a City
exports.updateCity = function (req, res, next) {
  console.log('Requesting-updateCity: ' + req.url + ' ...')
  const citycode = req.params.id
  let city = req.body
  const userLogIn=extractTokenProfile(req)
  cityExists(citycode).then(exists => {
    if (exists) {
      return updateCity(citycode, city, userLogIn.userid, next).then((cityUpdated) => {
        return getCityByCode(citycode).then((cityGetByCode) => {
          const cityInfo = setCityInfo(cityGetByCode)
          let jsonObj = {
            success: true,
            message: `User ${cityGetByCode.cityCode} - ${cityGetByCode.cityName}  updated`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { city: cityInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update City ${citycode}.`, err)))
      }).catch(err => next(new ApiError(500, `Couldn't update city ${citycode}.`, err)))
    } else {
      next(new ApiError(422, `Couldn't find City ${citycode}.`))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find City ${citycode}.`, err)))
}

//Delete a City
exports.deleteCity = function (req, res, next) {
  console.log('Requesting-deleteCity: ' + req.url + ' ...')
  const citycode = req.params.id
  cityExists(citycode).then(exists => {
    if (exists) {
      return deleteCity(citycode, next).then((cityDeleted) => {
        if (cityDeleted === 1) {
          let jsonObj = {
            success: true,
            message: `City ${citycode} deleted`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { cities: cityDeleted }) }
          res.xstatus(200).json(jsonObj)
        } else {
          next( new ApiError(422, `Couldn't delete City ${citycode}.`) )
        }
      }).catch(err => next(new ApiError(500, `Couldn't delete City ${citycode}.`, err)))
    } else {
      next( new ApiError(422, `City ${citycode} not exists.`) )
    }
  }).catch(err => next(new ApiError(422, `City ${citycode} not exists.`, err)))
}

//Delete some City
exports.deleteCities = function (req, res, next) {
  console.log('Requesting-deleteCities: ' + req.url + ' ...')
  let cities = req.body;
  deleteCities(cities, next).then((cityDeleted) => {
    if (cityDeleted >= 1) {
      let jsonObj = {
        success: true,
        message: `Cities [ ${cities.cityCode} ] deleted`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { cities: cityDeleted }) }
      res.xstatus(200).json(jsonObj)
    } else {
      next( new ApiError(422, `Couldn't delete Cities [ ${cities.cityCode} ].`) )
    }
  }).catch(err => next(new ApiError(501, `Couldn't delete Cities [ ${cities.cityCode} ].`, err)))
}
