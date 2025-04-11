import dbv from '../../../../models/viewR'
import db from '../../../../models/tableR'
import { setDefaultQuery } from '../../../../utils/setQuery'
import moment from 'moment'

const tbCOA = db.tbl_chart_of_account
const vwCOA = dbv.vw_chart_of_account_tree

const attrCoa = [
  'coacode',
  'coaname',
  'paths',
  'level',
  'levelpath',
  'coadesc',
  'coatypeid',
  'coatypecode',
  'coatypename',
  'createdby',
  'createdat',
  'updatedby',
  'updatedat',
  'active',
  'sortingindex',
  'coaparentid',
  'coaparentcode'
]

export function srvCreateCOA (data, user) {
  return tbCOA.create({
    coacode: data.coacode.toString().toUpperCase(),
    coaname: data.coaname,
    coatype: data.coatype,
    coaparent: data.coaparent,
    coadesc: data.coadesc,
    sortingindex: data.sortingindex,
    createdby: user,
    createdat: moment(),
    active: data.active
  })
}

export function srvUpdateCOA (data, coacode, user) {
  return tbCOA.update({
    coaname: data.coaname,
    coatype: data.coatype,
    coaparent: data.coaparent || null,
    coadesc: data.coadesc,
    sortingindex: data.sortingindex,
    updatedby: user,
    updatedat: moment(),
    active: data.active
  }, { where: { coacode: coacode } })
}

export function srvGetCOA (query) {
  const { activeOnly = false } = query 
  return vwCOA.findAll({
    attributes: attrCoa,
    where: { ...( activeOnly.toString() === 'true' ? { active: true } : {}) },
    raw: false
  })
}

export function srvGetLovCOA () {
  return vwCOA.findAll({
    attributes: ['coacode', 'coaname', 'coaparentcode' ],
    where: { active: true },
    raw: true
  })
}

export function srvGetLovCOAChild () {
  return vwCOA.findAll({
    attributes: ['coacode', 'coaname'],
    where: { active: true },
    raw: true
  })
}


export function srvGetOneCOAByCode (coacode) {
  return vwCOA.findOne({
    attributes: ['id', ...attrCoa],
    where: { coacode },
    raw: true
  })
}