const { SchemaTypes: Types, Schema } = require('mongoose')
import shortID from 'short-unique-id'

const UUID = new shortID({ length: 12 })


const cl_nps_monitoring = {
  clsName: 'cl_nps_monitoring',
  unique: [{ nps_id: 1 }],
  attributes: {
    nps_id: { type: Types.String, required: false, default: () => `${UUID().match(/.{1,4}/g).join('-')}` },
    nps_group: { type: Types.String, required: true },
    nps_data: { type: Types.Mixed, required: false, default: null },
    url_link: { type: Types.String, required: true },
    public_id: { type: Types.String, required: true },
    created_at: { type: Types.Number, required: true }
  }
}

module.exports = cl_nps_monitoring
