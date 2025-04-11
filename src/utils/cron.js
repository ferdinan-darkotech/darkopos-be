import cron from 'cron'
import dbt from '../models/tableR'
import dbv from '../models/viewR'
import { srvPushWa } from '../services/v2/notification/srvNotificationWa'
import { getMiscByCodeName } from '../services/v1/miscService.js'
import { getNativeQuery } from '../native/nativeUtils'
import { getRandomIntMax } from './random'

const CronJob = cron.CronJob
const notifType = dbt.tbl_notification_type
const timerPattern002 = dbv.vwi_notification_template_002
const timerPattern006 = dbv.vwi_notification_template_006
const notifProposalApprove002 = dbv.vwi_notification_proposal_002
const notifProposalApprove008 = dbv.vwi_notification_proposal_008

const getNotifTypeId = (typeCode) => {
  return notifType.findOne({
    where: {code: typeCode}
  })
}

const getTimer = (typeId) => {
  // return timerPattern002.findAll({
  return timerPattern006.findAll({
    where: { typeId }
  })
}
const getNotifProposalApprove002 = (groupCode, timerPattern) => {
  return notifProposalApprove002.findAll({
    where: { code: groupCode, timerPattern  }
  })
}

const getNotifProposalApprove008 = (groupCode, id) => {
  return notifProposalApprove008.findAll({
    where: { code: groupCode, id  },
    order: [['id','ASC']]
  })
}

const getMessageWA = async (groupCode, id, timerPattern, traceTime) => {
  getNotifProposalApprove008(groupCode, id).then(async (notif) => {
    // begin - replace content with dataInfo
    for(let idx in notif) {
      const body = {
        "id": notif[idx].id,
        "type": notif[idx].code,
        "message": notif[idx].content,
        "no_wa": notif[idx].dataContact,
        "time": new Date().toLocaleTimeString(),
        "timerPattern": timerPattern,
        "traceTime": traceTime
      }
      await srvPushWa(body).then((result) => {
        console.log('result', result.data)
      }).catch(err => console.log(err))
    }
    // replace content with dataInfo - end
  })
}

const sendViaWA = () => {
  const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs))
  //get WA typeId
  getNotifTypeId('TWA').then((typeIdWA) => {
    if (typeIdWA) {
      //get timer for WA
      getTimer(typeIdWA.id).then((timer) => {
        let crons = []
        // loop timer for WA
        for(let idx in timer) {
          // console.log('zzzidxtimer', timer[idx].timerPattern)
          crons[idx] = new CronJob(
            timer[idx].timerPattern,
            () => {
              try {
                const traceTime = new Date().toLocaleTimeString()
                getMessageWA(timer[idx].groupCode, timer[idx].id, timer[idx].timerPattern, traceTime)
                // sleep(200).then(() => {
                //   getMessageWA(timer[idx].groupCode, timer[idx].timerPattern, traceTime)
                // })
                // getMessageWA(timer[idx].groupCode, timer[idx].timerPattern, traceTime)
                // await sleep(10000) // sleep for 10 seconds
                // sleep(10000).then(() => {
                //   console.log("ten seconds has elapsed")
                //   transformMessageWA(timer[idx].groupCode, timer[idx].timerPattern)
                // })
              } catch (err) {
                // Handle error
                console.log('err', err)
              }
            },
            () => {
              console.log('on Complete')
            },
            true,
            'Asia/Jakarta'
          )
        }
      })
    }
  })


  // const job = new CronJob(
  //   // "0 0 */1 * * *", // run every 1 hour
  //   "0 */1 * * * *", // run every 1 minute
  //   () => {
  //     // const d = new Date();
  //     console.log("on Tick:")

  //     // long running task
  //   },
  //   () => {
  //     console.log("on Complete")
  //   },
  //   true
  // )
}

export const schedulePeriodicCheckJob = async () => {
  const checkWA = await getMiscByCodeName('NOTIF', 'NOTIFWA')
  const checkApplyWA = JSON.parse(JSON.stringify(checkWA))
  if (checkApplyWA) {
    if (checkApplyWA.miscVariable === 'T01'|| checkApplyWA.miscVariable === 'T02') {
      const job = new CronJob(
        "0 */10 * * * *", // run every 1 minute
        () => {
          console.log("on Tick: Check WA")
          sendViaWA()
        },
        () => {
          console.log("on Complete")
        },
        true
      )
    }
  }
}

