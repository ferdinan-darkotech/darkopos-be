import moment, { now } from 'moment'
import { sendMessages } from '../srvWA'
import _state from '../../../../../utils/globalVariables'
import { srvGetTemplateMessageByCode } from '../../../../v2/other/srvMessageTemplate'
import { srvGetPendingWO, srvDeletePendingWO } from '../../../../v2/transaction/srvProcessPendingWO'
import { srvInsertQueueSales, srvGetOneQueueById } from '../../../../v2/transaction/srvQueueSales'
import { srvSignConfirmPayments, srvSetLocationCustomers, srvSetTapInMechanics, srvSetTapOutMechanics } from '../../../../v2/transaction/srvTrackSales'
import { srvGetDistanceTwoPointByRoute } from '../../srvUtilities'
import _socket from '../../../../../utils/socket'

async function confirmOrder (opts, payload, data, infoMsg, messagePayloads = {}) {
  try {
    const [latitude, longtitude] = Array.isArray(messagePayloads.locationMsg) ? messagePayloads.locationMsg : []
    if (opts === 'MAP01') {
      if(typeof latitude !== 'number') throw 'Latitude is required as a positions.'
      else if(typeof longtitude !== 'number') throw 'Longitude is required as a positions.'
    } else {
      const recordId = (data.dataInfo || {}).record_id
      const pendingWO = await srvGetPendingWO(recordId)
      if(pendingWO) {
        const {
          workorder, created_by, other_informations, verified_wa_number,
          trans_detail, trans_header, record_id, store, member, unit, created_at, ...others
        } = pendingWO

        const times = moment()

        const packData = {
          ...trans_header,
          storeid: store,
          member,
          unit,
          otherInformations: other_informations,
          detail: trans_detail,
          trackSales: {
            app_name: 'WA',
            app_id: infoMsg.send_by,
            store_id: store,
            customer: member,
            hand_by_customer: true,
            no_plat: unit,
            latitude,
            longtitude,
            order_at: times
          },
          orderRequest: {
            store_id: store,
            text_msg: 'Request Order.',
            times: created_at
          }
        }

        const rs = await srvInsertQueueSales(packData, workorder)

        if(rs.success) {
          
          const currQueue = await srvGetOneQueueById(rs.queueId)

          // delete pending queue
          await srvDeletePendingWO(recordId)

          if(!!packData.restrictItem) {
            _socket.queueApprovalNotif(packData.socketId, packData.storeid, 'getfeedback')
          }

          if(typeof verified_wa_number === 'string') {
            const templates = await srvGetTemplateMessageByCode('FLOW-SLS-CNFRM-WO-SUCC', {
              QueueNo: rs.queue,
              QueueID: rs.queueId,
              ConfirmID: rs.confirmId
            }, true)
            const contentText = ((templates.content_body || {}).content || '')
            const contentDynamic = ((templates.content_body || {}).dynamic || null)

            await sendMessages({
              priority: true,
              activation_key: infoMsg.activation_id,
              sendTo: [verified_wa_number],
              textMsg: contentText,
              dynamicMessages: contentDynamic
            })
          }

          _socket.bulkSendBroadcast(
            'NOTIF-MENU-SALES',
            'activatePendingQueue',
            { STORE: (store || '').toString() },
            {
              record_id: recordId,
              newQueue: (currQueue || {})
            })
        }
      }
    }
    return
  } catch (er) {
    throw er
  }
}

async function confirmOrderReject (opts, payload, data, infoMsg) {
  console.log('Reject Confirm Order', data)
}

async function confirmPayment (opts, payload, data, infoMsg) {
  if(opts === 'Y') {
    const { dataInfo, ...others } = data
    const times = moment()
    srvSignConfirmPayments(dataInfo.confirm_id, dataInfo.queue, times).then(async updated => {
      if(updated[0] === 1) {
        const updatedData = ((updated[1] || [])[0] || {})
        
        const templates = await srvGetTemplateMessageByCode('FLOW-SLS-CNFRM-PAYM-SUCC', data.dataInfo, true)
        const contentText = ((templates.content_body || {}).content || '')

        // update status confirmation payment of queue sales here.
        await sendMessages({
          priority: true,
          activation_key: infoMsg.activation_id,
          sendTo: [infoMsg.send_by],
          textMsg: contentText
        })

        _socket.bulkSendBroadcast(
          'NOTIF-MENU-SALES',
          'activatePendingPayment',
          { STORE: (updatedData.store_id || '').toString() },
          {
            header_id: dataInfo.header,
            confirm_payment_by: dataInfo.member_code,
            confirm_payment_at: moment(times).unix(),
            confirm_payment: true
          }
        )
      }
    })
  }
}

