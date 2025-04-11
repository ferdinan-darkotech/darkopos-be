import { Op } from 'sequelize'
import db from '../../../models/tableR'
import _state from '../../../utils/globalVariables'


const tbMessageTemplate = db.tbl_message_template

const attributes = [
  'code',
  'app_type',
  'content_body'
]

export async function srvGetTemplateMessageByCode (code = '-', data = {}, parseContent = false) {
  const existsTemplates = _state.getVariables(`TEMP:MSG:${code}`)
  let currTemplate = {}

  if(!!existsTemplates.data && existsTemplates.success) {
    currTemplate = existsTemplates.data
  } else {
    currTemplate = await tbMessageTemplate.findOne({
      attributes: attributes,
      where: { code, status: { [Op.eq]: true } },
      raw: true
    })

    if(!!currTemplate) {
      _state.setVariables(`TEMP:MSG:${code}`, currTemplate)
    }
  }

  if((typeof parseContent === 'boolean' && parseContent) && !!currTemplate) {
    let tmpData = typeof data === 'object' && !Array.isArray(data) && !!data ? data : {}

    const contentBody = JSON.stringify(((currTemplate || {}).content_body || {}))
      .replace(/(:)+([a-zA-Z0-9_])+(:)/g, r => (tmpData[r.replace(/[^a-zA-Z0-9_]/g, '')] || '-'))
    return { ...currTemplate, content_body: JSON.parse(contentBody) }
  } else {
    return (currTemplate || {})
  }
}

export async function srvGetVerificationWaContentMsg() {
  try {
    const verificationWaTemplate = await tbMessageTemplate.findOne({
      attributes: ['content_body'],
      where: { code: 'VERIFIKASI-WA', status: { [Op.eq]: true } },
      raw: true
    });

    const contentMsgValue = verificationWaTemplate ? verificationWaTemplate.content_body.contentMsg : null;

    return contentMsgValue;
  } catch (error) {
    console.error('Couldn\'t find template : ', error);
    throw error;
  }
}
