import {
  srvCreateCashEntry, srvUpdateCashEntry, srvGetAllDetailCashEntry, srvGetHeaderCashEntry, srvGetOneHeaderCashEntry,
  srvGetSummaryCashEntry
} from '../../../services/v2/finance/srvCashEntry'
import { srvGetAllActivePeriod } from '../../../services/v2/finance/srvCashierBalance'
import {
  getMiscByCodeName
} from '../../../services/v1/miscService'
import { ApiError } from '../../../services/v1/errorHandlingService'
import { extractTokenProfile } from '../../../services/v1/securityService'
import moment from 'moment'


export async function ctlGetHeaderCashEntry (req, res, next) {
  console.log('Requesting-ctlGetHeaderCashEntry: ' + req.url + ' ...')

  let condPeriod = []
  if(req.query.mode === 'period') {
    const userLogin = extractTokenProfile(req)
    const periodPayload = {
      store: req.query.storeid,
      cashier: userLogin.userid,
    }
    const dataPeriod = await srvGetAllActivePeriod(periodPayload)
    condPeriod = dataPeriod.map(x => ({
      transkindid: x.transkind,
      transdate: x.period
    }))
  }
  return srvGetHeaderCashEntry(req.query, condPeriod).then(rs => {
    res.xstatus(200).json({
      success: true,
      data: rs.rows,
      page: +req.query.page || 1,
      pageSize: +req.query.pageSize || 1000,
      total: rs.count
    })
  }).catch(err => next(new ApiError(422, `DDCE-00001: Couldn't cash entry`, err)))
}

export function ctlGetAllDetailCashEntry (req, res, next) {
  console.log('Requesting-ctlGetAllDetailCashEntry: ' + req.url + ' ...')
  return srvGetAllDetailCashEntry(req.params.store, req.params.transno).then(rsdetail => {
    res.xstatus(200).json({
      success: true,
      data: rsdetail,
      total: rsdetail.length
    })
  }).catch(err => next(new ApiError(422, `DDCE-00002: Couldn't cash entry`, err)))
}


export async function ctlCreateCashEntry (req, res, next) {
  console.log('Requesting-ctlCreateCashEntry: ' + req.url + ' ...')
  const userLogin = extractTokenProfile(req)
  const header = req.body.header
  const detail = req.body.detail
  return getMiscByCodeName('CETRNSTYP', header.transtypecode).then(type => {
    return getMiscByCodeName('CETRNSKIND', header.transkindcode).then(kind => {
      const newHeader = {
        ...header,
        transtype: JSON.parse(JSON.stringify(type || '{}')).id,
        transkind: JSON.parse(JSON.stringify(kind || '{}')).id,
        cashierid: userLogin.userid
      }
      return srvCreateCashEntry(newHeader, detail, userLogin.userid, next).then(created => {
        if(!created.success) throw created.message
        return srvGetOneHeaderCashEntry(header.storeid, created.transno).then(hdr => {
          return srvGetAllDetailCashEntry (header.storeid, created.transno).then(dtl => {
            res.xstatus(200).json({
              data: {
                header: hdr,
                detail: dtl
              },
              success: true,
              message: `Transaction has been created ${created.transno}`
            })
          }).catch(err => next(new ApiError(422, `DDCE-00005.1: Couldn't cfetch cash entry`, err)))
        }).catch(err => next(new ApiError(422, `DDCE-00005.1: Couldn't cfetch cash entry`, err)))
      }).catch(err => next(new ApiError(422, `DDCE-00005: Couldn't create cash entry`, err)))
    }).catch(err => next(new ApiError(422, `DDCE-00004: Couldn't create cash entry`, err)))
  }).catch(err => next(new ApiError(422, `DDCE-00003: Couldn't create cash entry`, err)))
}

export async function ctlUpdateCashEntry (req, res, next) {
  console.log('Requesting-ctlUpdateCashEntry: ' + req.url + ' ...')
  const userLogin = extractTokenProfile(req)
  let header = req.body.header
  const detail = req.body.detail
  const params = req.params
  return srvGetOneHeaderCashEntry(params.store, header.transno).then(exists => {
    if(!exists) {
      throw new Error('Transaction is not exists')
    } else {
      if(moment(exists.transdate).diff(moment(), 'month') !== 0) {
        throw new Error('Transaction out of month')
      } else {
        return getMiscByCodeName('CETRNSTYP', header.transtypecode).then(type => {
          return getMiscByCodeName('CETRNSKIND', header.transkindcode).then(kind => {
            const newHeader = {
              ...header,
              storeid: params.store,
              transno: params.transno,
              transtype: JSON.parse(JSON.stringify(type || '{}')).id,
              transkind: JSON.parse(JSON.stringify(kind || '{}')).id,
              cashierid: userLogin.userid
            }
            return srvUpdateCashEntry(newHeader, detail, userLogin.userid).then(updated => {
              if(!updated.success) throw updated.message
              res.xstatus(200).json({
                success: true,
                message: `Transaction has been updated ${updated.transno}`
              })
            }).catch(err => next(new ApiError(422, `DDCE-00010: Couldn't cash entry`, err)))
          }).catch(err => next(new ApiError(422, `DDCE-00009: Couldn't cash entry`, err)))
        }).catch(err => next(new ApiError(422, `DDCE-00008: Couldn't cash entry`, err)))
      }
    }
  }).catch(err => next(new ApiError(422, `DDCE-0007: Couldn't cash entry`, err)))
}


function getSummaryCashEntry (req, res, next) {
  console.log('Requesting-ctlGetSummaryCashEntry: ' + req.url + ' ...')
  const transkind = req.params.trans
  const queryData = req.query
  return srvGetSummaryCashEntry(transkind, queryData).then(summ => {
    res.xstatus(200).json({
      success: true,
      data: summ[0][0]
    })
  }).catch(err => next(new ApiError(422, `DDCE-00011: Couldn't summary cash entry`, err)))
}

export function ctlGetReportCashEntry (req, res, next) {
  const type = req.params.type
  if(type === 'SUMMARY-01') {
    return getSummaryCashEntry(req, res, next)
  } else {
    next(new ApiError(404, `DDCE-00012: Type not found`))
  }

}