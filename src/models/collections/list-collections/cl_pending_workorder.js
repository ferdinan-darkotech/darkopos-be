const { SchemaTypes: Types } = require('mongoose')

const cl_logs_report = {
  clsName: 'cl_pending_workorder',
  unique: [{ record_id: 1 }],
  attributes: {
    record_id: { type: Types.String, required: true },
    store: { type: Types.Number, required: true },
    member: { type: Types.String, required: true },
    unit: { type: Types.String, required: true },
    member: { type: Types.String, required: true },
    verified_wa_number: { type: Types.String, required: false, default: null },
    trans_header: { type: Types.Mixed, required: true },
    trans_detail: { type: Types.Mixed, required: true },
    other_informations: { type: Types.Mixed, required: false, default: {} },
    workorder: { type: Types.Mixed, required: true },
    created_by: { type: Types.String, required: true },
    created_at: { type: Types.Date, required: true }
  }
}

module.exports = cl_logs_report
