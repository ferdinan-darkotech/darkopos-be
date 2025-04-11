import { extractTokenProfile } from '../../../../services/v1/securityService'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetCOA, srvUpdateCOA, srvCreateCOA, srvGetOneCOAByCode } from '../../../../services/v2/master/finance/srvCOA'
import { getMiscByCodeName } from '../../../../services/v1/miscService'

export function ctlGetCOA (req, res, next) {
  console.log('Requesting-ctlGetCOA: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  return srvGetCOA(req.query).then(coa => {
    res.xstatus(200).json({
      success: true,
      data: coa,
    })
  }).catch(err => next(new ApiError(422, `ZSCOA-00001: Couldn't find accounts`, err)))
}

export function ctlCreatedCOA (req, res, next) {
  const userLogIn = extractTokenProfile(req)
  console.log('Requesting-ctlCreatedCOA: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  return srvGetOneCOAByCode(req.body.coaparentcode || 'b846ee0acd151ade51b925bfa191e4ad').then(parent => {
    if(req.body.coaparentcode === req.body.coacode) {
      throw new Error('Branch and sub-branch couldn\'t be same')
    }
    return getMiscByCodeName('COATYPE', req.body.coatype).then(type => {
      const newData = {
        ...req.body,
        coatype: type.id,
        coaparent: (parent || {}).id
      }
      return srvCreateCOA(newData, userLogIn.userid).then(coa => {
        res.xstatus(200).json({
          success: true,
          message: 'Account has been created'
        })
      }).catch(err => next(new ApiError(422, `ZSCOA-00003: Couldn't create accounts`, err)))
    }).catch(err => next(new ApiError(422, `ZSCOA-00002: Couldn't create accounts`, err)))
  }).catch(err => next(new ApiError(422, `ZSCOA-00001: Couldn't create accounts`, err)))
}

export function ctlUpdateCOA (req, res, next) {
  const userLogIn = extractTokenProfile(req)
  console.log('Requesting-ctlUpdateCOA: ' + JSON.stringify(req.params) + '...' + JSON.stringify(req.url))
  return srvGetOneCOAByCode(req.body.coaparentcode || 'b846ee0acd151ade51b925bfa191e4ad').then(parent => {
    if(req.body.coaparentcode === req.params.coacode) {
      throw new Error('Branch and sub-branch couldn\'t be same')
    }
    return getMiscByCodeName('COATYPE', req.body.coatype).then(type => {
      const newData = {
        ...req.body,
        coatype: type.id,
        coaparent: (parent || {}).id
      }
      return srvUpdateCOA(newData, req.params.coacode, userLogIn.userid).then(coa => {
        res.xstatus(200).json({
          success: true,
          message: 'Account has been updated'
        })
      }).catch(err => next(new ApiError(422, `ZSCOA-00003: Couldn't update accounts`, err)))
    }).catch(err => next(new ApiError(422, `ZSCOA-00002: Couldn't update accounts`, err)))
  }).catch(err => next(new ApiError(422, `ZSCOA-00001: Couldn't update accounts`, err)))
}
