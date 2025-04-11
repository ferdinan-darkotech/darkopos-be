import moment from 'moment'
import express from 'express'
import uaParser from 'ua-parser-js'
import ShortID from 'short-unique-id'
import { insertLogsApi } from '../services/v2/other/srvLogApi'
// import Sockets from '../utils/socket'

const app = express()

// async function FlowBefore (req, res) {
//   try {
    
//     // Sockets.bulkSendBroadcast('NOTIF-PRIVATE-PROCESS-LOGS', 'receiveLogsSystem', {}, { data: payloads, mode: 'add' })
//     return true
//   } catch (er) {
//     throw new Error(er.message)
//   }
// }

// async function FlowAfter (req, res, next, payloads) {
//   const timeAt = new Date()
//   if(!!req.keyProcess) {
//     // Sockets.bulkSendBroadcast('NOTIF-PRIVATE-PROCESS-LOGS', 'receiveLogsSystem', {}, { res_at: timeAt.getTime(), pid: req.keyProcess, mode: 'remove' })
//   } else {
//     // next(new ApiError(504, payloads.message))
//     if(payloads.success) {
//       res.xstatus(200).json({
//         data: payloads.data,
//         success: payloads.success
//       })
//     } else {
//       next(new ApiError(500, payloads.message, payloads.detail))
//     }
//   }
// }

const UUID = new ShortID({ length: 16 })
const regexLocalhost = '^(\:\:1|:1|127.0.0.1|localhost|local|)$'

function recustomUserAgent (ua) {
  return ({
    browser: typeof (ua.browser || {}).name === 'string' ? `${ua.browser.name} [${ua.browser.version}]`.toUpperCase() : null,
    engine: typeof (ua.engine || {}).name === 'string' ? `${ua.engine.name} [${ua.engine.version}]`.toUpperCase() : null,
    os: typeof (ua.os || {}).name === 'string' ? `${ua.os.name} [${ua.os.version}]`.toUpperCase() : null,
    device: typeof (ua.device || {}).vendor === 'string' || typeof (ua.device || {}).type === 'string' ? `${ua.device.vendor} ${ua.device.model} [${ua.device.type}]`.toUpperCase() : null,
    cpu: typeof (ua.cpu || {}).architecture === 'string' ? ua.cpu.architecture.toUpperCase() : null
  })
}

function assignInformationRequest (req, res) {
  const ipAddress = (((req.headers['x-forwarded-for'] || '').toString()).split(',').pop().trim() || req.socket.remoteAddress || '').toString()

  req.id = UUID.stamp(24).match(/.{3,5}/g).join('-')
  req.at = moment().unix()
  req.client_informations = {
    ...recustomUserAgent(uaParser(req.headers['user-agent'])),
    ip_addr: (
      ipAddress.match(new RegExp(regexLocalhost, 'g')) ? '0.0.0.0' : ipAddress
    ).replace(/[^0-9\.]+/, '')
  }
}

function partialObjects (dataObj = {}) {
  let obj = dataObj
  if(Array.isArray(dataObj)) {
    for (let a in dataObj) {
      try {
        obj[a] = partialObjects(dataObj[a])
      } catch (_) {
        obj[a] = null
      }
    }
  } else {
    const keys = Object.keys(dataObj)
    for (let a in keys) {
      try {
        if(typeof dataObj[keys[a]] === 'object') {
          obj[keys[a]] = partialObjects(dataObj[keys[a]])
        } else {
          obj[keys[a]] = (obj[keys[a]] || '').substring(0, 512)
        }
      } catch (_) {
        obj[keys[a]] = null
      }
    }
  }

  return obj
}

// Render Api Response
app.use((req, res, next) => {
  assignInformationRequest(req, res)
  const rawResponseEnd = res.end;
  let chunkBuffers = [];
  
  res.xstatus = (statusCode) => {
    return {
      json: (payloads = {}) => {
        return res.status(statusCode).json({
          reqId: req.id,
          ...payloads
        })
      },
      end: () => res.end()
    }
  }
  
  res.end = (...chunk) => {
    const resArgs = []
    try {
      res.setHeader('Last-Modified', (new Date()).toUTCString())

      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      const body = Buffer.concat(chunkBuffers).toString('utf8');
      let dataBody = null
      try {
        dataBody = body ? JSON.parse(body) : null
      } catch (er) {
        if(typeof body === 'string') {
          dataBody = {
            message: body
          }
        } else {
          dataBody = body
        }
      }

      let tmpMsg = dataBody.message

      if(Array.isArray((dataBody || []).message)) {
        tmpMsg = (dataBody.data || {}).message[0]
      } else if (typeof (dataBody.data || {}).message === 'object') {
        tmpMsg = ((dataBody.data || {}).message || 'Somemthing wrong')
      }
      const userAuth = req.$userAuth
      const logsInfo = {
        res_code: res.statusCode,
        ids: req.id,
        user_info: !!userAuth ? `${userAuth.userid}:${userAuth.store}:${userAuth.role}` : null,
        path: `${req.method}:${req.path}`,
        reqParams: req.query,
        reqBody: typeof req.body === 'object' ? partialObjects(req.body) : partialObjects({ unknown: req.body }),
        req_at: req.at,
        res_at: moment().unix(),
        res_msg: (tmpMsg || 'UNDEFINED').substring(0, 512),
        res_detail: res.statusCode >= 200 || res.statusCode < 300 ? {}
          : typeof dataBody.detail === 'object' ? partialObjects(dataBody.detail) : partialObjects({ unknown: dataBody.detail }),
        client_info: req.client_informations
      }

      // if(res.statusCode < 200 || res.statusCode > 299) 
      insertLogsApi(logsInfo)
        .then(() => true)
        .catch(() => false)

      rawResponseEnd.apply(res, resArgs)
      return {}
    } catch (er) {
      rawResponseEnd.apply(res, resArgs)
      return {}
    }
  }

  return next()
})

export const FlowRouters = app