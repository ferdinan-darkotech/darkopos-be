import { srvGetAccessGrantedByCode, srvGetAccessGrantedByKeyCode, srvGetAccessSPKFields } from '../../../services/v2/setting/srvAccessGranted'
import { getSettingByCode } from '../../../services/settingService'
import { ApiError } from '../../../services/v1/errorHandlingService'


export function ctlGetAccessGrantedByCode (req, res, next) {
  console.log('Requesting-ctlGetAccessGrantedByCode: ' + JSON.stringify(req.query) + ' ...')
  return srvGetAccessGrantedByCode(req.query).then(item => {
    res.xstatus(200).json({
      success: true,
      data: item,
      total: item.length
    })
  }).catch(err => next(new ApiError(422,`ACGRTD-001: Couldn't find access`, err)))
}


export function ctlGetAccessGrantedByKeyCode (req, res, next) {
  console.log('Requesting-ctlGetAccessGrantedByKeyCode: ' + JSON.stringify(req.query) + ' ...')
  const { code, key } = req.query
  return srvGetAccessGrantedByKeyCode(code, key).then(item => {
    res.xstatus(200).json({
      success: true,
      data: item
    })
  }).catch(err => next(new ApiError(422,`ACGRTD-001: Couldn't find access`, err)))
}


export async function ctlGetAccessSPKFields (req, res, next) {
  console.log('Requesting-ctlGetAccessSPKFields: ' + JSON.stringify(req.query) + ' ...')
  const settingVal = (((await getSettingByCode('CUSTOME')).dataValues || {}).settingValue || {})

  return srvGetAccessSPKFields(req.query, settingVal.WOFIELDS).then(item => {
    res.xstatus(200).json({
      success: true,
      data: item,
      total: item.length
    })
  }).catch(err => next(new ApiError(422,`ACGRTD-001: Couldn't find access`, err)))
}