async function setCustomerLocations (opts, payload, data, infoMsg, messagePayloads) {
  const { confirm_id: confirmId, queue_no, queue_id } = (data.dataInfo || {})
  const [latitude, longtitude] = Array.isArray(messagePayloads.locationMsg) ? messagePayloads.locationMsg : []

  if(typeof confirmId === 'string' && typeof latitude === 'number' && typeof longtitude === 'number') {
    const setAt = moment()
    srvSetLocationCustomers(confirmId, { latitude, longtitude, queue_no }, setAt).then(ok => {
      if(ok[0] > 0) {
        const tmpItems = ((ok[1] || [])[0] || {})
        _socket.bulkSendBroadcast(
          'NOTIF-MENU-SALES',
          'setCustomerLocations',
          { STORE: (tmpItems.store_id || '').toString() },
          {
            id: confirmId,
            queue_no,
            queue_id,
            location: typeof tmpItems.latitude === 'number' && typeof tmpItems.longtitude === 'number' ? `${tmpItems.latitude},${tmpItems.longtitude}` : null
        })
      }
    })
  }
}

async function setTapInMechanic (opts, payload, data, infoMsg, messagePayloads) {
  const dataInfo = (data.dataInfo || {})
  try {
    const mechLocation = Array.isArray(messagePayloads.locationMsg) ? messagePayloads.locationMsg : []
    let custLocation = (dataInfo.customer_location || '').split(',')

    const resultDistance = await srvGetDistanceTwoPointByRoute(mechLocation, custLocation)
    const distances = (resultDistance.distances || {})

    if(!resultDistance) {
      throw { localErrors: true, message: 'Lokasi customer tidak ditemukan.' }
    }

    const timesNow = moment()
    const currTapIn = await srvSetTapInMechanics({
      times: timesNow,
			store_id: dataInfo.store,
			app_name: 'WA',
			mechanic_contact: infoMsg.send_by,
			mechanic_code: dataInfo.mechanic_code,
      mechanic_name: dataInfo.mechanic_name,
      latitude: mechLocation[0],
			longtitude: mechLocation[1],
      queue_no: dataInfo.queue_no,
      queue_id: dataInfo.queue_id,
    })
    

    // if success sent message in between of customer & mechanics, to share the notification about progress.

    // sent notif to customer
    const templateMechOtw = await srvGetTemplateMessageByCode('FLOW-SLS-MECH-OTW', {
      CustomerName: dataInfo.customer_name,
      MechanicName: dataInfo.mechanic_name,
      MechanicContact: infoMsg.send_by
    }, true)


    await sendMessages({
      priority: true,
      activation_key: infoMsg.activation_id,
      sendTo: [dataInfo.customer_contact],
      textMsg: ((templateMechOtw.content_body || {}).content || '')
    })

    // sent notif to mechanics
    const templateAfterTapIN = await srvGetTemplateMessageByCode('FLOW-SLS-CNFRM-TAPOUT-MCH', {
      StoreID: dataInfo.store,
      QueueID: dataInfo.queue_id,
      QueueNo: dataInfo.queue_no,
      MechanicName: dataInfo.mechanic_name,
      ConfirmID: currTapIn.confirm_id,
      StartTime: timesNow.unix(),
      Distances: (distances.km || 0).toFixed(2)
    }, true)

    await sendMessages({
      priority: true,
      activation_key: infoMsg.activation_id,
      sendTo: [infoMsg.send_by],
      textMsg: ((templateAfterTapIN.content_body || {}).content || ''),
      dynamicMessages: ((templateAfterTapIN.content_body || {}).dynamic || {})
    })

    _socket.bulkSendBroadcast(
      'NOTIF-MENU-SALES',
      'mechanicProgress',
      { STORE: (dataInfo.store || '').toString() },
      {
        type: 'TAP-IN',
        data: {
          queue_id: dataInfo.queue_id,
          id: currTapIn.confirm_id,
          app_name: currTapIn.app_name,
          mechanic: currTapIn.employee,
          app_id: currTapIn.app_id,
          tap_in_at: currTapIn.tap_in ? moment(currTapIn.tap_in).unix() : null,
          tap_out_at: currTapIn.tap_out ? moment(currTapIn.tap_out).unix() : null,
          in_location: typeof currTapIn.in_latitude === 'number' && typeof currTapIn.in_longtitude === 'number' ? `${currTapIn.in_latitude},${currTapIn.in_longtitude}` : null,
          out_location: typeof currTapIn.out_latitude === 'number' && typeof currTapIn.out_longtitude === 'number' ? `${currTapIn.out_latitude},${currTapIn.out_longtitude}` : null,
          distanceKM: distances.km
        }
    })
  } catch (er) {
    throw er
  }
}

