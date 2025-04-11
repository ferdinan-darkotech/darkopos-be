import { srvSetResults, srvSaveNPSMonit, srvGetOneContactMsgNPS } from './controls/srvDynamicFormMonit'
import { generateLinkDynamicForm } from './connections'
import { sendMessages } from '../WA-Bot/srvWA'
import { srvGetTemplateMessageByCode } from '../srvMessageTemplate'
import sockets from '../../../../utils/socket'
import moment from 'moment'

async function onRatingServices (dataForm = {}, tmpNPS) {
  try {
    const templates = await srvGetTemplateMessageByCode('BAD-RATING')
    const { nps_data } = (tmpNPS || {})

    if(templates) {
      const { results } = dataForm
      const { formID, contentMsg, npsRules } = (templates.content_body || {})

      const { message: rulesMessage, alerts = 0 } = npsRules
      if(results.rating > alerts) return null
      const generateLinks = await generateLinkDynamicForm({
        license: 'bf475-c3331-09c81-4dbfb-6bb0f-5bb08',
        formID
      })

      // sockets.bulkSendBroadcast(
      //   'LIVE-MONITORING-NPS',
      //   'receiveMonitoringNPS', {
      //     STORE: nps_data.store_code
      //   }, {
      //     groups: 'BAD-RATING',
      //     action: 'INCOMING',
      //     data: saveNPS
      //   }
      // )

      if(generateLinks.success) {
        const listWA = await srvGetOneContactMsgNPS(nps_data.store_code)

        if(listWA && Array.isArray(listWA.wa_no) && listWA.wa_no.length > 0) {
          await srvSaveNPSMonit({
            groups: 'BAD-RATING',
            url_link: (generateLinks.data || {}).hyperlink,
            public_id: (generateLinks.data || {}).publicId,
            payload: {
              rating: (results.rating || 0),
              store_code: nps_data.store_code,
              store_name: nps_data.store_name,
              trans_no: nps_data.trans_no
            },
            created_at: moment().unix()
          })

          const dataObj = {
            STORE_NAME: nps_data.store_name,
            HYPERLINK: ((generateLinks.data || {}).hyperlink || '-')
          }
          const messages = contentMsg.replace(/(:)+([a-zA-Z0-9_])+(:)/g, r => (dataObj[r.replace(/[^a-zA-Z0-9_]/g, '')] || '-'))
          await sendMessages({
            priority: true,
            activation_key: nps_data.activation_wa,
            sendTo: listWA.wa_no,
            textMsg: messages
          })
        }
      }
    }
  } catch (er) {
    console.log('>>>', er)
    return null
  }
}

function onFormBadRating (dataForm, dataNPS) {

}


export default function handlerDynamicForm (req, res, next) {
  return srvSetResults({ ...req.body }).then(ok => {
    if(ok.success) {
      if(ok.group === 'FJ-RATING') onRatingServices(req.body, ok.tmpNPS)
      else if (ok.group === 'BAD-RATING') onFormBadRating(req.body, ok.tmpNPS)

      res.xstatus(200).json({
        success: true,
        message: ok.message,
        data: ok.data
      })
    } else {
      throw ok
    }
  }).catch(er => res.xstatus(400).json({
    success: false,
    message: er.message,
    data: er.data
  }))
}