import { sendMessages, sendMessagesTemplate } from '../srvWA'
import { srvGetAllCouponByVerifyWA } from '../../../transaction/srvTransCustomerCoupon'
import { srvNativeQueryStrings } from '../../../../v2/setting/srvNativeQuery'
import { getAllStorePositionByPrefix } from '../../../../setting/storeService'
import { srvGetNearestObjectByRoute } from '../../../../v2/other/srvUtilities'
import { srvGetTemplateMessageByCode } from '../../../../v2/other/srvMessageTemplate'
import { srvGetOneVerifiedCustomerByWA } from '../../../../v2/master/customer/srvCustomerList'
import moment from 'moment'


async function getCurrentCustomerPoints (infos, datas) {
  try {
    const currCoupons = await srvGetAllCouponByVerifyWA(infos.send_by)
        
    if(currCoupons.length === 0) throw ({ localErrors: true, message: 'Nomor anda belum terdaftar sebagai penerima point.' })

    let textMsg = ''
    let space = ''

    for(let x in currCoupons) {
      const items = currCoupons[x]
      textMsg += space
      textMsg += `** ${items.coupon_code}*\n\nMember : ${items.member_code}\nNopol : ${items.policeno}\nSisa Poin : ${items.point_earned - items.point_used}`
      space = '\n\n'
    }
    
    return sendMessages({
      priority: true,
      activation_key: infos.activation_id,
      sendTo: [infos.send_by],
      textMsg
    })
  } catch (er) {
    throw er
  }
}
 
async function getCustomerTrans (infos, datas, stringQuery, otherPayloads = {}) {
  try {
    const currCustomers = await srvNativeQueryStrings({
      typeQuery: stringQuery,
      wa_no: infos.send_by,
      ...otherPayloads
    })

    if(!currCustomers.success) throw 'Had some mistakes.'

    const dataTrans = currCustomers.data
    const groupingData = dataTrans.reduce((a, b) => ({
      ...a,
      [b.transno]: {
        store: b.storename,
        policeno: b.policeno,
        transdate: b.transdate,
        items: {
          ...((a[b.transno] || {}).items || {}),
          [b.typecode]: [...(((a[b.transno] || {}).items || {})[b.typecode] || []), `*-* ${b.item_name}`]
        }
      }
    }), {})

    let textMsg = ''
    let space = ''
    for (let a in groupingData) {
      const item = groupingData[a]

      textMsg += space
      textMsg += `***** ${a} *****\n`
      textMsg += `Outlet : ${item.store}\n`
      textMsg += `Tanggal : ${item.transdate}\n`
      textMsg += `No. plat : ${item.policeno}\n\n`
      textMsg += `*(Pembelian Item)*\n`
      textMsg +=  (Array.isArray(item.items.P) ? item.items.P : []).join('\n')
      textMsg += '\n'
      textMsg += `*(Penggunaan Jasa)*\n`
      textMsg += (Array.isArray(item.items.S) ? item.items.S : []).join('\n')
      space = '\n\n*--------------------------------*\n\n'
    }

    return sendMessages({
      priority: true,
      activation_key: infos.activation_id,
      sendTo: [infos.send_by],
      textMsg
    })
  } catch (er) {
    console.log(er)
    throw er
  }
  
}

async function getNearestOutlets (infos, datas) {
  try {
    const currentPositions = `${datas.locations[1]},${datas.locations[0]}`
    const listStorePositions = await getAllStorePositionByPrefix('MBMDN')
    const getDistances = await srvGetNearestObjectByRoute(currentPositions, listStorePositions)

    const textMsg = 'Outlet *'+getDistances.data.storename+'* merupakan lokasi terdekat, yang berdasarkan pada titik lokasi anda saat ini.'
      +' Dengan jarak tempuh kurang lebih *'+getDistances.distances.km.toFixed(2)+' KM*'
    +'\n\nMap :\n'
    +'https://www.google.com/maps/place/'+getDistances.data.latitude+','+getDistances.data.longitude

    return sendMessages({
      priority: true,
      activation_key: infos.activation_id,
      sendTo: [infos.send_by],
      textMsg
    })
  } catch (er) {
    throw er
  }
}

async function nearestOutlets (infos, datas) {
  try {
    const templates = await srvGetTemplateMessageByCode('NEAREST-OUTLETS', {})
    const { content, dynamic } = templates.content_body
    return sendMessages({
      priority: true,
      activation_key: infos.activation_id,
      sendTo: [infos.send_by],
      ...content,
      dynamicMessages: dynamic
    })
  } catch (er) {
    throw er
  }
}


async function historyTransactionCustomers (infos, datas) {
  try {
    const templates = await srvGetTemplateMessageByCode('HISTORY-TRANS-CUSTOMERS', {})
    const { content, dynamic } = templates.content_body
    return sendMessages({
      activation_key: infos.activation_id,
      sendTo: [infos.send_by],
      ...content,
      dynamicMessages: dynamic
    })
  } catch (er) {
    throw er
  }
}

async function assignCritismAndSuggestion (infos, datas) {
  try {
    const checkID = await srvGetOneVerifiedCustomerByWA(infos.send_by)
    let templates = {}
    if(checkID) {
      templates = await srvGetTemplateMessageByCode('CRITISM-AND-SUGGESTION', { ...checkID, PARTICIPANT: infos.send_by }, true)
    } else {
      templates = await srvGetTemplateMessageByCode('UNVERIFIED-NUMBER', { PARTICIPANT: infos.send_by }, true)
    }

    return sendMessagesTemplate({
      activation_key: infos.activation_id,
      ...templates.content_body
    })
  } catch (er) {
    throw er
  }
}



export default async function handlers (dataMsg, infoMsg) {
  try {
    const { type: typeMsg, data } = dataMsg.payload
    if(typeMsg === 'GET-POINT-CUSTOMER') {
      await getCurrentCustomerPoints(infoMsg, data)
    } else if (typeMsg === 'HISTORY-TRANSACTIONS-CUSTOMER') {
      await historyTransactionCustomers(infoMsg, data)
    } else if (typeMsg === 'GET-HISTORY-TRANSACTIONS-CUSTOMER') {
      await getCustomerTrans(infoMsg, data, 'YEARLY_TRANS_CUST_BY_VERIFY_WA', { in_year: dataMsg.message.textMsg })
    } else if (typeMsg === 'GET-LAST-TRANS-CUST') {
      await getCustomerTrans(infoMsg, data, 'LAST_TRANS_BY_VERIFY_WA')
    } else if (typeMsg === 'NEAREST-OUTLETS') {
      await nearestOutlets(infoMsg, data)
    } else if (typeMsg === 'GET-NEAREST-OUTLET') {
      await getNearestOutlets(infoMsg, { locations: dataMsg.message.locationMsg })
    } else if (typeMsg === 'CRITISM-AND-SUGGESTION') {
      await assignCritismAndSuggestion(infoMsg, data)
    }

  } catch (er) {
    return sendMessages({
      priority: true,
      activation_key: infoMsg.activation_id,
      sendTo: [infoMsg.send_by],
      textMsg: er.localErrors ? er.message : 'Terjadi kesalahan, mohon untuk menghubungi admin yang terkait.'
    })
  }
}