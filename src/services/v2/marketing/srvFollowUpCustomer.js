import dbv from '../../../models/viewR'
import { setDefaultQuery } from '../../../utils/setQuery'
import moment from 'moment'

const custReminder = dbv.vw_reminder_customer_groups
const customerChecks = dbv.vw_reminder_customer_checks
const customerProducts = dbv.vw_reminder_customer_product


const mainAttrReminder = [
  'memberid', 'membercode', 'membername', 'policenoid', 'policeno', 'totalcheck', 'totalusage',
  'unityear', 'phonenumber', 'mobilenumber', 'typeunit', 'modelunit', 'merkunit'
]

const attrCheck = [
  'lastid', 'memberid', 'membercode', 'membername', 'policenoid', 'policeno', 'checktype', 'checkname', 'unityear',
  'lastcheckkm', 'last_timein', 'usagemileage', 'usageperiod', 'diffdaymileage', 'nextcheckmileage', 'diffdayperiod',
  'nextcheckperiod', 'actualnextcheck'
]

const attrProduct = [
  'lastid', 'memberid', 'membercode', 'membername', 'policenoid', 'policeno', 'productid', 'productcode', 'productname', 'unityear',
  'lastusagekm', 'last_timein', 'usagemileage', 'usageperiod', 'diffdaymileage', 'nextusagemileage', 'diffdayperiod', 'nextusageperiod',
  'actualnextusage'
]

export function srvReminderCustomerMain (query) {
  let queryDefault = setDefaultQuery(mainAttrReminder, query, true)
  return custReminder.findAndCountAll({
    attributes: mainAttrReminder,
    ...queryDefault,
    raw: true
  })
}


export function srvReminderCustomerChecks (query) {
  const { member, policeno, type } = query
  return customerChecks.findAndCountAll({
    attributes: attrCheck,
    where: {
      membercode: member,
      policeno: policeno,
      ...(type !== 'include' ? {actualnextcheck: { $lte: moment().format('YYYY-MM-DD') }} : {})
    },
    raw: false
  })
}


export function srvReminderCustomerProducts (query) {
  const { member, policeno, type } = query
  return customerProducts.findAndCountAll({
    attributes: attrProduct,
    where: {
      membercode: member,
      policeno: policeno,
      ...(type !== 'include' ? {actualnextusage: { $lte: moment().format('YYYY-MM-DD') }} : {})
    },
    raw: false
  })
}