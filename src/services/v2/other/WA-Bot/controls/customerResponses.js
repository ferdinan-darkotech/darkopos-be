import moment from 'moment'
import { sendMessages } from '../srvWA'
import _state from '../../../../../utils/globalVariables'
import { getVerifyCustomerWA } from '../../../../../utils/storages'
import _socket from '../../../../../utils/socket'


async function verifiyCustomerWA (opts, payload, data, infoMsg, messagePayloads) {
  try {
    const tData = data.dataInfo

    const keyStorages = `${tData.id}:${infoMsg.send_by}`
    await getVerifyCustomerWA(keyStorages)

    await _socket.sendVerifiedCustomerNumber(tData.username, infoMsg.send_by, 'WA', true)
  } catch (er) {
    // do somethings
    throw er
  }  
}


export default async function CustomerResponses (matchKey, matchPayload, dataBody, infoMsg, messagePayloads) {
  try {
    if(dataBody.type === 'RESP-VRFY-CUST-WA') {
      await verifiyCustomerWA(matchKey, matchPayload, dataBody, infoMsg, messagePayloads)
    }
  } catch (er) {
    console.log('ERR', er.localErrors, er.message)
    // store logs of error process here ....
    sendMessages({
      priority: true,
      activation_key: infoMsg.activation_id,
      sendTo: [infoMsg.send_by],
      textMsg: `${typeof er.localErrors === 'boolean' && er.localErrors ? er.message : 'Terjadi kesalahan,'} mohon untuk menghubungi admin yang terkait.`
    })
  }
}