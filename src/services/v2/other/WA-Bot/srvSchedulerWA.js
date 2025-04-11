import cron from 'cron'
import { srvNativeQueryStrings } from '../../../v2/setting/srvNativeQuery'
import { srvGetTemplateMessageByCode } from '../../../v2/other/srvMessageTemplate'

const CronJob = cron.CronJob

new CronJob({
  
})


async function registerGreetingBirthday () {
  try {
    const dataBirthdays = await srvNativeQueryStrings({
      typeQuery: stringQuery,
      wa_no: infos.send_by,
      ...otherPayloads
    })

    const listData = dataBirthdays.data.reduce((a, b) => ({
      // uniq: typeof a.uniq[b.activation] !== 'string' ? { ...a, [] }
    }), { uniq: [], data: [] })
    
  } catch (er) {
    console.log(er)
  }
}


export default async function startScheduleWA () {
  await registerGreetingBirthday()
}