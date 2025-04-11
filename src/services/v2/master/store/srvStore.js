import { map } from 'bluebird'
import Sequelize from 'sequelize'
import db from '../../../../models'
import dbr from '../../../../models/tableR'
import dbv from '../../../../models/view'
import dbvr from '../../../../models/viewR'

const tbStore = db.tbl_store
const tbUserStore = dbr.tbl_user_store
const vwStoreTreeLOV = dbvr.vw_lov_store_tree
const vwStore = dbv.vw_store
const vwStoreGroupParent = dbvr.vw_store_group_parent
const storeBranch = dbr.tbl_store_branch



const fullAttributes = [ ['storeid', 'id'], 'storeParentId', 'storeCode', 'storeName', 'address01', 'address02',
'phoneNumber', 'mobileNumber', 'email', 'taxId', 'taxConfirmDate', 'taxType', 'initial', 'shortName',
'companyName', 'companyAddress01', 'companyAddress02', 'companyPhoneNumber', 'companyMobileNumber',
'companyEmail', 'storeCodeLong' ]

const vwStoreBasic = [ ['storeid', 'id'], 'storeCode', 'storeName', 'address01', 'address02',
'phoneNumber', 'mobileNumber', 'email', 'taxId', 'taxConfirmDate', 'taxType' ]

const minFields1 = [
  ['storeid', 'id'],'storeCode','storeName','address01','address02',
  'phoneNumber','mobileNumber','email','taxType',
  'taxID','taxConfirmDate','companyName',
]

const minFields2 = [
  'storeCode','storeName','address01','address02',
  'phoneNumber','mobileNumber','email', 'storeCodeLong'
]

const minFields3 = [[Sequelize.literal('storeid::int'), 'id'],'storeCode','storeName','storeParentId']


export function srvFindAllStoreByParent (parent = -1, flat = null) {
  return storeBranch.findAll({
    attributes: [['store_id', 'id'], 'store_code'],
    where: { parent_store_id: parent },
    raw: true
  }).then(res => {
    if(typeof flat === 'string') {
      return res.map(x => x[flat])
    }
    return res
  }).catch(er => er)
}

export function srvFindAllStoresByCode (codes = []) {
  return tbStore.findAll({
    attributes: ['id', 'storecode', 'storename'],
    where: { storecode: { $in: codes } },
    raw: true
  })
}


export function srvGetStoreBranch (store = null) {
  return storeBranch.findOne({
    attributes: ['store_id', 'store_code', 'parent_store_id', 'parent_store_code'],
    where: {
      status: { $eq: true },
      $or: [{ store_code: (store || '').toString() }, { '': Sequelize.literal(`store_id::text = '${(store || '').toString()}'`) }],
    },
    raw: true
  })
}

export async function srvGetGroupStoreBranchByID (store, includeParentSetting = false) {
  try {
    let extended = {}
    const current = await storeBranch.findOne({
      attributes: ['store_id', 'parent_store_id'],
      where: {
        status: { $eq: true },
        store_id: store
      },
      raw: true
    })

    if(!current) throw new Error('Group store is unrecognized.')

    const lists = await storeBranch.findAll({
      attributes: ['store_id', 'parent_store_id'],
      where: {
        status: { $eq: true },
        parent_store_id: current.parent_store_id
      },
      raw: true
    })

    if(includeParentSetting) {
      extended['parentSetting'] = (await tbStore.findOne({
        attributes: ['settingvalue'],
        where: { id: current.parent_store_id },
        raw: true
      }) || {}).settingvalue
    }

    return {
      base: current,
      siblings: lists.map(a => a.store_id).join(','),
      ...extended
    }
  } catch (er) {
    throw new Error(er.message)
  }
}

