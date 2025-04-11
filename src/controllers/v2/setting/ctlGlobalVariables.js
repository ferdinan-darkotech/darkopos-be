import {
  setVariables, getListKeys, getVariables, dropVariables
} from '../../../utils/globalVariables'
import { ApiError } from '../../../services/v1/errorHandlingService'

export function ctlGetAllKeyVariables (req, res, next) {
  console.log('Requesting-ctlGetAllKeyVariables: ' + JSON.stringify(req.query) + ' ...')
  try {
    let listKeys = getListKeys()
    res.xstatus(200).json({
      success: true,
      data: listKeys,
      total: listKeys.length
    })
  } catch (er) {
    return next(new ApiError(422, `ZGV-001: Couldn't find list variables.`, err))
  }
}

export function ctlGetConfigVariables (req, res, next) {
  console.log('Requesting-ctlGetConfigVariables: ' + JSON.stringify(req.query) + ' ...')
  try {
    let configs = getVariables(req.body.vKey)
    res.xstatus(200).json({
      success: true,
      data: configs
    })
  } catch (er) {
    return next(new ApiError(422, `ZGV-002: Couldn't find config variables.`, err))
  }
}

export function ctlSetConfigVariables (req, res, next) {
  console.log('Requesting-ctlGetConfigVariables: ' + JSON.stringify(req.query) + ' ...')
  try {
    setVariables(req.body.vKey, req.body.vValue)
    res.xstatus(200).json({
      success: true,
      data: 'Config variable has been modify.'
    })
  } catch (er) {
    return next(new ApiError(422, `ZGV-003: Couldn't set config variables.`, err))
  }
}

export function ctlDropConfigVariables (req, res, next) {
  console.log('Requesting-ctlGetConfigVariables: ' + JSON.stringify(req.query) + ' ...')
  try {
    dropVariables(req.body.vKey)
    res.xstatus(200).json({
      success: true,
      data: 'Config variable has been removed.'
    })
  } catch (er) {
    return next(new ApiError(422, `ZGV-004: Couldn't remove config variables.`, err))
  }
}