async function setTapOutMechanic (opts, payload, data, infoMsg, messagePayloads) {
  const dataInfo = (data.dataInfo || {})
  try {
    const mechLocation = Array.isArray(messagePayloads.locationMsg) ? messagePayloads.locationMsg : []

    const timesNow = moment()
    const currTapOut = await srvSetTapOutMechanics(dataInfo.confirm_id, {
      times: timesNow,
			store_id: dataInfo.store,
      latitude: mechLocation[0],
      mechanic_name: dataInfo.mechanic_name,
			longtitude: mechLocation[1],
      queue_no: dataInfo.queue_no,
      queue_id: dataInfo.queue_id
    })

    _socket.bulkSendBroadcast(
      'NOTIF-MENU-SALES',
      'mechanicProgress',
      { STORE: (dataInfo.store || '').toString() },
      {
        type: 'TAP-OUT',
        data: {
          queue_id: dataInfo.queue_id,
          id: currTapOut.confirm_id,
          app_name: currTapOut.app_name,
          mechanic: currTapOut.employee,
          app_id: currTapOut.app_id,
          tap_in_at: currTapOut.tap_in ? moment(currTapOut.tap_in).unix() : null,
          tap_out_at: currTapOut.tap_out ? moment(currTapOut.tap_out).unix() : null,
          in_location: typeof currTapOut.in_latitude === 'number' && typeof currTapOut.in_longtitude === 'number' ? `${currTapOut.in_latitude},${currTapOut.in_longtitude}` : null,
					out_location: typeof currTapOut.out_latitude === 'number' && typeof currTapOut.out_longtitude === 'number' ? `${currTapOut.out_latitude},${currTapOut.out_longtitude}` : null
        }
    })
  } catch (er) {
    // do somethings
    throw er
  }
}


export default async function FlowSales (matchKey, matchPayload, dataBody, infoMsg, messagePayloads) {
  try {
    if(dataBody.type === 'CONFIRM-ORDER') {
      await confirmOrder(matchKey, matchPayload, dataBody, infoMsg, messagePayloads)
    } else if (dataBody.type === 'CONFIRM-ORDER-REJECT') {
      await confirmOrderReject(matchKey, matchPayload, dataBody, infoMsg, messagePayloads)
    } else if (dataBody.type === 'SET-CUST-LOCATION') {
      // await setCustomerLocations(matchKey, matchPayload, dataBody, infoMsg, messagePayloads)
    } else if (dataBody.type === 'CONFIRM-PAYMENT') {
      await confirmPayment(matchKey, matchPayload, dataBody, infoMsg, messagePayloads)
    } else if (dataBody.type === 'SET-MECH-LOCATION-TAPIN') {
      await setTapInMechanic(matchKey, matchPayload, dataBody, infoMsg, messagePayloads)
    } else if (dataBody.type === 'SET-MECH-LOCATION-TAPOUT') {
      await setTapOutMechanic(matchKey, matchPayload, dataBody, infoMsg, messagePayloads)
    }
    return
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