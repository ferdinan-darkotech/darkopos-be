const { SchemaTypes: Types } = require('mongoose')

const cl_logs_report = {
  clsName: 'cl_logs_report',
  // unique: [{ sent_from: 1, sent_to: 1 }],
  attributes: {
    process_id: { type: Types.String, required: true },
    code: { type: Types.String, required: true },
    names: { type: Types.String, required: true },
    descriptions: { type: Types.String, required: false, defaultValue: '-' },
    req_url: { type: Types.String, required: true },
    platform: { type: Types.String, required: false },
    remote_ip: { type: Types.String, required: false },
    req_params: { type: Types.Mixed, required: false },
    user: { type: Types.String, required: true },
    req_at: { type: Types.Date, required: true },
    res_at: { type: Types.Date, required: true },
    res_status: { type: Types.String, required: true },
    res_message: { type: Types.String, required: false }
  }
}

module.exports = cl_logs_report
