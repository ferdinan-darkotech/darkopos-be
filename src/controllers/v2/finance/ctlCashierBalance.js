import {
  srvCloseCashPeriod, srvCreateCashBalance, srvGetActivePeriod, srvGetEndBalance
} from '../../../services/v2/finance/srvCashierBalance'
import { getMiscByCodeName } from '../../../services/v1/miscService'
import { srvGetStoreByCode } from '../../../services/setting/storeService'
import { extractTokenProfile } from '../../../services/v1/securityService'
import { ApiError } from '../../../services/v1/errorHandlingService'


export function ctlGetActivePeriod (req, res, next) {
  const userLogin = extractTokenProfile(req)
  return getMiscByCodeName('CETRNSKIND', req.params.trans).then(kind => {
    const newQuery = {
      ...req.query,
      transkind: JSON.parse(JSON.stringify(kind || '{}')).id,
      cashier: userLogin.userid
    }
    return srvGetActivePeriod(newQuery).then(prd => {
      res.xstatus(200).json({
        data: (prd || {}),
        success: true,
      })
    }).catch(err => next(new ApiError(422, `ZXPR01: Couldn't find period.`, err)))
  }).catch(err => next(new ApiError(422, `ZXPR01: Couldn't find period.`, err)))
}

export function ctlGetEndBalance (req, res, next) {
  const userLogin = extractTokenProfile(req)
  const newQuery = {
    ...req.query,
    trans: req.params.trans,
    cashier: userLogin.userid
  }
  return srvGetEndBalance(newQuery).then(prd => {
    res.xstatus(200).json({
      data: prd,
      success: true,
    })
  }).catch(err => next(new ApiError(422, `ZXPR02: Couldn't fetch balance.`, err)))
}

export async function ctlCreateCashBalance (req, res, next) {
  const userLogin = extractTokenProfile(req)

  
  return getMiscByCodeName('CETRNSKIND', req.params.trans).then(async kind => {
    const storeData = await srvGetStoreByCode(req.body.store)
    const newData = {
      ...req.body,
      trans: JSON.parse(JSON.stringify(kind || '{}')).id,
      cashier: userLogin.userid,
      store: JSON.parse(JSON.stringify(storeData || {})).id
    }

    if(!newData.trans || !newData.store) {
      throw new Error('Store is not defined.')
    }
    return srvCreateCashBalance(newData, userLogin.userid, next).then(prd => {
      res.xstatus(200).json({
        data: prd,
        message: 'Cash period has been register.',
        success: true,
      })
    }).catch(err => next(new ApiError(422, `ZXPR03: Couldn't create period.`, err)))
  }).catch(err => next(new ApiError(422, `ZXPR04: Couldn't get trans.`, err)))
}

export function ctlCloseCashPeriod (req, res, next) {
  const userLogin = extractTokenProfile(req)
  const newQuery = {
    ...req.body,
    trans: req.params.trans,
    cashier: userLogin.userid
  }
  return srvCloseCashPeriod(newQuery, next).then(prd => {
    const result = JSON.parse(JSON.stringify(prd))
    console.log()
    if(result.success) {
      res.xstatus(200).json({
        message: 'Period has been close.',
        success: true,
      })
    } else {
      throw prd.message
    }
  }).catch(err => next(new ApiError(422, `ZXPR02: Couldn't fetch balance.`, err)))
}