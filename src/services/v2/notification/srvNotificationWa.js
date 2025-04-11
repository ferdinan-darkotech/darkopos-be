import axios from 'axios'
import dbt from '../../../models/tableR'
import { isEmptyObject } from '../../../utils/operate/objOpr'
import { getMiscByCodeName } from '../../../services/v1/miscService.js'

let NotifProposal = dbt.tbl_notification_proposal
let NotifLog = dbt.tbl_notification_log

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Authorization": "Basic NjY0NzE3MTYtMzc3ZC00YmY5LWJhNzQtOGRiMWM1ZTNhNzBh"
}
// 0bfdc779-413a-4305-9a08-c01dcf2cd005
const defaultBody = {
  "app_id": "429d3472-da0f-4b2b-a63e-4644050caf8f",
  "include_player_ids": [
    "from-db"
  ],
  "data": {
    "type": "Reminder",
    "message": "Template",
    "no_wa": "6287868584838"
  },
  "contents": {
    "en": "Darko-POS"
  },
  "headings": {
    "en": "Darko-POS Notice"
  }
}


async function pushWa (body) {
  try {
    const getCSID = await getMiscByCodeName('NOTIF', 'NOTIFWACSID')

    defaultBody.include_player_ids[0] = getCSID.miscVariable
    defaultBody.data.message = body.message
    defaultBody.data.no_wa = body.no_wa
    return await axios.post('https://onesignal.com/api/v1/notifications', defaultBody, { headers })
      // .then(x => new Promise(resolve => setTimeout(() => resolve(x), 1000)))

    // setTimeout(function() {
    // }, 3000);

  } catch (err) {
    console.error('ZSWA-00001: ', err)
  }
}

export function checkLogExists (referenceId) {
  return NotifLog.findOne({
    where: {
      referenceId
    },
    raw: true
  })
}


export function srvPushWa (message) {
  const referenceId = message.id
  // update proposal send
  return NotifProposal.update({
    status: 'S',
    updatedBy: 'be'
  },
  { where: { id: referenceId } }
  ).catch(err => {
    console.error('ZSWA-00003: ', err)
  })
}
