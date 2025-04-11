import moment from 'moment'
import collections from '../../../models/collections/list-collections'
import { setDefaultQueryNoSQL } from '../../../utils/setQuery'

const activeProcess = collections.cl_active_process_logs
const requestReport = collections.cl_logs_report

const activeProcessAttr = [
  'process_id', 'type', 'code', 'names', 'descriptions', 'req_url', 'platform', 'remote_ip',
  'req_params', 'user', 'req_at',
]

const requestReportAttr = [
  'process_id', 'code', 'names', 'descriptions', 'req_url', 'platform', 'remote_ip',
  'req_params', 'user', 'req_at', 'res_at', 'res_status', 'res_message'
]

const formatTime = 'YYYY-MM-DD HH:mm:ss'
const formatDate = 'YYYY-MM-DD'

export function srvGetSomeRequestReportLogs (query = {}) {
  let { ...otherQuery } = query
  otherQuery = otherQuery || {}
  let columns = requestReportAttr
  
  if(!!otherQuery.req_at && typeof otherQuery.req_at === 'object' && (otherQuery.req_at || []).length > 1) {
    otherQuery['$RNGDT:req_at'] = [moment(+otherQuery.req_at[0] * 1000).format(formatTime), moment(+otherQuery.req_at[1] * 1000).format(formatTime)]
  } else if(!!otherQuery.req_at && typeof otherQuery.req_at === 'string') {
    otherQuery['$PERIOD:req_at'] = moment(+otherQuery.req_at * 1000).format(formatDate)
  } else if(!!otherQuery.res_at && typeof otherQuery.res_at === 'object' && (otherQuery.res_at || []).length > 1) {
    otherQuery['$RNGDT:res_at'] = [moment(+otherQuery.res_at[0] * 1000).format(formatTime), moment(+otherQuery.res_at[1] * 1000).format(formatTime)]
  } else if(!!otherQuery.res_at && typeof otherQuery.res_at === 'string') {
    otherQuery['$PERIOD:res_at'] = moment(+otherQuery.res_at * 1000).format(formatDate)
  }
  delete otherQuery.req_at
  delete otherQuery.res_at

  let { where, paging } = setDefaultQueryNoSQL(columns, otherQuery, true)

  where = {
    ...where
  }
  
  return requestReport.count(where).then(counts => {
    return requestReport
      .find(where, columns)
      .skip(paging.offset)
      .limit(paging.limit)
      .sort({ req_at: -1 }).then(data => {
        return { data, count: counts }
      })
  })
}

export function srvGetAllActiveProcessLogs () {
  let { where } = setDefaultQueryNoSQL(activeProcessAttr, {}, false)
  return activeProcess
    .find(where, activeProcessAttr)
    .sort({ req_at: -1 }).then(data => {
      return { data }
    })
}

function saveToReportLogs (data, otherData) {
  return requestReport.insertMany([{
    process_id: data.pid,
    code: data.code,
    names: data.names,
    descriptions: data.descriptions,
    req_url: data.req_url,
    platform: data.platform,
    remote_ip: data.remote_ip,
    req_params: data.req_params,
    user: data.user,
    req_at: data.req_at,
    res_at: otherData.at,
    res_status: otherData.status,
    res_message: otherData.message
  }])
}

export async function srvStartSession (data) {  
  return activeProcess.insertMany([{
    process_id: data.process_id,
    type: data.type,
    code: data.code,
    names: data.names,
    descriptions: data.descriptions,
    req_url: data.req_url,
    platform: data.platform,
    remote_ip: data.remote_ip,
    req_params: data.req_params,
    user: data.user,
    req_at: data.req_at
  }])
}

export async function srvEndSession (pid, endAt, oth) {
  try {
    if(!pid) return null
    const current = await activeProcess.findOne({ process_id: pid })
    if(!!current.process_id) {
      const deletedDoc = await activeProcess.deleteOne({ process_id: pid })
      if((deletedDoc.deletedCount || 0) > 0) {
        const otherData = {
          message: oth.message,
          at: endAt,
          status: oth.success ? 'SUCCESS' : 'FAILED'
        }
        switch(current.type) {
          case 'REPORT':
            saveToReportLogs({ ...JSON.parse(JSON.stringify(current)), pid }, otherData)
            break
          default:
            break
        }
        return true
      }
      return false
    }
    return true
  } catch (er) {
    return false
  }
}

