import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetCities, srvGetCityById, srvGetCityByCode, srvCityExist,
  srvCreateCity, srvUpdateCity, srvDeleteCity }
  from '../../../../services/v2/master/general/srvCity'
import { extractTokenProfile } from '../../../../services/v1/securityService'

// Get Cities
const getCities = function (req, res, next, filter = false, comment = 'getCities') {
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

  srvGetCities(req.query, filter).then((city) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: city.count,
      data: city.rows
    })
  }).catch(err => next(new ApiError(422, `ZCMC-00001: Couldn't find Cities`, err)))
}

// Get General Cities
exports.getCitiesGeneral = function (req, res, next) {
  getCities(req, res, next, false, 'getCitiesGeneral')
}

// Get Filtered Cities
exports.getCitiesFilter = function (req, res, next) {
  getCities(req, res, next, true, 'getCitiesFilter')
}

// Get A City By Code
exports.getCityByCode = function (req, res, next) {
  console.log('Requesting-getCityByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetCityByCode(code, req.query).then((city) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: city
    })
  }).catch(err => next(new ApiError(422,`ZCMC-00002: Couldn't find City`, err)))
}

// Create a new City
exports.insertCity = function (req, res, next) {
  console.log('Requesting-insertCitys: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  return srvCreateCity(data, userLogIn.userid, next).then((created) => {
    console.log(created)
    return srvGetCityById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `City ${result.cityCode} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCMC-00003: Couldn't create City ${data.cityName} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCMC-00004: Couldn't find City ${data.cityName}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCMC-00005: Couldn't create City ${data.cityName}.`, err)))
}

//Update a City
exports.updateCity = function (req, res, next) {
  console.log('Requesting-updateCity: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)
  srvCityExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateCity(data, userLogIn.userid, next).then((updated) => {
        return srvGetCityByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `City ${result.cityCode} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCMC-00007: Couldn't update City ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCMC-00008: Couldn't update City ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCMC-00009: Couldn't find City ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCMC-00010: Couldn't find City ${data.code} .`, err)))
}

// //Delete a City
exports.deleteCity = function (req, res, next) {
  console.log('Requesting-deleteCity: ' + req.url + ' ...')
  const cityCode  = req.params.code
  srvCityExist(cityCode).then(exists => {
    if (exists) {
      srvDeleteCity(cityCode, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `City ${cityCode} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCMC-00011: Couldn't delete City ${cityCode}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCMC-00012: Couldn't delete City ${cityCode}.`, err)))
    } else {
      next(new ApiError(422, `ZCMC-00013: City ${cityCode} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCMC-00014: City ${cityCode} not exists.`, err)))
}
