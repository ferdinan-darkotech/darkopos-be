import { srvInsertLogsFeedbackSales } from '../../marketing/srvFeedbackCustomers'
import { FlowSales, CustomerResponse, CustomerOptions } from './controls'

async function otherMessageMode (dataMsg, infoMsg) {
  try {
    if(typeof (dataMsg.message || {}).buttonMsg === 'object' && (dataMsg.message || {}).buttonMsg) {
      const {
        prefix: prefixButton = [],
        ...otherButtonPayload
      } = ((dataMsg.message || {}).buttonMsg || {})
      
      const [_KEY, ...otherPrefixButtons] = prefixButton
      if (_KEY === 'FEEDBACK-SLS') {
        const [_INVOICE, _STORE, _RATING] = otherPrefixButtons
        await srvInsertLogsFeedbackSales({
          apps_type: 'Whatsapp',
          customer_account: infoMsg.send_by,
          store_code: _STORE,
          trans_no: _INVOICE,
          feedback_point: +_RATING
        })
      }
    } else if (typeof (dataMsg.message || {}).LOV === 'string') {
      await CustomerOptions(dataMsg, infoMsg)
    }
    return
  } catch (er) {
    throw er.message
  }
}

async function dynamicOptionsMessageMode (dataMsg, infoMsg) {
  try {
    const {
      matchKey = null,
      matchPayload = {},
      dataBody = {},
    } = (dataMsg.payload || {})

    const _KEY = dataBody.prefix
    if(_KEY === 'SLS-FLOW') {
      await FlowSales(matchKey, matchPayload, dataBody, infoMsg, dataMsg.message)
    } else if (_KEY === 'RESP-CUSTOMER') { 
      await CustomerResponse(matchKey, matchPayload, dataBody, infoMsg, dataMsg.message)
    } else if (_KEY === 'CUSTOMER-OPTIONS') {
      await CustomerOptions({ message: dataMsg.message, payload: dataBody }, infoMsg)
    }
    
    return
  } catch (er) {
    throw er.message
  }
}

export default async function handleReceiveMessageFromWA (req) {
  try {
    const dataMsg = (req.body.data || {})
    const infoMsg = (req.body.info || {})

    if(infoMsg.mode !== 'DYNAMIC-OPTIONS') {
      await otherMessageMode(dataMsg, infoMsg)
    } else {
      await dynamicOptionsMessageMode(dataMsg, infoMsg)
    }

    return
  } catch (er) {
    console.log('[ERR-ON-HANDLE-RECEIVE-MSG-WA] :', er)
    return
  }
}