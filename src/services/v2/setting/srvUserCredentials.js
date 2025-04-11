import moment from 'moment'
import crypto from 'crypto'
import Sequelize from 'sequelize'
import sequelize from '../../../native/sequelize'
import db from '../../../models'
import dbr from '../../../models/tableR'
import dbvr from '../../../models/viewR'
import * as svStores from '../master/store/srvStore'
import * as svMisc from '../../v1/miscService'
import { setDefaultQuery } from '../../../utils/setQuery'
import { saltHashPassword } from '../../v1/securityService'
import { srvGetTemplateMessageByCode } from '../../v2/other/srvMessageTemplate'
import { sendMessagesTemplate } from '../../v2/other/WA-Bot/srvWA'

const tbUser = db.tbl_user
const tbUserRole = db.tbl_user_role
const tbUserStore = dbr.tbl_user_store

const vwUserStore = dbvr.vw_user_store
const vwUserRole = dbvr.vw_user_role

const attrUsers = {
  mf: [
    'userid', 'username', 'email', 'fullname', 'active', 'isemployee', 'hash', 'salt',
    'totp', 'resetPassword', 'createdat', 'createdby', 'updatedat', 'updatedby',
  ],
  bf: [
    'userid', 'username', 'email', 'fullname', 'active', 'isemployee', 'totp',
    'createdat', 'createdby', 'updatedat', 'updatedby',
  ],
  mnf: ['userid', 'username', 'email', 'fullname'],
  lov: [['userid', 'key'], ['username', 'label']],
}


async function notifyUserInfoByWA (code, data) {
  try {
    const STORES = Array.isArray(data.stores) ? data.stores : []
    const ROLES = Array.isArray(data.roles) ? data.roles : []

    const mappingStores = STORES.map(a => `${a.storename} (${a.storecode})`)
    const mappingRoles = ROLES.map(a => `${a.miscdesc} (${a.miscname})`)

    const currTemplate = await srvGetTemplateMessageByCode(code, {
      "ROLES": mappingRoles.join(' || '),
      "INPUT_BY": data.input_by,
      "USER_ID": data.userid,
      "USER_NAME": data.username,
      "EMAIL": data.email,
      "STATUS": +(data.active || false) === 1 ? 'Aktif' : 'Tdk Aktif',
      "STORES": mappingStores.join(' || ')
    }, true)

    if(!currTemplate) throw new Error('Template is nt found.')
    const {
      activation,
      templateID,
      config,
      sendTo
    } = currTemplate.content_body

    const results = await sendMessagesTemplate({
      activation_key: activation,
      templateID,
      config,
      sendTo
    })

    return results
  } catch (er) {
    return { status: false, message: er.message }
  }
}

export function srvGetSomeUsers (query) {
  const { m, ...other } = query
  let tmpAttrs = attrUsers[m || 'lov'] || attributes['lov']
  let queryDefault = setDefaultQuery(tmpAttrs, other, ['lov', 'mnf'].indexOf(m) === -1)

  return tbUser.findAndCountAll({
    attributes: attrUsers.bf,
    ...queryDefault,
    order: [['updatedat', 'desc'], ['createdat', 'desc']],
    raw: true
  })
}

export function srvGetOneUserByID (userID) {
  return tbUser.findOne({
    attributes: attrUsers.mf,
    where: { userId: userID },
    raw: true
  })
}

export function srvGetAllUserStores (userID) {
  return vwUserStore.findAll({
    attributes: ['storecode', 'storename', [Sequelize.literal('case when defaultstore = 1 then true else false end'), 'isdefault']],
    where: { userId: userID },
    raw: true
  })
}

export function srvGetAllUserRoles (userID) {
  return vwUserRole.findAll({
    attributes: [['userrole', 'rolecode'], ['userrolename', 'rolename'], [Sequelize.literal('case when defaultrolestatus = 1 then true else false end'), 'isdefault']],
    where: { userId: userID },
    raw: true
  })
}


