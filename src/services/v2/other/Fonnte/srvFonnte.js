import tb from '../../../../models/tableR'
import moment from 'moment'
import sequelize from '../../../../native/sequelize'
import { ApiError } from '../../../v1/errorHandlingService'

const table = tb.tbl_wa_messages

export async function fonnteMsg (data, next) {
  
  function convertMillisecondsToDateTime(milliseconds) {
    const date = new Date(milliseconds);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const millisecondsPart = String(date.getMilliseconds()).padStart(3, '0');
    
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${millisecondsPart}`;
    return formattedDateTime;
  }

  const transaction = await sequelize.transaction()
  try {
    const pesan_wa = await table.create({
      wa_number: data.wa_number,
      message_id: data.message_id,
      message_text: data.message_text,
      message_time: convertMillisecondsToDateTime(data.message_time),
      message_status: data.message_status,
      message_type: data.message_type,
      base64_file: data.base64_file,
      member_code: data.member_code,
      created_by: "ownerPOS",
      created_at: moment()
    }, { transaction })
    await transaction.commit()
    
    return pesan_wa
  } catch(err) {
    await transaction.rollback()
    const { parent, original, sql, ...other } = JSON.parse(JSON.stringify(err))
    other.code = 'ZSCL-00001'
    next(new ApiError(400, other, err))
  }
  
}
