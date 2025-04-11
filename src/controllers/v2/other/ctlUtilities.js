import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvGetDistanceTwoPointByRoute } from '../../../services/v2/other/srvUtilities'


export function ctlGetDistanceTwoPointByRoute (req, res, next) {
  console.log('Requesting-ctlGetDistanceTwoPointByRoute: ' + ' ...')
  return srvGetDistanceTwoPointByRoute(req.body.from, req.body.to).then(toReturn => {
    res.xstatus(200).json({
      success: true,
      message: 'OK',
      data: toReturn
    })
  }).catch(er => next(new ApiError(422, `APPLV-00001: Type params doesn\'t exists`, er)))
}