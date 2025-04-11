import project from '../../../../../config/project.config'
import { ApiError } from '../../../../services/v1/errorHandlingService'
import { srvGetAllStore } from '../../../../services/v2/master/store/srvStore'
import { createTree } from '../../../../utils/mapping'
import { extractTokenProfile } from '../../../../services/v1/securityService'

exports.ctlAllStore = function (req, res, next) {
  console.log('Requesting-ctlGetStore: ' + JSON.stringify(req.url) + ' ...')

  const userLogin = {} //extractTokenProfile(req)

  try{
    return srvGetAllStore(req.query, userLogin.userid).then((rs) => {
      res.send({
        success: true,
        data: req.query.m === 'lov' ? 
          createTree(
            (JSON.parse(JSON.stringify(rs)) || []),
            'storeParentId',
            'id',
            ['id', 'storeParentId', ['storeCode', 'key'], ['storeCode', 'value'], ['storeName', 'label']]
          )
            : JSON.parse(JSON.stringify(rs)) || [],
        length: JSON.parse(JSON.stringify(rs)).length
      })
    })
  } catch (er) { next(new ApiError(500, 'Server has no response ..')) }
}