export function srvGetStoreBranchSetting (store = null) {
  return new Promise((resolve) => {
    let storeFilter = null
    if(typeof store === 'number') {
      storeFilter = { store_id: store }
    } else if(typeof store === 'string') {
      storeFilter = { store_code: store }
    }
    
    return storeBranch.findOne({
      attributes: ['store_code', 'parent_store_code'],
      where: { status: { $eq: true }, ...storeFilter },
      raw: true
    }).then(store => {
      if(!store) throw new Error('Store branch is not defined.')
      
      return tbStore.findOne({
        attributes: ['settingvalue'],
        where: { storecode: store.parent_store_code },
        raw: true
      }).then(sett => {
        return resolve({
          ...store,
          settingparent: (sett.settingvalue || null)
        })
      }).catch(er => { throw new Error(er.message) })
    }).catch(er => { throw new Error(er.message) })
  })
}

export async function srvGetAllStore (query, userid = null) {
  return new Promise(async resolve => {
    const isOwnedOnly = query.ownedOnly === 'Y'

    let orders = [['storeCodeLong', 'ASC']]
    let tmpModels = vwStore

    let attributes = []
    switch(query.m) {
      case 'mf':
        attributes = minFields1; break
      case 'bf':
        attributes = minFields2; break
      case 'lov':
        attributes = minFields3
        orders = [['level', 'asc']]
        tmpModels = vwStoreTreeLOV
        break
      default: attributes = minFields1
    }

    let listOwned = null
    
    try {
      if(isOwnedOnly) {
        listOwned = await tbUserStore.findAll({
          attributes: ['userstoreid'],
          where: { userid },
          raw: true
        })
      }
    } catch (er) {
      listID = []
    }

    return resolve(
      tmpModels.findAll({
        attributes,
        where: {
          ...(
            isOwnedOnly ? { storeid: { $in: listOwned.map(x => x.userstoreid.toString()) } } : {}
          )
        },
        order: orders,
        raw: false
      })
    )
  })
}

export function srvGetExistingUserStore (userID, storeCode) {
  return srvGetExistingStoreByCode(storeCode).then(str => {
    if(!str) throw new Error('Store code is not found.')

    return tbUserStore.findOne({
      attributes: ['*'],
      where: { userid: userID, userstoreid: str.id },
      raw: true
    }).then(ustr => {
      if(!ustr) throw new Error('You have no access to this store.')

      return ustr
    }).catch(er => { throw new Error(er.message) })
  }).catch(er => { throw new Error(er.message) })
}

export function srvGetExistingStoreByCode (storeCode) {
  return tbStore.findOne({
    attributes: ['*'],
    where: { storecode: storeCode },
    raw: true
  })
}

export function srvGetStoreCode (id) {
  return tbStore.findOne({
    attributes: [['id', 'store_id'], ['storecode', 'store_code']],
    where: { id },
    raw: true
  })
}

export function srvGetStoresByCode (storeCode, type = 'bf') {
  return vwStore.findOne({
    attributes: type === 'bf' ? vwStoreBasic : fullAttributes,
    where: { storeCode },
    raw: false
  })
}

export function srvGetStoreSetting (storecode) {
  return vwStore.findOne({
    attributes: ['storecode', 'storeparentcode', 'settingvalue'],
    where: { storecode },
    raw: true
  })
}

export function srvGetSettingParentStore (storecode = '', specifiedValue = [], type = 'both') {
  return vwStoreGroupParent.findOne({
    attributes: ['*'],
    where: { storecode },
    raw: true
  }).then(data => {
    let tmpData = (data || {})
    for(let x in specifiedValue) {
      tmpData.settingvalue = (tmpData.settingvalue || {})[specifiedValue[x]]
      tmpData.parent_settingvalue = (tmpData.parent_settingvalue || {})[specifiedValue[x]]
    }
    
    const { storeid, settingvalue: setting, parent_settingvalue: parent_setting } = tmpData
    if(type === 'both') {
      return { storeid, setting, parent_setting }
    } else if (type === 'parent') {
      return { storeid, setting: parent_setting }
    } else {
      return { storeid, setting }
    }
  }).catch(er => er)
}
