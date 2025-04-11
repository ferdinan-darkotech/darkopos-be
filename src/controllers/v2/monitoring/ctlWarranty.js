import { srvGetWarrantyProducts } from '../../../services/v2/monitoring/srvWarranty'
import { srvGetStoreBranch, srvFindAllStoreByParent } from '../../../services/v2/master/store/srvStore'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'


export async function ctlGetWarrantyProducts (req, res, next) {
  console.log('Requesting-ctlGetWarrantyProducts: ' + JSON.stringify(req.query) + ' ...')
  const userLogIn = req.$userAuth

  return srvGetStoreBranch(userLogIn.store).then(branch => {
    if(!branch) throw new Error('Branch is not initialized.')
    return srvFindAllStoreByParent(branch.parent_store_id, 'store_code').then(stores => {
      return srvGetWarrantyProducts(req.query, stores).then(rs => {
        res.xstatus(200).json({
          success: true,
          page: +(req.query.page || 1),
          pageSize: +(req.query.pageSize || 20),
          total: rs.count,
          data: rs.rows
        })
      }).catch(err => next(new ApiError(422, `ZWRTY-00003: Couldn't find product warranties.`, err.message)))
    }).catch(err => next(new ApiError(422, `ZWRTY-00002: Couldn't find product warranties`, err)))
  }).catch(err => next(new ApiError(422, `ZWRTY-00001: Couldn't find product warranties`, err)))
}