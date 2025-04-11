import db from '../../../models/tableR'

const tbLogApi = db.tbl_logs_api

const attrLogs = [
  'ids', 'path', 'res_msg', 'res_detail', 'req_at', 'res_at', 'res_code', 'user_info',
  'client_ip', 'client_os', 'client_cpu', 'client_device', 'client_engine', 'client_browser'
]


export function insertLogsApi (data = {}) {
  return tbLogApi.create({
    ids: data.ids,
    path: data.path,
    res_code: (data.res_code || 400).toString(),
    req_params: data.reqParams,
    req_body: data.reqBody,
    user_info: data.user_info,
    client_ip: (data.client_info || {}).ip_addr,
    client_os: (data.client_info || {}).os,
    client_cpu: (data.client_info || {}).cpu,
    client_device: (data.client_info || {}).device,
    client_engine: (data.client_info || {}).engine,
    client_browser: (data.client_info || {}).browser,
    res_msg: data.res_msg,
    res_detail: data.res_detail,
    req_at: data.req_at,
    res_at: data.res_at
  })
}

