import project from '../../config/project.config'
import { ApiError } from '../services/v1/errorHandlingService'
import { extractTokenProfile } from '../services/v1/securityService'
import {
  getSettingByCode, getSettingData, setSettingInfo,
  settingExists, updateSetting, insertSetting
}
  from '../services/settingService'

exports.getSetting = function (req, res, next) {
  console.log('Requesting-getSetting: ' + req.url + ' ...')
  const settingname = req.params.id
  getSettingByCode(settingname).then((setting) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: setting
    })
  }).catch(err => next(new ApiError(422, err + ` - Couldn't find Setting ${settingname}.`, err)))
}

exports.getSettings = function (req, res, next) {
  console.log('request-settings:' + req.url)
  let { pageSize, page, ...other } = req.query
  return getSettingData(other).then((settings) => {
    res.xstatus(200).json({
      success: true,
      message: 'Ok',
      data: settings,
      total: settings.length
    })
  }).catch(err => next(new ApiError(501, err + ` - Couldn't find Setting.`, err)))
}

exports.insertSetting = function (req, res, next) {
  console.log('Requesting-insertSetting: ' + req.url + ' ...')
  const settingcode = req.params.id
  let setting = req.body
  const userLogIn = extractTokenProfile(req)
  settingExists(settingcode).then(exists => {
    if (exists) {
      next(new ApiError(422, `${settingcode} already exists.`))
    } else {
      return insertSetting(settingcode, setting, userLogIn.userid, next).then((settingUpdated) => {
        return getSettingByCode(settingcode).then((settingByCode) => {
          const settingInfo = setSettingInfo(settingByCode)
          let jsonObj = {
            success: true,
            message: `Setting ${settingByCode.settingCode} created`,
          }
          if (project.message_detail === 'ON') { Object.assign(jsonObj, { setting: settingInfo }) }
          res.xstatus(200).json(jsonObj)
        }).catch(err => next(new ApiError(501, `Couldn't update Setting ${settingcode}.`, err)))
      }).catch(err => next(new ApiError(422, `Couldn't find Setting ${settingcode}.`, err)))
    }
  }).catch(err => next(new ApiError(422, `Couldn't find Setting ${setting.settingCode} .`, err)))
}

exports.updateSetting = function (req, res, next) {
  console.log('Requesting-updateSetting: ' + req.url + ' ...')
  const settingcode = req.params.id
  let setting = req.body
  const userLogIn = extractTokenProfile(req)
  return updateSetting(settingcode, setting, userLogIn.userid, next).then(() => {
    return getSettingByCode(settingcode).then((settingByCode) => {
      const settingInfo = setSettingInfo(settingByCode)
      let jsonObj = {
        success: true,
        message: `Setting ${settingByCode.settingCode} updated`,
      }
      if (project.message_detail === 'ON') { Object.assign(jsonObj, { setting: settingInfo }) }
      res.xstatus(200).json(jsonObj)
    }).catch(err => next(new ApiError(501, `Couldn't update Setting ${settingcode}.`, err)))
  }).catch(err => next(new ApiError(422, `Couldn't find Setting ${settingcode}.`, err)))
}