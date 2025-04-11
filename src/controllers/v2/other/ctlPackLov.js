import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvLovCashEntry } from '../../../services/v2/other/srvPackLov'



function lovCashEntry (req, res, next) {
  console.log('Requesting-lovCashEntry: ' + ' ...')
  return srvLovCashEntry().then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs.data
    })
  }).catch(er => {
    next(new ApiError(422, `APPLV-00002: Level Approval is required`, er))
  })
}

export function ctlPackLov (req, res, next) {
  const params = req.params.type

  if(params === 'CE') {
    return lovCashEntry(req, res, next)
  } else {
    next(new ApiError(422, `APPLV-00001: Type params doesn\'t exists`, er))
  }
}

