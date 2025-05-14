import { Op } from 'sequelize'
import db from '../models'
import { ApiError } from '../services/v1/errorHandlingService'
import { isEmpty } from '../utils/check'
import mapFields from '../utils/mapping/mapFields'

const Setting = db.tbl_setting

const settingField = ['id', 'settingCode', 'settingValue', 'createdBy', 'updatedBy']

export function getSettingByCodeV2 (key) {
  return Setting.findOne({
    where: {
      settingCode: key
    },
    raw: true
  })
}

export function getSettingByCode (key) {
  return Setting.findOne({
    where: {
      settingCode: key
    },
    raw: false
  })
}

export function getSettingData (query) {
  for (let key in query) {
    if (key === 'updatedAt') {
      query[key] = { [Op.between]: query[key] }
    }
  }
  if (query) {
    return Setting.findAll({
      attributes: settingField,
      where: query,
      raw: true
    }).then(result => mapFields(result, settingField))
  } else {
    return Setting.findAll({
      attributes: settingField,
      raw: true
    }).then(result => mapFields(result, settingField))
  }
}

export function setSettingInfo (request) {
  const getSettingInfo = {
    id: request.id,
    settingCode: request.settingCode,
    settingValue: request.settingValue,
    createdBy: request.createdBy,
    updatedBy: request.updatedBy
  }

  return getSettingInfo
}

export function settingExists (settingCode) {
  return getSettingByCode(settingCode).then(setting => {
    if (setting === null) {
      return false;
    }
    else {
      return true;
    }
  })
}

export function insertSetting (settingCode, setting, updatedBy, next) {
  return Setting.create({
    settingCode: settingCode,
    settingValue: setting.settingValue,
    updatedBy: updatedBy
  }).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}

export function updateSetting (settingCode, setting, updatedBy, next) {
  return Setting.upsert({
    settingCode: settingCode,
    settingValue: setting.settingValue,
    updatedBy: updatedBy
  },
    { where: { settingCode: settingCode } }
  ).catch(err => {
    const errObj = JSON.parse(JSON.stringify(err))
    const { parent, original, sql, ...other } = errObj
    next(new ApiError(501, other, err))
  })
}