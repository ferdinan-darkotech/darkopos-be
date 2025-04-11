import moment from 'moment'
import db from '../../../models/tableR'

const tbLogFeedbackSales = db.tbl_log_feedback_sales


export async function srvInsertLogsFeedbackSales ({
  apps_type = null,
  customer_account = null,
  store_code = null,
  trans_no = null,
  feedback_point = 0
}) {
  return tbLogFeedbackSales.create({
    apps_type,
    customer_account,
    store_code,
    trans_no,
    feedback_point,
    created_at: moment()
  })
}