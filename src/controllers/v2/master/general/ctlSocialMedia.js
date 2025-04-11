import { ApiError } from '../../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../../services/v1/securityService'
import { srvGetSocialMedia, srvGetSocialMediaById, srvGetSocialMediaByCode, srvSocialMediaExist,
  srvCreateSocialMedia, srvUpdateSocialMedia, srvDeleteSocialMedia } from '../../../../services/v2/master/general/srvSocialMedia'

// Get Social Media
const getSocialMedia = function (req, res, next, filter = false, comment = 'getSocialMedia') {
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

  srvGetSocialMedia(req.query, filter).then((socmed) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      ...pagination,
      total: socmed.count,
      data: socmed.rows
    })
  }).catch(err => next(new ApiError(422, `ZCSM-00001: Couldn't find Social Media`, err)))
}

// Get General Social Media
exports.getSocialMediaGeneral = function (req, res, next) {
  getSocialMedia(req, res, next, false, 'getSocialMediaGeneral')
}

// Get Filtered Social Media
exports.getSocialMediaFilter = function (req, res, next) {
  getSocialMedia(req, res, next, true, 'getSocialMediaFilter')
}

// Get A Social Media By Code
exports.getSocialMediaByCode = function (req, res, next) {
  console.log('Requesting-getSocialMediaByCode: ' + JSON.stringify(req.params) + ' ...')
  let { code } = req.params
  srvGetSocialMediaByCode(code, req.query).then((socmed) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: socmed
    })
  }).catch(err => next(new ApiError(422,`ZCSM-00002: Couldn't find a Social Media`, err)))
}

// Create a new Social Media
exports.insertSocialMedia = function (req, res, next) {
  console.log('Requesting-insertSocialMedia: ' + req.url + ' ...')
  let data = req.body
  const userLogIn = extractTokenProfile(req)

  srvCreateSocialMedia(data, userLogIn.userid, next).then((created) => {
    return srvGetSocialMediaById(created.id).then((result) => {
      if (result) {
        let jsonObj = {
          success: true,
          message: `Social Media ${result.code} created`,
          data: result
        }
        res.xstatus(200).json(jsonObj)
      } else {
        next(new ApiError(422, `ZCSM-00003: Couldn't create Social Media ${data.name} .`))
      }
    }).catch(err => next(new ApiError(422, `ZCSM-00004: Couldn't find Social Media ${data.ame}.`, err)))
  }).catch(err => next(new ApiError(422, `ZCSM-00005: Couldn't create Social Media ${data.ame}.`, err)))
}

//Update a Social Media
exports.updateSocialMedia = function (req, res, next) {
  console.log('Requesting-updateSocialMedia: ' + req.url + ' ...')
  let data = req.body
  data.code = req.params.code
  const userLogIn = extractTokenProfile(req)

  srvSocialMediaExist(data.code).then(exists => {
    if (exists) {
      return srvUpdateSocialMedia(data, userLogIn.userid, next).then((updated) => {
        return srvGetSocialMediaByCode(data.code).then((result) => {
          let jsonObj = {
            success: true,
            message: `Social Media ${result.code} updated`,
            data: result
          }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(422, `ZCSM-00007: Couldn't update Social Media ${data.code}.`, err)))
      }).catch(err => next(new ApiError(422, `ZCSM-00008: Couldn't update Social Media ${data.code}.`, err)))
    } else {
      next(new ApiError(422, `ZCSM-00009: Couldn't find Social Media ${data.code} .`))
    }
  }).catch(err => next(new ApiError(422, `ZCSM-00010: Couldn't find Social Media ${data.code} .`, err)))
}

// //Delete a Social Media
exports.deleteSocialMedia = function (req, res, next) {
  console.log('Requesting-deleteSocialMedia: ' + req.url + ' ...')
  const code  = req.params.code
  srvSocialMediaExist(code).then(exists => {
    if (exists) {
      srvDeleteSocialMedia(code, next).then((deleted) => {
        if (deleted === 1) {
          let jsonObj = {
            success: true,
            message: `Social Media ${code} deleted`,
            data: deleted
          }
          res.xstatus(200).json(jsonObj)
        } else {
          next(new ApiError(422, `ZCSM-00011: Couldn't delete Social Media ${code}.`))
        }
      }).catch(err => next(new ApiError(500, `ZCSM-00012: Couldn't delete Social Media ${code}.`, err)))
    } else {
      next(new ApiError(422, `ZCSM-00013: Social Media ${code} not exists.`))
    }
  }).catch(err => next(new ApiError(422, `ZCSM-00014: Social Media ${code} not exists.`, err)))
}
