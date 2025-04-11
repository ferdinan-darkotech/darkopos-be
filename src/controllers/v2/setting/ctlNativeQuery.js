import { srvNativeQueryStrings } from '../../../services/v2/setting/srvNativeQuery'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'


export function ctlNativeQueryStrings (req, res, next) {
  console.log('Requesting-ctlNativeQueryStrings', req.body)
  const userLogIn = req.$userAuth
  return srvNativeQueryStrings({ ...req.body, user_name: userLogIn.userid }).then(nat => {
    if(nat.success) {
      res.xstatus(200).json({
        success: true,
        data: nat.data
      })
    } else {
      throw new Error(nat.message)
    }
  }).catch(err => next(new ApiError(422, `ZNNQ-00001: Couldn't find native query`, err)))
}