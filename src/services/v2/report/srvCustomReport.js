import tb from '../../../models/tableR'
import { getNativeQuery } from '../../../native/nativeUtils'
import sequelize from 'sequelize'
import moment from 'moment'

const OP = sequelize.Op

const tbReportOptions = tb.tbl_custom_report_options
const tbReportForms = tb.tbl_custom_report_form


const attrReportOptions = ['report_code', 'report_name', 'parent_code', 'form', 'query']

export function srvGetCustomReportOptions () {
  return tbReportOptions.findAll({
    attributes: attrReportOptions,
    order: [[sequelize.literal('coalesce(parent_code, \'\')'), 'asc'], ['sort_index', 'asc']],
    where: {
      active: { [OP.eq]: true }
    },
    raw: true
    
  })
}

export function srvGetCustomReportForm (code = null) {
  return tbReportForms.findOne({
    attributes: ['form_code', 'form_name', 'report_type', 'report_layout', 'form_fields', 'file_type'],
    where: { form_code: code },
    raw: true
  })
}