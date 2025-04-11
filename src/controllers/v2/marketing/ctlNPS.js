import * as svNPS from '../../../services/v2/marketing/srvNPS'
import * as svMonitNSP from '../../../services/v2/other/Dynamic-Form/controls/srvDynamicFormMonit'
import * as svStore from '../../../services/v2/master/store/srvStore'
import { ApiError } from '../../../services/v1/errorHandlingService'

export function ctlGetAllActiveNPSFormByGroup (req, res, next) {
  console.log('Requesting-ctlGetAllActiveNPSFormByGroup: ' + JSON.stringify(req.query) + '...' + JSON.stringify(req.url))
  return svNPS.srvGetAllActiveNPSFormByGroup(req.params.group).then(nps => {
    res.xstatus(200).json({
      success: true,
      data: nps,
      total: nps.length
    })
  }).catch(err => next(new ApiError(422, `ZNPS-001: Couldn't find data NPS.`, err)))
}

export function ctlGetActiveRatingNPS (req, res, next) {
  console.log('Requesting-ctlGetAllActiveNPSFormByGroup: ' + JSON.stringify(req.query) + '...' + JSON.stringify(req.url))
  const userLogIn = req.$userAuth

  return svStore.srvGetStoreCode(userLogIn.store).then(st => {
    if(!st) throw new Error('Store is not defined.')
    return svMonitNSP.getPendingNPSRatingLinks(st.store_code).then(nps => {
      res.xstatus(200).json({
        success: true,
        data: nps,
        total: nps.length
      })
    }).catch(err => next(new ApiError(422, `ZNPS-003: Couldn't find data NPS.`, err)))
  }).catch(err => next(new ApiError(422, `ZNPS-002: Couldn't find data NPS.`, err)))
}

