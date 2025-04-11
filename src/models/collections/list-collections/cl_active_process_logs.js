const { SchemaTypes: Types } = require('mongoose')

const cl_active_process_logs = {
  clsName: 'cl_active_process_logs',
  // unique: [{ sent_from: 1, sent_to: 1 }],
  attributes: {
    process_id: { type: Types.String, required: true },
    type: { type: Types.String, required: true },
    code: { type: Types.String, required: true },
    names: { type: Types.String, required: true },
    descriptions: { type: Types.String, required: false, defaultValue: '-' },
    req_url: { type: Types.String, required: true },
    platform: { type: Types.String, required: false },
    remote_ip: { type: Types.String, required: false },
    req_params: { type: Types.Mixed, required: false },
    user: { type: Types.String, required: true },
    req_at: { type: Types.Date, required: true }
  }
}

module.exports = cl_active_process_logs
