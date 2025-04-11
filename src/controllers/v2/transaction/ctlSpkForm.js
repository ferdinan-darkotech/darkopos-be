import moment from 'moment'
import { srvGetFormSPK, srvUpdateDuplicateSPK } from '../../../services/v2/transaction/srvSpkForm'
import { srvGetListQueueByWO } from '../../../services/v2/transaction/srvQueueSales'
import { getWoByNoAndStore } from '../../../services/service/workorder/woService'
import { getStoreQuery } from '../../../services/setting/storeService'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'

export function ctlGetFormSPK (req, res, next) {
  console.log('Requesting-ctlGetFormSPK: ' + req.url + ' ...')
  return getWoByNoAndStore(req.query.wono, req.query.store).then(exists => {
    let newExists = (JSON.parse(JSON.stringify(exists)) || {})
    let queryData = req.query
    if(queryData.type === 'CASHIER_ONLY') {
      queryData.duplicate = newExists.total_duplicate
    } else if (queryData.type === 'VOID') {
      newExists.total_duplicate = newExists.total_duplicate + 1
    }
    if(!newExists.id) throw new Error('SPK doesn\'t exists.')
    return srvGetFormSPK(queryData, newExists.total_duplicate).then(async rs => {
      const storeInfo = (req.query.includeStoreInfo || false).toString() === 'true' ? await getStoreQuery({ id: req.query.store || -1 }, 'storebyid') || {} : {}
      const storeValue = JSON.parse(JSON.stringify(storeInfo))
      if(rs.success) {
        res.xstatus(200).json({
          success: true,
          storeInfo: storeValue[0],
          data: rs.data
        })
      } else {
        throw new Error(rs.message)
      }
    }).catch(er => next(new ApiError(422, `SPK-0001: Couldn't find SPK`, er)))
  }).catch(er => next(new ApiError(422, `SPK-0002: Couldn't find SPK`, er)))
}

export function ctlUpdateDuplicateSPK (req, res, next) {
  console.log('Requesting-ctlUpdateDuplicateSPK: ' + req.url + ' ...')
  const { headerid, woid } = req.body
  return srvGetListQueueByWO(headerid, woid).then(exists => {
    const newExists = (JSON.parse(JSON.stringify(exists)) || {})
    if(!newExists.headerid) throw new Error('SPK doesn\'t exists.')

    const newPayload = { woid, current: newExists.current_duplicate }
    if(newExists.current_duplicate !== newExists.total_duplicate) {
      return srvUpdateDuplicateSPK(newPayload).then(async rs => {
        res.xstatus(200).json({
          success: true,
          message: 'Duplicate has been append.'
        })
      }).catch(er => next(new ApiError(422, `SPK-0004: Couldn't find SPK`, er)))
    } else {
      res.xstatus(200).json({
        success: true,
        message: 'Duplicate has been append.'
      })
    }
  }).catch(er => next(new ApiError(422, `SPK-0003: Couldn't find SPK`, er)))
}