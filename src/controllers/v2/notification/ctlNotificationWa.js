import { ApiError } from '../../../services/v1/errorHandlingService'
import { srvPushWa } from '../../../services/v2/notification/srvNotificationWa'
import { srvCreateNotificationProposal, srvGetNotificationProposalById } from '../../../services/v2/notification/srvNotificationProposal'
import { extractTokenProfile } from '../../../services/v1/securityService'
import { getRandomIntMax } from '../../../utils/random'
import { sendWAMessageText } from '../../../services/v2/other/WA-Bot/srvWA'

const transformMessageWA = (body) => {
  let dataContent = body.message
  // construct dataInfo for replacement
  let dataInfo = JSON.parse(body.dataInfo)
  dataInfo.dataKey = body.dataKey
  dataInfo.dataDate = body.dataDate

  // search pattern {...}
  const regexCurly=/\{(\w+)\}/g
  const matchCurly = dataContent.match(regexCurly)
  if (matchCurly) {
    matchCurly.forEach(function(el) {
      const elValue = dataInfo[el.replace(/{|}/g,'')]
      dataContent = dataContent.replace(new RegExp(el, "g"), elValue)
    })
  }

  // search pattern [...]
  const regexBracket=/\[.*\]/g
  const matchBracket = dataContent.match(regexBracket)
  // check matchBracket not null
  if (matchBracket) {
    //get default fix spinText position
    const randomPosition = getRandomIntMax(matchBracket[0].replace(/\[|\]/g,'').split(':').length)
    matchBracket.forEach(function(el) {
      const elSplit = el.replace(/\[|\]/g,'').split(':')
      const randomText = elSplit[randomPosition]
      dataContent=dataContent.replace(el, randomText)
    })
  }

  const retBody = {
    "id": body.id,
    "type": body.type,
    "message": dataContent,
    "no_wa": body.no_wa
  }

  return retBody

  // for(let idx in notif) {

  //   srvPushWa(body).then((result) => {
  //     console.log('result', result.data)
  //   }).catch(err => console.log(err))
  // }
  // // replace content with dataInfo - end
}

export async function pushWa (req, res, next) {
  console.log('Requesting-pushWa: ' + JSON.stringify(req.params) + ' ...')
  const userLogIn = extractTokenProfile(req)
  const { ...message } = transformMessageWA(req.body)
  if (message) {
    return srvGetNotificationProposalById(req.body.id).then((result) => {
      if (result) {
        return sendWAMessageText(req.body.notif_token, { wa_number: message.no_wa, text: message.message }).then(sent => {
          console.log(req.body.notif_token, '>>>', sent)
          if(sent.success) {
            return srvPushWa(message).then((result) => {
              res.xstatus(200).json({
                success: true,
                message: 'Ok',
                data: result.data
              })
            }).catch(err => next(new ApiError(422,`ZCWA-00002: Couldn't push WA`, err)))
          } else {
            throw sent.message
          }
        }).catch(err => next(new ApiError(422,`ZCWA-00001: Couldn't push WA`, err)))
      }
    })
  }

}