export async function srvCreateNewUser (data = {}, infos = {}) {
  const transaction = await sequelize.transaction()
  try {
    const times = moment()

    const randomPassword = crypto.randomBytes(Math.ceil(3)).toString('hex').slice(0, 6)
    const parser = saltHashPassword(randomPassword)
    const stores = Array.isArray(data.stores) ? data.stores : []
    const roles = Array.isArray(data.roles) ? data.roles : []

    const listStores = await svStores.srvFindAllStoresByCode(stores)
    const listRoles = await svMisc.getAllMiscByCodeNames('USERROLE', roles)

    await tbUser.create({
      userId: data.userid,
      userName: data.username,
      email: data.email,
      fullName: data.fullname,
      active: +data.active,
      isEmployee: +(data.isemployee || false),
      hash: parser.hash,
      salt: parser.salt,
      totp: (data.totp || null),
      resetPassword: 1,
      createdBy: infos.userid,
      createdAt: times
    }, { transaction, raw: true })

    await tbUserRole.bulkCreate(
      listRoles.map(a => ({
        userId: data.userid,
        userRole: a.miscname,
        defaultrole: +(data.defaultRole === a.miscname),
        createdBy: infos.userid,
        createdAt: times
      })),
      { transaction, raw: true }
    )

    await tbUserStore.bulkCreate(
      listStores.map(a => ({
        userid: data.userid,
        userstoreid: a.id,
        defaultstore: +(data.defaultStore === a.storecode),
        createdBy: infos.userid,
        createdAt: times
      })),
      { transaction, raw: true }
    )
    
    notifyUserInfoByWA('ADD-NEW-USER', {
      input_by: infos.userid,
      userid: data.userid,
      username: data.username,
      fullname: data.fullname,
      email: data.email,
      active: data.active,
      roles: listRoles,
      stores: listStores
    })

    const toReturn = {
      newPassword: randomPassword,
      userId: data.userid
    }
    await transaction.commit()
    return { success: true, message: `User ${data.username} (${data.userid}) has been added.`, data: toReturn }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}


export async function srvUpdateUserInfo (data = {}, wheres = {}, infos = {}) {
  const transaction = await sequelize.transaction()
  try {
    const existsUser = await srvGetOneUserByID(wheres.userid)
    if(!existsUser) throw new Error('User is not found.')

    await tbUser.update({
      userName: data.username,
      email: data.email,
      fullName: data.fullname,
      active: +data.active,
      totp: (data.totp || null),
      updatedBy: infos.userid,
      updeatedat: moment()
    }, { where: { userId: wheres.userid } }, { transaction })

    notifyUserInfoByWA('EDIT-USER-INFO', {
      input_by: infos.userid,
      userid: wheres.userid,
      username: data.username,
      fullname: data.fullname,
      email: data.email,
      active: data.active
    })

    await transaction.commit()
    return { success: true, message: `User ${data.username} (${existsUser.userid}) has been updated.` }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}

export async function srvResetPasswordUser (userID, infos = {}) {
  const transaction = await sequelize.transaction()
  try {
    const existsUser = await srvGetOneUserByID(userID)
    if(!existsUser) throw new Error('User is not found.')

    const randomPassword = crypto.randomBytes(Math.ceil(3)).toString('hex').slice(0, 6)
    let parser = saltHashPassword(randomPassword)

    await tbUser.update({
      hash: parser ? parser.hash : existsUser.hash,
      salt: parser ? parser.salt : existsUser.salt,
      resetPassword: 1,
      updatedBy: infos.userid,
      updeatedat: moment()
    }, { where: { userId: userID } }, { transaction })

    notifyUserInfoByWA('RESET-PSW-USER', {
      input_by: infos.userid,
      userid: userID,
      username: existsUser.username
    })

    await transaction.commit()
    return {
      success: true,
      message: `Password user ${existsUser.username} (${existsUser.userid}) has been reset.`,
      data: { newPassword: randomPassword }
    }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}


export async function srvUpdateUserStoreInfo (data = {}, wheres = {}, infos = {}) {
  const transaction = await sequelize.transaction()
  const times = moment()
  try {
    const existsUser = await srvGetOneUserByID(wheres.userid)
    if(!existsUser) throw new Error('User is not found.')

    const stores = Array.isArray(data.stores) ? data.stores : []
    const listStores = await svStores.srvFindAllStoresByCode(stores)

    const defaultStoreID = (listStores.filter(a => a.storecode === data.defaultStore)[0] || {}).id

    const currUserStores = await tbUserStore.findAll({
      attributes: ['userstoreid'],
      where: { userId: wheres.userid }
    }).then(items => items.map(a => a.userstoreid))


    // preparing data store configurations
    let created = []
    let updated = []
    let deleted = [...currUserStores]
    for (let a in listStores) {
      const items = listStores[a]
      const indexDelete = deleted.indexOf(items.id)
      
      if(indexDelete !== -1) {
        deleted.splice(indexDelete, 1)
        updated.push(items.id)
      } else {
        created.push(items.id)
      }
    }

    // destroy the list of store user first
    if(deleted.length > 0) await tbUserStore.destroy({ where: { userId: wheres.userid, userstoreid: { $in: deleted } } }, { transaction })

    // updating user store if exists
    if(updated.length > 0) {
      await tbUserStore.update({
        defaultstore: Sequelize.literal(`case when userstoreid::int = ${(defaultStoreID || -1)}::int then 1 else 0 end`),
        updatedBy: infos.userid,
        updatedAt: times
      }, { where: { userId: wheres.userid } }, { transaction })
    }

    // create a new user store if exists
    if(created.length > 0) {
      await tbUserStore.bulkCreate(
        created.map(a => ({
          userid: wheres.userid,
          userstoreid: a,
          defaultstore: +(defaultStoreID === a),
          createdBy: infos.userid,
          createdAt: times
        })),
        { transaction }
      )
    }

    notifyUserInfoByWA('EDIT-USER-STORE', {
      input_by: infos.userid,
      userid: wheres.userid,
      username: existsUser.username,
      stores: listStores
    })

    await transaction.commit()
    return { success: true, message: `Access store of user ${existsUser.username} (${existsUser.userid}) has been updated.` }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}


export async function srvUpdateUserRolesInfo (data = {}, wheres = {}, infos = {}) {
  const transaction = await sequelize.transaction()
  const times = moment()
  try {
    const existsUser = await srvGetOneUserByID(wheres.userid)
    if(!existsUser) throw new Error('User is not found.')

    const roles = Array.isArray(data.roles) ? data.roles : []
    const listRoles = await svMisc.getAllMiscByCodeNames('USERROLE', roles)


    const currUserRoles = await tbUserRole.findAll({
      attributes: ['userRole'],
      where: { userId: wheres.userid }
    }).then(items => JSON.parse(JSON.stringify(items)).map(a => a.userRole))

    // preparing data store configurations
    let created = []
    let updated = []
    let deleted = [...currUserRoles]
    for (let a in listRoles) {
      const items = listRoles[a]
      const indexDelete = deleted.indexOf(items.miscname)
      
      if(indexDelete !== -1) {
        deleted.splice(indexDelete, 1)
        updated.push(items.miscname)
      } else {
        created.push(items.miscname)
      }
    }

    // destroy the list of roles user first
    if(deleted.length > 0) await tbUserRole.destroy({ where: { userId: wheres.userid, userrole: { $in: deleted } } }, { transaction })

    // updating user roles if exists
    if(updated.length > 0) {
      await tbUserRole.update({
        defaultrole: Sequelize.literal(`case when userrole::text = '${data.defaultRole}'::text then 1 else 0 end`),
        updatedBy: infos.userid,
        updatedAt: times
      }, { where: { userId: wheres.userid } }, { transaction })
    }

    // create a new user roles if exists
    if(created.length > 0) {
      await tbUserRole.bulkCreate(
        created.map(a => ({
          userId: wheres.userid,
          userRole: a,
          defaultrole: +(data.defaultRole === a),
          createdBy: infos.userid,
          createdAt: times
        })),
        { transaction, raw: false }
      )
    }

    notifyUserInfoByWA('EDIT-USER-ROLE', {
      input_by: infos.userid,
      userid: wheres.userid,
      username: existsUser.username,
      roles: listRoles
    })

    await transaction.commit()
    return { success: true, message: `Access roles of user ${existsUser.username} (${existsUser.userid}) has been updated.` }
  } catch (er) {
    await transaction.rollback()
    return { success: false, message: er.message }
  }
}